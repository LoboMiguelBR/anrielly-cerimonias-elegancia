
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Participant {
  id: string;
  event_id: string;
  user_email: string;
  name?: string;
  participant_type: 'cliente' | 'cerimonialista';
  client_id?: string;
  professional_id?: string;
  role: string;
  invited: boolean;
  accepted: boolean;
  created_at: string;
}

export const useParticipants = () => {
  const [loading, setLoading] = useState(false);

  const addParticipant = async (participantData: Omit<Participant, 'id' | 'created_at'>) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('event_participants')
        .insert([{
          ...participantData,
          role: participantData.role as any
        }]);

      if (error) throw error;

      toast.success('Participante adicionado com sucesso!');
      return true;
    } catch (err) {
      console.error('Erro ao adicionar participante:', err);
      toast.error('Erro ao adicionar participante');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const removeParticipant = async (participantId: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('event_participants')
        .delete()
        .eq('id', participantId);

      if (error) throw error;

      toast.success('Participante removido com sucesso!');
      return true;
    } catch (err) {
      console.error('Erro ao remover participante:', err);
      toast.error('Erro ao remover participante');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    addParticipant,
    removeParticipant,
    loading
  };
};
