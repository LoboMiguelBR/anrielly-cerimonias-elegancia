
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useEventActions } from '@/hooks/useEventActions';
import { toast } from 'sonner';

interface CreateEventModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const CreateEventModal = ({ open, onOpenChange, onSuccess }: CreateEventModalProps) => {
  const [formData, setFormData] = useState({
    type: '',
    date: '',
    location: '',
    description: '',
    status: 'em_planejamento' as const
  });
  
  const { createEvent, loading } = useEventActions();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.type) {
      toast.error('Tipo do evento é obrigatório');
      return;
    }

    try {
      const eventData = {
        ...formData,
        date: formData.date || undefined,
        location: formData.location || undefined,
        description: formData.description || undefined
      };

      const result = await createEvent(eventData);
      
      if (result) {
        toast.success('Evento criado com sucesso!');
        setFormData({
          type: '',
          date: '',
          location: '',
          description: '',
          status: 'em_planejamento'
        });
        onSuccess();
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Erro ao criar evento:', error);
      toast.error('Erro ao criar evento');
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>Criar Novo Evento</DialogTitle>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="type">Tipo do Evento *</Label>
          <Input
            id="type"
            value={formData.type}
            onChange={(e) => handleChange('type', e.target.value)}
            placeholder="Ex: Casamento, Aniversário, etc."
            required
          />
        </div>

        <div>
          <Label htmlFor="date">Data do Evento</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => handleChange('date', e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="location">Local</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => handleChange('location', e.target.value)}
            placeholder="Local do evento"
          />
        </div>

        <div>
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="em_planejamento">Em Planejamento</SelectItem>
              <SelectItem value="confirmado">Confirmado</SelectItem>
              <SelectItem value="em_andamento">Em Andamento</SelectItem>
              <SelectItem value="concluido">Concluído</SelectItem>
              <SelectItem value="cancelado">Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Descrição do evento"
            rows={3}
          />
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {loading ? 'Criando...' : 'Criar Evento'}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default CreateEventModal;
