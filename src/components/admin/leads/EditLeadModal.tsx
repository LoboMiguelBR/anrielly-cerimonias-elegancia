
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLeadActions, Lead } from '@/hooks/useLeadActions';

interface EditLeadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  lead: Lead | null;
}

const EditLeadModal = ({ open, onOpenChange, onSuccess, lead }: EditLeadModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    event_type: '',
    event_date: '',
    event_location: '',
    message: '',
    status: 'aguardando'
  });

  const { updateLead, loading } = useLeadActions();

  // Debug para verificar se o lead está sendo passado
  useEffect(() => {
    console.log('EditLeadModal - lead recebido:', lead);
    console.log('EditLeadModal - modal aberto:', open);
  }, [lead, open]);

  useEffect(() => {
    if (lead && open) {
      console.log('Carregando dados do lead:', lead);
      setFormData({
        name: lead.name || '',
        email: lead.email || '',
        phone: lead.phone || '',
        event_type: lead.event_type || '',
        event_date: lead.event_date || '',
        event_location: lead.event_location || '',
        message: lead.message || '',
        status: lead.status || 'aguardando'
      });
    }
  }, [lead, open]);

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setFormData({
        name: '',
        email: '',
        phone: '',
        event_type: '',
        event_date: '',
        event_location: '',
        message: '',
        status: 'aguardando'
      });
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!lead) {
      console.error('Nenhum lead selecionado para edição');
      return;
    }

    console.log('Atualizando lead:', lead.id, formData);
    const success = await updateLead(lead.id, formData);

    if (success) {
      onSuccess();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Lead</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="event_type">Tipo de Evento</Label>
            <Select value={formData.event_type} onValueChange={(value) => setFormData({ ...formData, event_type: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="casamento">Casamento</SelectItem>
                <SelectItem value="aniversario">Aniversário</SelectItem>
                <SelectItem value="formatura">Formatura</SelectItem>
                <SelectItem value="corporativo">Corporativo</SelectItem>
                <SelectItem value="batizado">Batizado</SelectItem>
                <SelectItem value="debutante">15 Anos</SelectItem>
                <SelectItem value="outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="event_date">Data do Evento</Label>
            <Input
              id="event_date"
              type="date"
              value={formData.event_date}
              onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="event_location">Local</Label>
            <Input
              id="event_location"
              value={formData.event_location}
              onChange={(e) => setFormData({ ...formData, event_location: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="aguardando">Aguardando</SelectItem>
                <SelectItem value="convertido">Convertido</SelectItem>
                <SelectItem value="perdido">Perdido</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="message">Mensagem</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditLeadModal;
