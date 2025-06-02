
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus } from 'lucide-react';
import { useEventActions } from '@/hooks/useEventActions';
import { useEvents } from '@/hooks/useEvents';

interface EventParticipant {
  id: string;
  event_id: string;
  user_email: string;
  name?: string;
  role: 'noivo' | 'noiva' | 'cerimonialista' | 'cliente' | 'admin';
  invited: boolean;
  accepted: boolean;
  magic_link_token?: string;
  created_at: string;
  updated_at: string;
}

interface ManageParticipantsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventId: string | null;
  onSuccess: () => void;
}

const ManageParticipantsModal = ({ open, onOpenChange, eventId, onSuccess }: ManageParticipantsModalProps) => {
  const [participants, setParticipants] = useState<EventParticipant[]>([]);
  const [newParticipant, setNewParticipant] = useState({
    email: '',
    name: '',
    role: 'cliente' as const
  });

  const { addParticipant, removeParticipant, loading } = useEventActions();
  const { getParticipantsByEvent } = useEvents();

  useEffect(() => {
    if (eventId && open) {
      loadParticipants();
    }
  }, [eventId, open]);

  const loadParticipants = async () => {
    if (!eventId) return;
    const data = await getParticipantsByEvent(eventId);
    setParticipants(data);
  };

  const handleAddParticipant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventId) return;

    const success = await addParticipant(
      eventId,
      newParticipant.email,
      newParticipant.name,
      newParticipant.role
    );

    if (success) {
      setNewParticipant({ email: '', name: '', role: 'cliente' });
      await loadParticipants();
      onSuccess();
    }
  };

  const handleRemoveParticipant = async (participantId: string) => {
    const success = await removeParticipant(participantId);
    if (success) {
      await loadParticipants();
      onSuccess();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Gerenciar Participantes</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Lista de participantes */}
          <div>
            <h4 className="font-semibold mb-2">Participantes Atuais</h4>
            {participants.length > 0 ? (
              <div className="space-y-2">
                {participants.map((participant) => (
                  <div
                    key={participant.id}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded"
                  >
                    <div>
                      <span className="font-medium">{participant.name || participant.user_email}</span>
                      <span className="text-sm text-gray-600 ml-2">({participant.role})</span>
                      <div className="flex items-center gap-2 mt-1">
                        {participant.invited && (
                          <Badge variant="outline" className="text-xs">
                            Convidado
                          </Badge>
                        )}
                        {participant.accepted && (
                          <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
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
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Nenhum participante adicionado</p>
            )}
          </div>

          {/* Formulário para adicionar participante */}
          <div className="border-t pt-4">
            <h4 className="font-semibold mb-2">Adicionar Participante</h4>
            <form onSubmit={handleAddParticipant} className="space-y-3">
              <div>
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={newParticipant.name}
                  onChange={(e) => setNewParticipant({ ...newParticipant, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newParticipant.email}
                  onChange={(e) => setNewParticipant({ ...newParticipant, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="role">Função</Label>
                <Select 
                  value={newParticipant.role} 
                  onValueChange={(value: any) => setNewParticipant({ ...newParticipant, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="noivo">Noivo</SelectItem>
                    <SelectItem value="noiva">Noiva</SelectItem>
                    <SelectItem value="cerimonialista">Cerimonialista</SelectItem>
                    <SelectItem value="cliente">Cliente</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                {loading ? 'Adicionando...' : 'Adicionar Participante'}
              </Button>
            </form>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ManageParticipantsModal;
