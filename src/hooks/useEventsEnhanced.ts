
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Event, EventStatus, EventType, EventFilters } from '@/types/events';

export interface EventStats {
  total_events: number;
  upcoming_events: number;
  completed_events: number;
  cancelled_events: number;
  total_revenue: number;
  average_event_value: number;
  events_this_month: number;
  completion_rate: number;
}

export const useEventsEnhanced = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [stats, setStats] = useState<EventStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<EventFilters>({});

  const fetchEvents = async (currentFilters?: EventFilters) => {
    try {
      setLoading(true);
      let query = supabase
        .from('events')
        .select(`
          *,
          clientes:client_id(name, email, phone),
          profiles:cerimonialista_id(name)
        `)
        .order('date', { ascending: false });

      // Apply filters
      const activeFilters = currentFilters || filters;
      
      if (activeFilters.status?.length) {
        query = query.in('status', activeFilters.status);
      }
      
      if (activeFilters.event_type?.length) {
        query = query.in('type', activeFilters.event_type);
      }
      
      if (activeFilters.date_range) {
        query = query
          .gte('date', activeFilters.date_range.start)
          .lte('date', activeFilters.date_range.end);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Transform data to enhanced format
      const enhancedEvents: Event[] = (data || []).map(event => ({
        id: event.id,
        title: `${event.type} - ${event.clientes?.name || 'Cliente'}`,
        event_type: event.type as EventType,
        event_subtype: undefined,
        priority: 'media' as const,
        start_date: event.date || new Date().toISOString().split('T')[0],
        end_date: event.date || new Date().toISOString().split('T')[0],
        ceremony_time: undefined,
        reception_time: undefined,
        ceremony_venue: event.location ? {
          name: event.location,
          address: event.location,
          city: '',
          state: '',
          zip_code: '',
          capacity: 0,
          amenities: [],
          photos: []
        } : undefined,
        reception_venue: undefined,
        guest_count: 0,
        estimated_budget: 0,
        final_budget: undefined,
        theme_colors: [],
        dress_code: undefined,
        client_id: event.client_id || '',
        organizer_id: event.cerimonialista_id || '',
        suppliers: [],
        timeline: [],
        checklist: [],
        documents: [],
        is_public: false,
        allow_rsvp: false,
        rsvp_deadline: undefined,
        tags: [],
        custom_fields: {},
        // Mantendo compatibilidade com campos existentes
        quote_id: event.quote_id,
        proposal_id: event.proposal_id,
        contract_id: event.contract_id,
        type: event.type,
        date: event.date,
        location: event.location,
        status: event.status as EventStatus,
        tenant_id: event.tenant_id,
        notes: event.notes,
        created_at: event.created_at,
        updated_at: event.updated_at
      }));

      setEvents(enhancedEvents);
    } catch (error: any) {
      console.error('Erro ao buscar eventos:', error);
      toast.error('Erro ao carregar eventos');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data: eventsData } = await supabase
        .from('events')
        .select('status, date, created_at');

      if (eventsData) {
        const now = new Date();
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        
        const stats: EventStats = {
          total_events: eventsData.length,
          upcoming_events: eventsData.filter(e => 
            e.date && new Date(e.date) > now
          ).length,
          completed_events: eventsData.filter(e => 
            e.status === 'concluido' || e.status === 'finalizado'
          ).length,
          cancelled_events: eventsData.filter(e => e.status === 'cancelado').length,
          total_revenue: 0, // Calculate from contracts
          average_event_value: 0, // Calculate from contracts
          events_this_month: eventsData.filter(e => 
            new Date(e.created_at) >= thisMonth
          ).length,
          completion_rate: 0, // Calculate based on completed vs total
        };
        
        setStats(stats);
      }
    } catch (error: any) {
      console.error('Erro ao buscar estatísticas de eventos:', error);
    }
  };

  const createEvent = async (eventData: Partial<Event>) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .insert([{
          type: eventData.event_type || eventData.type,
          date: eventData.start_date || eventData.date,
          location: eventData.ceremony_venue?.name || eventData.location,
          status: eventData.status || 'em_planejamento',
          client_id: eventData.client_id,
          cerimonialista_id: eventData.organizer_id,
          notes: eventData.notes,
          tenant_id: 'anrielly_gomes'
        }])
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
      const { error } = await supabase
        .from('events')
        .update({
          type: updates.event_type || updates.type,
          date: updates.start_date || updates.date,
          location: updates.ceremony_venue?.name || updates.location,
          status: updates.status,
          client_id: updates.client_id,
          cerimonialista_id: updates.organizer_id,
          notes: updates.notes,
        })
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

  const updateEventStatus = async (id: string, status: EventStatus) => {
    try {
      await updateEvent(id, { status });
      toast.success('Status do evento atualizado!');
    } catch (error) {
      toast.error('Erro ao atualizar status');
    }
  };

  const duplicateEvent = async (id: string) => {
    try {
      const eventToDuplicate = events.find(e => e.id === id);
      if (!eventToDuplicate) {
        throw new Error('Evento não encontrado');
      }

      const duplicatedEvent = {
        ...eventToDuplicate,
        title: `${eventToDuplicate.title} (Cópia)`,
        status: 'em_planejamento' as EventStatus,
        start_date: new Date().toISOString().split('T')[0],
      };

      delete (duplicatedEvent as any).id;
      await createEvent(duplicatedEvent);
    } catch (error) {
      toast.error('Erro ao duplicar evento');
    }
  };

  const applyFilters = (newFilters: EventFilters) => {
    setFilters(newFilters);
    fetchEvents(newFilters);
  };

  const exportEvents = async (format: 'csv' | 'excel' = 'csv') => {
    try {
      toast.success('Funcionalidade de exportação será implementada em breve');
    } catch (error) {
      toast.error('Erro ao exportar eventos');
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchStats();
  }, []);

  return {
    events,
    stats,
    loading,
    filters,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    updateEventStatus,
    duplicateEvent,
    applyFilters,
    exportEvents,
    refetch: () => {
      fetchEvents();
      fetchStats();
    }
  };
};
