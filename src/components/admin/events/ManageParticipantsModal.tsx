
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus } from 'lucide-react';
import { useEventActions } from '@/hooks/useEventActions';
import { useClientes } from '@/hooks/useClientes';
import { useProfessionals } from '@/hooks/useProfessionals';

interface ManageParticipantsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  event: any;
}

const ManageParticipantsModal = ({ open, onOpenChange, onSuccess, event }: ManageParticipantsModalProps) => {
  const [newParticipant, setNewParticipant] = useState({
    user_email: '',
    participant_type: 'cliente' as 'cliente' | 'cerimonialista',
    role: '',
    client_id: '',
    professional_id: ''
  });

  const { addParticipant, removeParticipant, loading } = useEventActions();
  const { clientes } = useClientes();
  const { data: professionals } = useProfessionals();

  const handleAddParticipant = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!event || !newParticipant.user_email) return;

    const participantData = {
      event_id: event.id,
      user_email: newParticipant.user_email,
      participant_type: newParticipant.participant_type,
      role: newParticipant.role || newParticipant.participant_type,
      client_id: newParticipant.client_id || null,
      professional_id: newParticipant.professional_id || null,
      invited: true,
      accepted: false
    };

    const success = await addParticipant(participantData);

    if (success) {
      onSuccess();
      setNewParticipant({
        user_email: '',
        participant_type: 'cliente',
        role: '',
        client_id: '',
        professional_id: ''
      });
    }
  };

  const handleRemoveParticipant = async (participantId: string) => {
    const success = await removeParticipant(participantId);
    if (success) {
      onSuccess();
    }
  };

  const handleClientSelect = (clientId: string) => {
    const client = clientes.find(c => c.id === clientId);
    if (client) {
      setNewParticipant(prev => ({
        ...prev,
        client_id: clientId,
        user_email: client.email,
        professional_id: ''
      }));
    }
  };

  const handleProfessionalSelect = (professionalId: string) => {
    const professional = professionals?.find(p => p.id === professionalId);
    if (professional) {
      setNewParticipant(prev => ({
        ...prev,
        professional_id: professionalId,
        user_email: professional.email,
        client_id: ''
      }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gerenciar Participantes - {event?.type}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Lista de Participantes Existentes */}
          <div>
            <h3 className="text-lg font-medium mb-3">Participantes Atuais</h3>
            <div className="space-y-2">
              {event?.participants?.length > 0 ? (
                event.participants.map((participant: any) => (
                  <div key={participant.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {participant.client?.name || participant.professional?.name || participant.user_email}
                        </span>
                        <Badge variant="outline" size="sm">
                          {participant.participant_type}
                        </Badge>
                        {participant.role && (
                          <Badge variant="outline" size="sm">
                            {participant.role}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{participant.user_email}</p>
                      <div className="flex gap-2 mt-1">
                        {participant.invited && (
                          <Badge variant="outline" size="sm">Convidado</Badge>
                        )}
                        {participant.accepted && (
                          <Badge variant="outline" className="bg-green-50 text-green-700" size="sm">
                            Aceito
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveParticipant(participant.id)}
                      disabled={loading}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">Nenhum participante adicionado</p>
              )}
            </div>
          </div>

          {/* Formulário para Adicionar Participante */}
          <div>
            <h3 className="text-lg font-medium mb-3">Adicionar Participante</h3>
            <form onSubmit={handleAddParticipant} className="space-y-4">
              <div>
                <Label htmlFor="participant_type">Tipo de Participante</Label>
                <Select 
                  value={newParticipant.participant_type} 
                  onValueChange={(value: 'cliente' | 'cerimonialista') => 
                    setNewParticipant(prev => ({ 
                      ...prev, 
                      participant_type: value,
                      client_id: '',
                      professional_id: '',
                      user_email: ''
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cliente">Cliente</SelectItem>
                    <SelectItem value="cerimonialista">Cerimonialista</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {newParticipant.participant_type === 'cliente' ? (
                <div>
                  <Label htmlFor="client_id">Selecionar Cliente</Label>
                  <Select value={newParticipant.client_id} onValueChange={handleClientSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {clientes.map((cliente) => (
                        <SelectItem key={cliente.id} value={cliente.id}>
                          {cliente.name} - {cliente.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div>
                  <Label htmlFor="professional_id">Selecionar Profissional</Label>
                  <Select value={newParticipant.professional_id} onValueChange={handleProfessionalSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um profissional" />
                    </SelectTrigger>
                    <SelectContent>
                      {professionals?.map((professional) => (
                        <SelectItem key={professional.id} value={professional.id}>
                          {professional.name} - {professional.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <Label htmlFor="user_email">Email</Label>
                <Input
                  id="user_email"
                  type="email"
                  value={newParticipant.user_email}
                  onChange={(e) => setNewParticipant(prev => ({ ...prev, user_email: e.target.value }))}
                  placeholder="Email do participante"
                  required
                />
              </div>

              <div>
                <Label htmlFor="role">Função (opcional)</Label>
                <Input
                  id="role"
                  value={newParticipant.role}
                  onChange={(e) => setNewParticipant(prev => ({ ...prev, role: e.target.value }))}
                  placeholder="Ex: Organizador, Convidado, etc."
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                {loading ? 'Adicionando...' : 'Adicionar Participante'}
              </Button>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ManageParticipantsModal;
