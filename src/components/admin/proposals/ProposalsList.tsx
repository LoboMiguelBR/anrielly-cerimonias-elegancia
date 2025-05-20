
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Edit, Trash2, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { formatCurrency } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import ProposalGenerator from './ProposalGenerator';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import { ProposalData } from '../hooks/useProposalForm';

interface ProposalsListProps {
  quoteRequests: Array<{
    id: string;
    name: string;
    eventType?: string;
    event_type?: string;
    email?: string;
    phone?: string;
    event_date?: string;
    event_location?: string;
  }>;
  selectedQuoteId?: string | null;
}

const ProposalsList: React.FC<ProposalsListProps> = ({ quoteRequests, selectedQuoteId }) => {
  const [proposals, setProposals] = useState<ProposalData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedProposal, setSelectedProposal] = useState<ProposalData | null>(null);
  const [showAddEditDialog, setShowAddEditDialog] = useState<boolean>(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);

  // Fetch all proposals
  const fetchProposals = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('proposals')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setProposals(data || []);
    } catch (error) {
      console.error('Erro ao buscar propostas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProposals();
    
    // Setup realtime subscription
    const channel = supabase
      .channel('proposals_changes')
      .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'proposals' },
          (payload) => {
            fetchProposals();
          })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleAddNew = () => {
    setSelectedProposal(null);
    setShowAddEditDialog(true);
  };

  const handleEdit = (proposal: ProposalData) => {
    setSelectedProposal(proposal);
    setShowAddEditDialog(true);
  };

  const handleDelete = (proposal: ProposalData) => {
    setSelectedProposal(proposal);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirmed = async () => {
    if (!selectedProposal) return;
    
    try {
      const { error } = await supabase
        .from('proposals')
        .delete()
        .eq('id', selectedProposal.id);
        
      if (error) throw error;
      
      await fetchProposals();
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Erro ao excluir proposta:', error);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Data não definida';
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Propostas</h3>
        <Button 
          onClick={handleAddNew}
          className="flex items-center gap-2 bg-purple-200 hover:bg-purple-300 text-primary-foreground"
        >
          <Plus size={16} />
          Nova Proposta
        </Button>
      </div>

      {isLoading ? (
        <div className="h-40 flex items-center justify-center">
          <div className="animate-spin h-6 w-6 border-2 border-purple-500 border-t-transparent rounded-full"></div>
        </div>
      ) : proposals.length === 0 ? (
        <div className="bg-gray-50 border rounded-md p-8 text-center">
          <p className="text-gray-500">Nenhuma proposta encontrada</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={handleAddNew}
          >
            Criar primeira proposta
          </Button>
        </div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Tipo de Evento</TableHead>
                <TableHead>Data do Evento</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Criada em</TableHead>
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {proposals.map((proposal) => (
                <TableRow key={proposal.id}>
                  <TableCell className="font-medium">{proposal.client_name}</TableCell>
                  <TableCell>{proposal.event_type}</TableCell>
                  <TableCell>{formatDate(proposal.event_date)}</TableCell>
                  <TableCell>R$ {formatCurrency(proposal.total_price)}</TableCell>
                  <TableCell>{proposal.created_at && formatDate(proposal.created_at)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleEdit(proposal)}
                        title="Editar proposta"
                      >
                        <Edit size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDelete(proposal)}
                        className="text-red-500 hover:text-red-700"
                        title="Excluir proposta"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add/Edit Proposal Dialog */}
      <Dialog open={showAddEditDialog} onOpenChange={setShowAddEditDialog}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedProposal ? 'Editar Proposta' : 'Nova Proposta'}</DialogTitle>
            <DialogDescription>
              {selectedProposal 
                ? `Editando proposta para ${selectedProposal.client_name}`
                : 'Preencha os detalhes para criar uma nova proposta.'
              }
            </DialogDescription>
          </DialogHeader>
          
          <ProposalGenerator 
            quoteRequests={quoteRequests}
            quoteIdFromUrl={selectedQuoteId}
            initialProposalId={selectedProposal?.id}
            onClose={() => setShowAddEditDialog(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteConfirmed}
        title="Excluir Proposta"
        description={`Tem certeza que deseja excluir a proposta para ${selectedProposal?.client_name}? Esta ação não pode ser desfeita.`}
      />
    </div>
  );
};

export default ProposalsList;
