
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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

export const useEventActions = () => {
  const [loading, setLoading] = useState(false);

  const updateEvent = async (id: string, data: Partial<Event>) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('events')
        .update(data)
        .eq('id', id);

      if (error) throw error;

      toast.success('Evento atualizado com sucesso!');
      return true;
    } catch (err) {
      console.error('Erro ao atualizar evento:', err);
      toast.error('Erro ao atualizar evento');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      setLoading(true);
      
      // Delete participants first
      await supabase
        .from('event_participants')
        .delete()
        .eq('event_id', id);

      // Then delete the event
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Evento deletado com sucesso!');
      return true;
    } catch (err) {
      console.error('Erro ao deletar evento:', err);
      toast.error('Erro ao deletar evento');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: Event['status']) => {
    return updateEvent(id, { status });
  };

  const addParticipant = async (eventId: string, email: string, name: string, role: EventParticipant['role']) => {
    try {
      setLoading(true);
      const participantData = {
        event_id: eventId,
        user_email: email,
        name: name,
        role: role,
        invited: true,
        accepted: false,
        magic_link_token: crypto.randomUUID()
      };

      const { error } = await supabase
        .from('event_participants')
        .insert([participantData]);

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
    updateEvent,
    deleteEvent,
    updateStatus,
    addParticipant,
    removeParticipant,
    loading
  };
};
