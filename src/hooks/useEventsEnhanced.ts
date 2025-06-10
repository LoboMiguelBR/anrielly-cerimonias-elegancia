
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Tipos para eventos
export type EventStatus = 'em_planejamento' | 'contratado' | 'concluido' | 'cancelado';

export interface Event {
  id: string;
  quote_id?: string;
  proposal_id?: string;
  contract_id?: string;
  type: string;
  date?: string;
  location?: string;
  status: EventStatus;
  tenant_id?: string;
  notes?: string;
  client_id?: string;
  cerimonialista_id?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface EventFilters {
  status?: EventStatus[];
  event_type?: string[];
  date_range?: {
    start: string;
    end: string;
  };
  search_query?: string;
}

export interface EventStats {
  total_events: number;
  events_by_status: Record<EventStatus, number>;
  upcoming_events: number;
  revenue_current_month: number;
}

export const useEventsEnhanced = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [stats, setStats] = useState<EventStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<EventFilters>({});

  const fetchEvents = async (eventFilters?: EventFilters) => {
    try {
      setLoading(true);
      let query = supabase
        .from('events')
        .select('*')
        .order('date', { ascending: false });

      const activeFilters = eventFilters || filters;

      if (activeFilters.status && activeFilters.status.length > 0) {
        // Converter array de EventStatus para array de strings
        const statusStrings = activeFilters.status.map(status => status as string);
        query = query.in('status', statusStrings);
      }

      if (activeFilters.event_type && activeFilters.event_type.length > 0) {
        query = query.in('type', activeFilters.event_type);
      }

      if (activeFilters.date_range) {
        query = query
          .gte('date', activeFilters.date_range.start)
          .lte('date', activeFilters.date_range.end);
      }

      if (activeFilters.search_query) {
        query = query.or(`type.ilike.%${activeFilters.search_query}%,location.ilike.%${activeFilters.search_query}%,notes.ilike.%${activeFilters.search_query}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Type cast para garantir compatibilidade com nossos tipos
      const typedEvents: Event[] = (data || []).map(event => ({
        ...event,
        status: event.status as EventStatus
      }));

      setEvents(typedEvents);
      await fetchStats();
    } catch (error: any) {
      console.error('Erro ao buscar eventos:', error);
      toast.error('Erro ao carregar eventos');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data } = await supabase
        .from('events')
        .select('status, date');

      if (data) {
        const stats: EventStats = {
          total_events: data.length,
          events_by_status: {
            em_planejamento: data.filter(e => e.status === 'em_planejamento').length,
            contratado: data.filter(e => e.status === 'contratado').length,
            concluido: data.filter(e => e.status === 'concluido').length,
            cancelado: data.filter(e => e.status === 'cancelado').length,
          },
          upcoming_events: data.filter(e => 
            e.date && new Date(e.date) > new Date()
          ).length,
          revenue_current_month: 0, // TODO: calcular com base em contratos
        };
        setStats(stats);
      }
    } catch (error: any) {
      console.error('Erro ao buscar estatísticas:', error);
    }
  };

  const createEvent = async (eventData: Omit<Event, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setLoading(true);
      
      // Preparar dados garantindo que o type seja obrigatório
      const insertData = {
        type: eventData.type || 'evento',
        date: eventData.date,
        location: eventData.location,
        status: eventData.status,
        tenant_id: eventData.tenant_id,
        notes: eventData.notes,
        client_id: eventData.client_id,
        cerimonialista_id: eventData.cerimonialista_id,
        description: eventData.description,
        quote_id: eventData.quote_id,
        proposal_id: eventData.proposal_id,
        contract_id: eventData.contract_id,
      };

      const { data, error } = await supabase
        .from('events')
        .insert([insertData])
        .select()
        .single();

      if (error) throw error;

      toast.success('Evento criado com sucesso!');
      await fetchEvents();
      return data;
    } catch (error: any) {
      console.error('Erro ao criar evento:', error);
      toast.error('Erro ao criar evento');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateEvent = async (id: string, updates: Partial<Event>) => {
    try {
      setLoading(true);
      
      // Preparar dados removendo campos read-only
      const { created_at, updated_at, ...updateData } = updates;

      const { error } = await supabase
        .from('events')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      toast.success('Evento atualizado com sucesso!');
      await fetchEvents();
    } catch (error: any) {
      console.error('Erro ao atualizar evento:', error);
      toast.error('Erro ao atualizar evento');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: EventStatus) => {
    try {
      const { error } = await supabase
        .from('events')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      toast.success('Status atualizado com sucesso!');
      await fetchEvents();
      return true;
    } catch (error: any) {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar status');
      return false;
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

      toast.success('Evento removido com sucesso!');
      await fetchEvents();
    } catch (error: any) {
      console.error('Erro ao remover evento:', error);
      toast.error('Erro ao remover evento');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const bulkUpdateStatus = async (eventIds: string[], status: EventStatus) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('events')
        .update({ status })
        .in('id', eventIds);

      if (error) throw error;

      toast.success(`${eventIds.length} eventos atualizados com sucesso!`);
      await fetchEvents();
    } catch (error: any) {
      console.error('Erro ao atualizar eventos em lote:', error);
      toast.error('Erro ao atualizar eventos');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (newFilters: EventFilters) => {
    setFilters(newFilters);
    fetchEvents(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    fetchEvents({});
  };

  const refetch = () => {
    fetchEvents();
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return {
    events,
    stats,
    loading,
    filters,
    fetchEvents,
    createEvent,
    updateEvent,
    updateStatus,
    deleteEvent,
    bulkUpdateStatus,
    applyFilters,
    clearFilters,
    refetch
  };
};
