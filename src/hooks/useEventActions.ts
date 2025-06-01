
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface CreateEventData {
  type: string;
  date?: string;
  location?: string;
  description?: string;
  status: 'em_planejamento' | 'confirmado' | 'em_andamento' | 'concluido' | 'cancelado';
  client_id?: string;
  cerimonialista_id?: string;
}

export const useEventActions = () => {
  const [loading, setLoading] = useState(false);

  const createEvent = async (eventData: CreateEventData) => {
    setLoading(true);
    try {
      console.log('Creating event:', eventData);
      
      const { data, error } = await supabase
        .from('events')
        .insert([eventData])
        .select()
        .single();

      if (error) {
        console.error('Error creating event:', error);
        toast.error('Erro ao criar evento: ' + error.message);
        return null;
      }

      console.log('Event created successfully:', data);
      toast.success('Evento criado com sucesso!');
      return data;
    } catch (err) {
      console.error('Error creating event:', err);
      toast.error('Erro ao criar evento');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateEvent = async (eventId: string, updates: Partial<CreateEventData>) => {
    setLoading(true);
    try {
      console.log('Updating event:', eventId, updates);
      
      const { data, error } = await supabase
        .from('events')
        .update(updates)
        .eq('id', eventId)
        .select()
        .single();

      if (error) {
        console.error('Error updating event:', error);
        toast.error('Erro ao atualizar evento: ' + error.message);
        return null;
      }

      console.log('Event updated successfully:', data);
      toast.success('Evento atualizado com sucesso!');
      return data;
    } catch (err) {
      console.error('Error updating event:', err);
      toast.error('Erro ao atualizar evento');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (eventId: string): Promise<boolean> => {
    setLoading(true);
    try {
      console.log('Deleting event:', eventId);
      
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) {
        console.error('Error deleting event:', error);
        toast.error('Erro ao deletar evento: ' + error.message);
        return false;
      }

      console.log('Event deleted successfully');
      toast.success('Evento deletado com sucesso!');
      return true;
    } catch (err) {
      console.error('Error deleting event:', err);
      toast.error('Erro ao deletar evento');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    createEvent,
    updateEvent,
    deleteEvent,
    loading
  };
};
