
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEvents } from '@/hooks/useEvents';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface CreateEventModalProps {
  open: boolean;
  onClose: () => void;
  onEventCreated?: () => void;
}

const CreateEventModal: React.FC<CreateEventModalProps> = ({
  open,
  onClose,
  onEventCreated
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: '',
    date: '',
    location: '',
    status: 'em_planejamento' as const,
    notes: '',
    quote_id: '',
    proposal_id: '',
    contract_id: ''
  });

  const [quotes, setQuotes] = useState<any[]>([]);
  const [proposals, setProposals] = useState<any[]>([]);
  const [contracts, setContracts] = useState<any[]>([]);

  React.useEffect(() => {
    if (open) {
      loadRelatedData();
    }
  }, [open]);

  const loadRelatedData = async () => {
    try {
      // Load quotes
      const { data: quotesData } = await supabase
        .from('quote_requests')
        .select('id, name, event_type, event_date, event_location')
        .order('created_at', { ascending: false });

      // Load proposals
      const { data: proposalsData } = await supabase
        .from('proposals')
        .select('id, client_name, event_type, event_date, event_location')
        .order('created_at', { ascending: false });

      // Load contracts
      const { data: contractsData } = await supabase
        .from('contracts')
        .select('id, client_name, event_type, event_date, event_location')
        .order('created_at', { ascending: false });

      setQuotes(quotesData || []);
      setProposals(proposalsData || []);
      setContracts(contractsData || []);
    } catch (error) {
      console.error('Error loading related data:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.type || !formData.location) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha pelo menos o tipo e local do evento",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const eventData = {
        type: formData.type,
        date: formData.date || null,
        location: formData.location,
        status: formData.status,
        notes: formData.notes || null,
        quote_id: formData.quote_id || null,
        proposal_id: formData.proposal_id || null,
        contract_id: formData.contract_id || null,
        tenant_id: 'anrielly_gomes'
      };

      const { data, error } = await supabase
        .from('events')
        .insert([eventData])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Evento criado",
        description: "Evento criado com sucesso!",
      });

      onEventCreated?.();
      onClose();
      setFormData({
        type: '',
        date: '',
        location: '',
        status: 'em_planejamento',
        notes: '',
        quote_id: '',
        proposal_id: '',
        contract_id: ''
      });
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: "Erro ao criar evento",
        description: "Não foi possível criar o evento",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Criar Novo Evento</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Tipo do Evento *</Label>
              <Input
                id="type"
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                placeholder="Ex: Casamento, Formatura"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Data do Evento</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="location">Local do Evento *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="Local onde será realizado o evento"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="em_planejamento">Em Planejamento</SelectItem>
                  <SelectItem value="contratado">Contratado</SelectItem>
                  <SelectItem value="concluido">Concluído</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quote_id">Vincular a Orçamento</Label>
              <Select value={formData.quote_id} onValueChange={(value) => handleInputChange('quote_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um orçamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Nenhum</SelectItem>
                  {quotes.map((quote) => (
                    <SelectItem key={quote.id} value={quote.id}>
                      {quote.name} - {quote.event_type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="proposal_id">Vincular a Proposta</Label>
              <Select value={formData.proposal_id} onValueChange={(value) => handleInputChange('proposal_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma proposta" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Nenhum</SelectItem>
                  {proposals.map((proposal) => (
                    <SelectItem key={proposal.id} value={proposal.id}>
                      {proposal.client_name} - {proposal.event_type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contract_id">Vincular a Contrato</Label>
              <Select value={formData.contract_id} onValueChange={(value) => handleInputChange('contract_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um contrato" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Nenhum</SelectItem>
                  {contracts.map((contract) => (
                    <SelectItem key={contract.id} value={contract.id}>
                      {contract.client_name} - {contract.event_type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Observações sobre o evento"
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Criando...' : 'Criar Evento'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEventModal;
