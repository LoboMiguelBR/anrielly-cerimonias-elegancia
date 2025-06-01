
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Participant {
  id?: string;
  event_id: string;
  user_email: string;
  name: string;
  participant_type: 'cliente' | 'cerimonialista';
  role: string;
  invited: boolean;
  accepted: boolean;
  client_id?: string;
  professional_id?: string;
}

export const useParticipants = () => {
  const [loading, setLoading] = useState(false);

  const addParticipant = async (participant: Participant): Promise<boolean> => {
    setLoading(true);
    try {
      console.log('Adding participant:', participant);
      
      const { data, error } = await supabase
        .from('event_participants')
        .insert([participant])
        .select()
        .single();

      if (error) {
        console.error('Error adding participant:', error);
        toast.error('Erro ao adicionar participante: ' + error.message);
        return false;
      }

      console.log('Participant added successfully:', data);
      toast.success('Participante adicionado com sucesso!');
      return true;
    } catch (err) {
      console.error('Error adding participant:', err);
      toast.error('Erro ao adicionar participante');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const removeParticipant = async (participantId: string): Promise<boolean> => {
    setLoading(true);
    try {
      console.log('Removing participant:', participantId);
      
      const { error } = await supabase
        .from('event_participants')
        .delete()
        .eq('id', participantId);

      if (error) {
        console.error('Error removing participant:', error);
        toast.error('Erro ao remover participante: ' + error.message);
        return false;
      }

      console.log('Participant removed successfully');
      toast.success('Participante removido com sucesso!');
      return true;
    } catch (err) {
      console.error('Error removing participant:', err);
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
