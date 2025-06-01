
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus } from 'lucide-react';
import { useParticipants } from '@/hooks/useParticipants';
import { toast } from 'sonner';
import { Database } from '@/integrations/supabase/types';

type ParticipantRole = Database['public']['Enums']['participant_role'];

interface ManageParticipantsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  event: any;
}

const ManageParticipantsModal = ({ open, onOpenChange, onSuccess, event }: ManageParticipantsModalProps) => {
  const [newParticipant, setNewParticipant] = useState<{
    user_email: string;
    name: string;
    participant_type: string;
    role: ParticipantRole;
    invited: boolean;
    accepted: boolean;
  }>({
    user_email: '',
    name: '',
    participant_type: 'cliente',
    role: 'cliente',
    invited: true,
    accepted: false
  });

  const { addParticipant, removeParticipant, loading } = useParticipants();

  const handleAddParticipant = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newParticipant.user_email || !newParticipant.name) {
      toast.error('Email e nome são obrigatórios');
      return;
    }

    const success = await addParticipant({
      event_id: event.id,
      ...newParticipant
    });

    if (success) {
      setNewParticipant({
        user_email: '',
        name: '',
        participant_type: 'cliente',
        role: 'cliente',
        invited: true,
        accepted: false
      });
      onSuccess();
    }
  };

  const handleRemoveParticipant = async (participantId: string) => {
    const success = await removeParticipant(participantId);
    if (success) {
      onSuccess();
    }
  };

  if (!event) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gerenciar Participantes - {event.type}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Participantes Existentes */}
          <div>
            <h3 className="text-lg font-medium mb-3">Participantes Atuais</h3>
            {event.participants && event.participants.length > 0 ? (
              <div className="space-y-2">
                {event.participants.map((participant: any) => (
                  <div key={participant.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">
                        {participant.name || participant.user_email}
                      </p>
                      <p className="text-sm text-gray-600">
                        {participant.user_email} - {participant.role}
                      </p>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="outline">
                          {participant.participant_type}
                        </Badge>
                        {participant.invited && (
                          <Badge variant="outline" className="bg-blue-50">
                            Convidado
                          </Badge>
                        )}
                        {participant.accepted && (
                          <Badge variant="outline" className="bg-green-50">
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
              <p className="text-gray-500 text-center py-4">
                Nenhum participante adicionado ainda
              </p>
            )}
          </div>

          {/* Adicionar Novo Participante */}
          <div>
            <h3 className="text-lg font-medium mb-3">Adicionar Participante</h3>
            <form onSubmit={handleAddParticipant} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome *</Label>
                  <Input
                    id="name"
                    value={newParticipant.name}
                    onChange={(e) => setNewParticipant(prev => ({
                      ...prev,
                      name: e.target.value
                    }))}
                    placeholder="Nome do participante"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newParticipant.user_email}
                    onChange={(e) => setNewParticipant(prev => ({
                      ...prev,
                      user_email: e.target.value
                    }))}
                    placeholder="email@exemplo.com"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="participant_type">Tipo</Label>
                  <Select 
                    value={newParticipant.participant_type} 
                    onValueChange={(value: string) => setNewParticipant(prev => ({
                      ...prev,
                      participant_type: value
                    }))}
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

                <div>
                  <Label htmlFor="role">Função</Label>
                  <Select 
                    value={newParticipant.role} 
                    onValueChange={(value: ParticipantRole) => setNewParticipant(prev => ({
                      ...prev,
                      role: value
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="noivo">Noivo</SelectItem>
                      <SelectItem value="noiva">Noiva</SelectItem>
                      <SelectItem value="cliente">Cliente</SelectItem>
                      <SelectItem value="cerimonialista">Cerimonialista</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full"
              >
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
