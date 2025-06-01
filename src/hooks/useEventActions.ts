
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Event, EventParticipant } from './useEvents';

export const useEventActions = () => {
  const [loading, setLoading] = useState(false);

  const createEvent = async (eventData: Omit<Event, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .insert([{
          ...eventData,
          status: eventData.status as any
        }])
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
      const updateData: any = { ...data };
      if (updateData.status) {
        updateData.status = updateData.status as any;
      }
      
      const { error } = await supabase
        .from('events')
        .update(updateData)
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

  const updateStatus = async (id: string, status: Event['status']) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('events')
        .update({ status: status as any })
        .eq('id', id);

      if (error) throw error;

      toast.success('Status atualizado com sucesso!');
      return true;
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
      toast.error('Erro ao atualizar status');
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

  const addParticipant = async (participantData: Omit<EventParticipant, 'id' | 'created_at'>) => {
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

  const createEventFromProposal = async (proposalData: any) => {
    try {
      setLoading(true);
      const eventData = {
        type: proposalData.event_type,
        date: proposalData.event_date,
        location: proposalData.event_location,
        status: 'em_planejamento' as const,
        description: `Evento criado a partir da proposta para ${proposalData.client_name}`,
        client_id: null
      };

      const { data, error } = await supabase
        .from('events')
        .insert([{
          ...eventData,
          status: eventData.status as any
        }])
        .select()
        .single();

      if (error) throw error;

      toast.success('Evento criado a partir da proposta!');
      return data;
    } catch (err) {
      console.error('Erro ao criar evento a partir da proposta:', err);
      toast.error('Erro ao criar evento a partir da proposta');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    createEvent,
    updateEvent,
    updateStatus,
    deleteEvent,
    addParticipant,
    removeParticipant,
    createEventFromProposal,
    loading
  };
};
