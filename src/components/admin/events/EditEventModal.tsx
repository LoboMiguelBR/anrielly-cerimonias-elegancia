
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEventActions } from '@/hooks/useEventActions';

interface Event {
  id: string;
  quote_id?: string;
  proposal_id?: string;
  contract_id?: string;
  type: string;
  date?: string;
  location?: string;
  status: 'em_planejamento' | 'contratado' | 'concluido' | 'cancelado';
  tenant_id?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

interface EditEventModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  event: Event | null;
}

const EditEventModal = ({ open, onOpenChange, onSuccess, event }: EditEventModalProps) => {
  const [formData, setFormData] = useState({
    type: '',
    date: '',
    location: '',
    status: 'em_planejamento' as const,
    notes: ''
  });

  const { updateEvent, loading } = useEventActions();

  useEffect(() => {
    if (event) {
      setFormData({
        type: event.type,
        date: event.date || '',
        location: event.location || '',
        status: event.status,
        notes: event.notes || ''
      });
    }
  }, [event]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!event) return;

    const success = await updateEvent(event.id, formData);

    if (success) {
      onSuccess();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Evento</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="type">Tipo de Evento</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
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
            <Label htmlFor="date">Data do Evento</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="location">Local</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
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

          <div>
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
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

export default EditEventModal;
