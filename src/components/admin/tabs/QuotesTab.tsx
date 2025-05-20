import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useQuoteRequests } from '@/hooks/useQuoteRequests';
import { Loader2, CheckCircle, Clock, FileText, Download } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ProposalPDF from '@/components/admin/ProposalPDF';

const statusColors = {
  aguardando: "bg-gray-100 text-gray-800",
  enviado: "bg-blue-100 text-blue-800",
  proposta: "bg-green-100 text-green-800"
};

const statusIcons = {
  aguardando: <Clock className="w-4 h-4 mr-1" />,
  enviado: <CheckCircle className="w-4 h-4 mr-1" />,
  proposta: <FileText className="w-4 h-4 mr-1" />
};

interface QuoteDetailProps {
  quoteRequest: any;
  open: boolean;
  onClose: () => void;
  onStatusChange: (id: string, status: string) => Promise<void>;
}

const QuoteDetail = ({ quoteRequest, open, onClose, onStatusChange }: QuoteDetailProps) => {
  const [status, setStatus] = useState(quoteRequest?.status || 'aguardando');
  const [isUpdating, setIsUpdating] = useState(false);
  const [proposal, setProposal] = useState<any>(null);
  const [loadingProposal, setLoadingProposal] = useState(false);
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
        // Convert services from JSON to array
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
  
  // Fetch proposal when the detail panel opens
  React.useEffect(() => {
    if (open && quoteRequest && quoteRequest.status === 'proposta') {
      fetchProposal();
    }
  }, [open, quoteRequest]);

  if (!quoteRequest) return null;

  return (
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

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Cliente</h3>
            <p className="text-lg font-semibold">{quoteRequest.name}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Email</h3>
              <p>{quoteRequest.email}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Telefone</h3>
              <p>{quoteRequest.phone}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Tipo de Evento</h3>
              <p>{quoteRequest.event_type}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Data do Evento</h3>
              <p>{quoteRequest.event_date ? new Date(quoteRequest.event_date).toLocaleDateString('pt-BR') : 'Não definida'}</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Local do Evento</h3>
            <p>{quoteRequest.event_location}</p>
          </div>

          {quoteRequest.message && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Mensagem</h3>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{quoteRequest.message}</p>
            </div>
          )}

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Status</h3>
            <Select
              disabled={isUpdating}
              value={status}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger className="w-full">
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
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gold/80 text-white hover:bg-gold h-9 px-3 py-2"
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
                      <Button size="sm" disabled>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Carregando...
                      </Button>
                    ) : null
                  )}
                </div>
                <Button 
                  onClick={handleCreateProposal} 
                  className="w-full"
                  variant="outline"
                >
                  Editar Proposta
                </Button>
              </>
            ) : (
              <Button 
                onClick={handleCreateProposal} 
                className="w-full"
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
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

const QuotesTab = () => {
  const { data: quoteRequests, isLoading, error, mutate } = useQuoteRequests();
  const [selectedQuote, setSelectedQuote] = useState<string | null>(null);
  
  const handleStatusChange = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from('quote_requests')
      .update({ status: newStatus })
      .eq('id', id);
      
    if (error) {
      throw error;
    }
    
    // Update local data without refetching
    mutate(
      quoteRequests?.map(quote => 
        quote.id === id ? { ...quote, status: newStatus } : quote
      ),
      false
    );
  };

  const selectedQuoteData = quoteRequests?.find(quote => quote.id === selectedQuote);

  if (error) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Gerenciar Solicitações de Orçamento</h2>
        <div className="p-4 bg-red-50 rounded border border-red-200 text-red-700">
          Erro ao carregar dados: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Gerenciar Solicitações de Orçamento</h2>
      
      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Tipo de Evento</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Local</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quoteRequests && quoteRequests.length > 0 ? (
                quoteRequests.map(request => (
                  <TableRow key={request.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{request.name}</TableCell>
                    <TableCell>{request.email}</TableCell>
                    <TableCell>{request.phone}</TableCell>
                    <TableCell>{request.event_type}</TableCell>
                    <TableCell>
                      {request.event_date 
                        ? new Date(request.event_date).toLocaleDateString('pt-BR')
                        : '-'}
                    </TableCell>
                    <TableCell>{request.event_location}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[request.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
                        {statusIcons[request.status as keyof typeof statusIcons]}
                        {request.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" className="text-xs"
                        onClick={() => setSelectedQuote(request.id)}>
                        Ver Detalhes
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    Nenhuma solicitação de orçamento encontrada
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <QuoteDetail
        quoteRequest={selectedQuoteData}
        open={!!selectedQuote}
        onClose={() => setSelectedQuote(null)}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};

export default QuotesTab;
