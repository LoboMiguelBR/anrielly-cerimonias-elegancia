
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Event, EventParticipant } from './useEvents';

export const useEventActions = () => {
  const [loading, setLoading] = useState(false);

  const createEvent = async (eventData: Partial<Event>) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .insert([eventData])
        .select()
        .single();

      if (error) throw error;

      toast.success('Evento criado com sucesso!');
      return data;
    } catch (err) {
      console.error('Erro ao criar evento:', err);
      toast.error('Erro ao criar evento');
      return null;
    } finally {
      setLoading(false);
    }
  };

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

  const addParticipant = async (participantData: Partial<EventParticipant>) => {
    try {
      setLoading(true);
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
    createEvent,
    updateEvent,
    deleteEvent,
    addParticipant,
    removeParticipant,
    loading
  };
};
