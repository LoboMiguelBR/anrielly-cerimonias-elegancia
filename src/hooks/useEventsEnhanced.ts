
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Mapear eventos existentes para o novo formato
const mapEventStatus = (oldStatus: string): 'em_planejamento' | 'contratado' | 'concluido' | 'cancelado' => {
  switch (oldStatus) {
    case 'finalizado':
      return 'concluido';
    case 'orcamento':
    case 'proposta':
    case 'negociacao':
      return 'em_planejamento';
    case 'confirmado':
      return 'contratado';
    default:
      return oldStatus as 'em_planejamento' | 'contratado' | 'concluido' | 'cancelado';
  }
};

// Mapear status para o banco de dados
const mapStatusToDatabase = (status: 'em_planejamento' | 'contratado' | 'concluido' | 'cancelado'): string => {
  switch (status) {
    case 'concluido':
      return 'concluido';
    case 'contratado':
      return 'confirmado';
    case 'em_planejamento':
      return 'em_planejamento';
    case 'cancelado':
      return 'cancelado';
    default:
      return status;
  }
};

export interface Event {
  id: string;
  tenant_id: string;
  title: string;
  description?: string;
  event_type: string;
  status: 'em_planejamento' | 'contratado' | 'concluido' | 'cancelado';
  event_date: string;
  start_time: string;
  end_time: string;
  venue?: {
    name: string;
    address: string;
    city: string;
    state: string;
    postal_code: string;
    capacity: number;
    venue_type: string;
    special_features: string[];
  };
  client_id?: string;
  organizer_id?: string;
  participants: any[];
  guest_count: number;
  budget: {
    total_budget: number;
    allocated_budget: number;
    spent_amount: number;
    categories: any[];
  };
  timeline: any[];
  checklist: any[];
  suppliers: any[];
  documents: any[];
  gallery: any[];
  settings: {
    public_gallery: boolean;
    guest_rsvp_enabled: boolean;
    notifications_enabled: boolean;
    social_sharing_enabled: boolean;
  };
  quote_id?: string;
  proposal_id?: string;
  contract_id?: string;
  type: string;
  date: string;
  location?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface EventFilters {
  status?: ('em_planejamento' | 'contratado' | 'concluido' | 'cancelado')[];
  event_type?: string[];
  date_range?: {
    start: string;
    end: string;
  };
  search_query?: string;
}

export interface EventStats {
  total_events: number;
  upcoming_events: number;
  completed_events: number;
  events_this_month: number;
  total_revenue: number;
  average_event_value: number;
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
          id,
          type,
          date,
          location,
          status,
          notes,
          description,
          client_id,
          cerimonialista_id,
          quote_id,
          proposal_id,
          contract_id,
          tenant_id,
          created_at,
          updated_at
        `)
        .order('date', { ascending: false });

      const activeFilters = currentFilters || filters;
      
      if (activeFilters.status?.length) {
        const dbStatuses = activeFilters.status.map(mapStatusToDatabase);
        query = query.in('status', dbStatuses);
      }

      const { data: eventsData, error } = await query;

      if (error) throw error;

      const enhancedEvents: Event[] = (eventsData || []).map(event => ({
        id: event.id,
        tenant_id: event.tenant_id || 'anrielly_gomes',
        title: `Evento ${event.type}`,
        description: event.description,
        event_type: event.type,
        status: mapEventStatus(event.status),
        event_date: event.date,
        start_time: '14:00',
        end_time: '22:00',
        venue: event.location ? {
          name: event.location,
          address: event.location,
          city: 'São Paulo',
          state: 'SP',
          postal_code: '01000-000',
          capacity: 100,
          venue_type: 'salao',
          special_features: []
        } : undefined,
        client_id: event.client_id || '',
        organizer_id: event.cerimonialista_id || '',
        participants: [],
        guest_count: 50,
        budget: {
          total_budget: 10000,
          allocated_budget: 8000,
          spent_amount: 0,
          categories: []
        },
        timeline: [],
        checklist: [],
        suppliers: [],
        documents: [],
        gallery: [],
        settings: {
          public_gallery: false,
          guest_rsvp_enabled: true,
          notifications_enabled: true,
          social_sharing_enabled: false
        },
        quote_id: event.quote_id,
        proposal_id: event.proposal_id,
        contract_id: event.contract_id,
        type: event.type,
        date: event.date,
        location: event.location,
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
            mapEventStatus(e.status) === 'concluido'
          ).length,
          events_this_month: eventsData.filter(e => 
            new Date(e.created_at) >= thisMonth
          ).length,
          total_revenue: 0,
          average_event_value: 0,
        };
        
        setStats(stats);
      }
    } catch (error: any) {
      console.error('Erro ao buscar estatísticas:', error);
    }
  };

  const createEvent = async (eventData: Partial<Event>) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .insert([{
          type: eventData.event_type || eventData.type,
          date: eventData.event_date || eventData.date,
          location: eventData.venue?.name || eventData.location,
          status: mapStatusToDatabase(eventData.status || 'em_planejamento'),
          client_id: eventData.client_id,
          cerimonialista_id: eventData.organizer_id,
          notes: eventData.notes,
          tenant_id: eventData.tenant_id || 'anrielly_gomes',
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
          date: updates.event_date || updates.date,
          location: updates.venue?.name || updates.location,
          status: updates.status ? mapStatusToDatabase(updates.status) : undefined,
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

  const applyFilters = (newFilters: EventFilters) => {
    setFilters(newFilters);
    fetchEvents(newFilters);
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
    applyFilters,
    refetch: () => {
      fetchEvents();
      fetchStats();
    }
  };
};
