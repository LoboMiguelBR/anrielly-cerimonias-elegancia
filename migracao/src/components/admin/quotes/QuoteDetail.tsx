
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, Download, Trash2 } from 'lucide-react';
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { PDFDownloadLink } from '@react-pdf/renderer';
import ProposalPDF from '@/components/admin/ProposalPDF';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useMobileLayout } from '@/hooks/useMobileLayout';

interface QuoteDetailProps {
  quoteRequest: any;
  open: boolean;
  onClose: () => void;
  onStatusChange: (id: string, status: string) => Promise<void>;
}

const QuoteDetail = ({ quoteRequest, open, onClose, onStatusChange }: QuoteDetailProps) => {
  const [status, setStatus] = useState(quoteRequest?.status || 'aguardando');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [proposal, setProposal] = useState<any>(null);
  const [loadingProposal, setLoadingProposal] = useState(false);
  const { isMobile } = useMobileLayout();
  const navigate = useNavigate();

  const handleStatusChange = async (newStatus: string) => {
    if (!quoteRequest || newStatus === status) return;
    
    setIsUpdating(true);
    setStatus(newStatus);
    try {
      await onStatusChange(quoteRequest.id, newStatus);
      toast.success("Status atualizado com sucesso");
    } catch (error) {
      toast.error("Erro ao atualizar status");
      setStatus(quoteRequest.status);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCreateProposal = () => {
    navigate(`/admin/dashboard?tab=proposals&quoteId=${quoteRequest.id}`);
    onClose();
  };

  const fetchProposal = async () => {
    if (!quoteRequest) return;
    
    try {
      setLoadingProposal(true);
      const { data, error } = await supabase
        .from('proposals')
        .select('*')
        .eq('quote_request_id', quoteRequest.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
        
      if (error) {
        throw error;
      }
      
      if (data) {
        const formattedProposal = {
          ...data,
          services: Array.isArray(data.services) ? data.services : []
        };
        setProposal(formattedProposal);
      }
      
    } catch (error: any) {
      console.error('Erro ao buscar proposta:', error);
    } finally {
      setLoadingProposal(false);
    }
  };

  const handleDeleteQuote = async () => {
    if (!quoteRequest) return;
    
    setIsDeleting(true);
    try {
      const { data: linkedProposals, error: checkError } = await supabase
        .from('proposals')
        .select('id')
        .eq('quote_request_id', quoteRequest.id);
        
      if (checkError) throw checkError;
      
      if (linkedProposals && linkedProposals.length > 0) {
        toast.error("Não é possível excluir um orçamento que possui propostas vinculadas");
        setShowDeleteDialog(false);
        return;
      }
      
      const { error } = await supabase
        .from('quote_requests')
        .delete()
        .eq('id', quoteRequest.id);
        
      if (error) throw error;
      
      toast.success("Orçamento excluído com sucesso");
      onClose();
    } catch (error: any) {
      console.error('Erro ao excluir orçamento:', error);
      toast.error(`Erro ao excluir orçamento: ${error.message}`);
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };
  
  useEffect(() => {
    if (open && quoteRequest && quoteRequest.status === 'proposta') {
      fetchProposal();
    }
  }, [open, quoteRequest]);

  if (!quoteRequest) return null;

  const DetailContent = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-1">Cliente</h3>
        <p className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold`}>
          {quoteRequest.name}
        </p>
      </div>

      <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Email</h3>
          <p className={`${isMobile ? 'text-sm break-all' : ''}`}>
            {quoteRequest.email}
          </p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Telefone</h3>
          <p>{quoteRequest.phone}</p>
        </div>
      </div>

      <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Tipo de Evento</h3>
          <p>{quoteRequest.event_type}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Data do Evento</h3>
          <p>{quoteRequest.event_date ? new Date(quoteRequest.event_date).toLocaleDateString('pt-BR') : 'Não definida'}</p>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-1">Local do Evento</h3>
        <p className={`${isMobile ? 'text-sm' : ''}`}>{quoteRequest.event_location}</p>
      </div>

      {quoteRequest.message && (
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Mensagem</h3>
          <p className={`${isMobile ? 'text-sm' : 'text-sm'} text-gray-700 whitespace-pre-wrap`}>
            {quoteRequest.message}
          </p>
        </div>
      )}

      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-2">Status</h3>
        <Select
          disabled={isUpdating}
          value={status}
          onValueChange={handleStatusChange}
        >
          <SelectTrigger className={`w-full ${isMobile ? 'h-12 text-base' : ''}`}>
            <SelectValue placeholder="Selecione o status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="aguardando">Aguardando</SelectItem>
            <SelectItem value="enviado">Enviado</SelectItem>
            <SelectItem value="proposta">Proposta</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="pt-4 border-t space-y-3">
        {quoteRequest.status === 'proposta' && proposal ? (
          <>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Proposta disponível
              </span>
              {proposal ? (
                <PDFDownloadLink
                  document={<ProposalPDF proposal={proposal} />}
                  fileName={`proposta_${proposal.client_name.replace(/\s+/g, '_').toLowerCase()}.pdf`}
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gold/80 text-white hover:bg-gold ${isMobile ? 'h-12 px-4 text-base' : 'h-9 px-3 py-2'}`}
                >
                  {({ loading, error }) => (
                    loading ? 
                    <span className="flex items-center">
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> 
                      Carregando...
                    </span> : 
                    error ? 
                    <span className="flex items-center">
                      Erro ao gerar PDF
                    </span> :
                    <span className="flex items-center">
                      <Download className="w-4 h-4 mr-2" /> 
                      Baixar Proposta
                    </span>
                  )}
                </PDFDownloadLink>
              ) : (
                loadingProposal ? (
                  <Button size={isMobile ? "default" : "sm"} disabled className={isMobile ? 'h-12' : ''}>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Carregando...
                  </Button>
                ) : null
              )}
            </div>
            <Button 
              onClick={handleCreateProposal} 
              className={`w-full ${isMobile ? 'h-12 text-base' : ''}`}
              variant="outline"
            >
              Editar Proposta
            </Button>
          </>
        ) : (
          <Button 
            onClick={handleCreateProposal} 
            className={`w-full ${isMobile ? 'h-12 text-base' : ''}`}
          >
            {quoteRequest.status === 'proposta' && loadingProposal ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Carregando proposta...
              </>
            ) : (
              'Criar Proposta'
            )}
          </Button>
        )}
        
        <Button 
          variant="destructive"
          onClick={() => setShowDeleteDialog(true)}
          className={`w-full ${isMobile ? 'h-12 text-base' : ''}`}
          disabled={isDeleting}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Excluir Orçamento
        </Button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
          <DialogContent className="w-[95vw] max-w-[95vw] h-[90vh] max-h-[90vh] p-0">
            <div className="flex flex-col h-full">
              <DialogHeader className="p-6 pb-4 border-b">
                <DialogTitle className="text-lg">Detalhes do Orçamento</DialogTitle>
                <DialogDescription className="text-sm">
                  Recebido em {new Date(quoteRequest.created_at).toLocaleDateString('pt-BR', { 
                    day: '2-digit', 
                    month: '2-digit', 
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </DialogDescription>
              </DialogHeader>
              
              <div className="flex-1 overflow-y-auto p-6">
                <DetailContent />
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent className="w-[90vw] max-w-[90vw]">
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir Orçamento</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir este orçamento? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-col gap-2 sm:flex-row">
              <AlertDialogCancel disabled={isDeleting} className="w-full sm:w-auto">
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDeleteQuote}
                disabled={isDeleting}
                className="w-full sm:w-auto bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Excluindo...
                  </>
                ) : (
                  'Excluir'
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }

  return (
    <>
      <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle>Detalhes do Orçamento</SheetTitle>
            <SheetDescription>
              Solicitação recebida em {new Date(quoteRequest.created_at).toLocaleDateString('pt-BR', { 
                day: '2-digit', 
                month: '2-digit', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </SheetDescription>
          </SheetHeader>

          <DetailContent />
        </SheetContent>
      </Sheet>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Orçamento</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este orçamento? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteQuote}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Excluindo...
                </>
              ) : (
                'Excluir'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default QuoteDetail;
