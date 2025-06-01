
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Database } from '@/integrations/supabase/types';

type EventInsert = Database['public']['Tables']['events']['Insert'];
type EventUpdate = Database['public']['Tables']['events']['Update'];

export const useEventActions = () => {
  const [loading, setLoading] = useState(false);

  const createEvent = async (eventData: {
    type: string;
    date?: string;
    location?: string;
    description?: string;
    status?: 'em_planejamento' | 'contratado' | 'concluido' | 'cancelado';
    client_id?: string;
    cerimonialista_id?: string;
  }) => {
    setLoading(true);
    try {
      console.log('Creating event:', eventData);
      
      const insertData: EventInsert = {
        type: eventData.type,
        date: eventData.date || null,
        location: eventData.location || null,
        description: eventData.description || null,
        status: eventData.status || 'em_planejamento',
        client_id: eventData.client_id || null,
        cerimonialista_id: eventData.cerimonialista_id || null,
      };

      const { data, error } = await supabase
        .from('events')
        .insert(insertData)
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

  const updateEvent = async (eventId: string, updates: Partial<EventUpdate>) => {
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
