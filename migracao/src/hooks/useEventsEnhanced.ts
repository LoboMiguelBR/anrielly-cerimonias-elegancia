import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Event, 
  EventParticipant, 
  EventFilters, 
  EventSearchResult,
  EventAnalytics,
  EventTimelineItem,
  EventChecklistItem,
  EventDocument,
  CreateEventData,
  UpdateEventData
} from '@/types/events';
import { useAuth } from '@/hooks/useAuth';

// Chaves de query para cache
export const eventKeys = {
  all: ['events'] as const,
  lists: () => [...eventKeys.all, 'list'] as const,
  list: (filters: EventFilters) => [...eventKeys.lists(), { filters }] as const,
  details: () => [...eventKeys.all, 'detail'] as const,
  detail: (id: string) => [...eventKeys.details(), id] as const,
  participants: (eventId: string) => [...eventKeys.detail(eventId), 'participants'] as const,
  timeline: (eventId: string) => [...eventKeys.detail(eventId), 'timeline'] as const,
  checklist: (eventId: string) => [...eventKeys.detail(eventId), 'checklist'] as const,
  documents: (eventId: string) => [...eventKeys.detail(eventId), 'documents'] as const,
  analytics: (eventId: string) => [...eventKeys.detail(eventId), 'analytics'] as const,
};

// Serviços de API (camada de abstração)
class EventService {
  static async getEvents(filters?: EventFilters): Promise<EventSearchResult> {
    let query = supabase
      .from('events')
      .select('*', { count: 'exact' });

    // Aplicar filtros
    if (filters?.status?.length) {
      query = query.in('status', filters.status);
    }
    
    if (filters?.event_type?.length) {
      query = query.in('type', filters.event_type);
    }
    
    if (filters?.date_range) {
      query = query
        .gte('date', filters.date_range.start)
        .lte('date', filters.date_range.end);
    }
    
    if (filters?.organizer_id) {
      query = query.eq('organizer_id', filters.organizer_id);
    }
    
    if (filters?.client_id) {
      query = query.eq('client_id', filters.client_id);
    }
    
    if (filters?.search_query) {
      query = query.or(`title.ilike.%${filters.search_query}%,notes.ilike.%${filters.search_query}%`);
    }

    // Ordenação
    query = query.order('created_at', { ascending: false });

    const { data, error, count } = await query;

    if (error) throw error;

    return {
      events: data || [],
      total_count: count || 0,
      page: 1,
      per_page: 50,
      total_pages: Math.ceil((count || 0) / 50),
      filters_applied: filters || {},
    };
  }

  static async getEventById(id: string): Promise<Event | null> {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }

    return data;
  }

  static async createEvent(eventData: CreateEventData): Promise<Event> {
    const { data, error } = await supabase
      .from('events')
      .insert([eventData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateEvent(id: string, updates: UpdateEventData): Promise<Event> {
    const { data, error } = await supabase
      .from('events')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteEvent(id: string): Promise<void> {
    // Deletar participantes primeiro
    await supabase
      .from('event_participants')
      .delete()
      .eq('event_id', id);

    // Deletar timeline
    await supabase
      .from('event_timeline')
      .delete()
      .eq('event_id', id);

    // Deletar checklist
    await supabase
      .from('event_checklist')
      .delete()
      .eq('event_id', id);

    // Deletar documentos
    await supabase
      .from('event_documents')
      .delete()
      .eq('event_id', id);

    // Deletar evento
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  static async getParticipants(eventId: string): Promise<EventParticipant[]> {
    const { data, error } = await supabase
      .from('event_participants')
      .select('*')
      .eq('event_id', eventId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async addParticipant(participantData: Omit<EventParticipant, 'id' | 'created_at' | 'updated_at'>): Promise<EventParticipant> {
    const { data, error } = await supabase
      .from('event_participants')
      .insert([{
        ...participantData,
        magic_link_token: crypto.randomUUID()
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateParticipant(id: string, updates: Partial<EventParticipant>): Promise<EventParticipant> {
    const { data, error } = await supabase
      .from('event_participants')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async removeParticipant(id: string): Promise<void> {
    const { error } = await supabase
      .from('event_participants')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  static async getTimeline(eventId: string): Promise<EventTimelineItem[]> {
    const { data, error } = await supabase
      .from('event_timeline')
      .select('*')
      .eq('event_id', eventId)
      .order('scheduled_time', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  static async createTimelineItem(timelineData: Omit<EventTimelineItem, 'id' | 'created_at' | 'updated_at'>): Promise<EventTimelineItem> {
    const { data, error } = await supabase
      .from('event_timeline')
      .insert([timelineData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateTimelineItem(id: string, updates: Partial<EventTimelineItem>): Promise<EventTimelineItem> {
    const { data, error } = await supabase
      .from('event_timeline')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteTimelineItem(id: string): Promise<void> {
    const { error } = await supabase
      .from('event_timeline')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  static async getChecklist(eventId: string): Promise<EventChecklistItem[]> {
    const { data, error } = await supabase
      .from('event_checklist')
      .select('*')
      .eq('event_id', eventId)
      .order('due_date', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  static async createChecklistItem(checklistData: Omit<EventChecklistItem, 'id' | 'created_at' | 'updated_at'>): Promise<EventChecklistItem> {
    const { data, error } = await supabase
      .from('event_checklist')
      .insert([checklistData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateChecklistItem(id: string, updates: Partial<EventChecklistItem>): Promise<EventChecklistItem> {
    const { data, error } = await supabase
      .from('event_checklist')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteChecklistItem(id: string): Promise<void> {
    const { error } = await supabase
      .from('event_checklist')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  static async getDocuments(eventId: string): Promise<EventDocument[]> {
    const { data, error } = await supabase
      .from('event_documents')
      .select('*')
      .eq('event_id', eventId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async uploadDocument(documentData: Omit<EventDocument, 'id' | 'created_at'>): Promise<EventDocument> {
    const { data, error } = await supabase
      .from('event_documents')
      .insert([documentData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteDocument(id: string): Promise<void> {
    const { error } = await supabase
      .from('event_documents')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  static async getAnalytics(eventId: string): Promise<EventAnalytics> {
    // Implementar lógica de analytics
    // Por enquanto, retornar dados mock
    return {
      event_id: eventId,
      total_guests: 0,
      confirmed_guests: 0,
      pending_rsvp: 0,
      declined_guests: 0,
      total_budget: 0,
      spent_budget: 0,
      remaining_budget: 0,
      completion_percentage: 0,
      timeline_progress: 0,
      checklist_progress: 0,
      supplier_status: {},
      generated_at: new Date().toISOString(),
    };
  }
}

// Hook principal para eventos (compatível com código existente)
export function useEvents(filters?: EventFilters) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Query para listar eventos
  const {
    data: eventsResult,
    isLoading,
    error,
    refetch: fetchEvents,
  } = useQuery({
    queryKey: eventKeys.list(filters || {}),
    queryFn: () => EventService.getEvents(filters),
    staleTime: 5 * 60 * 1000, // 5 minutos
    cacheTime: 10 * 60 * 1000, // 10 minutos
    enabled: !!user,
  });

  // Mutations
  const createEventMutation = useMutation({
    mutationFn: EventService.createEvent,
    onSuccess: (newEvent) => {
      queryClient.invalidateQueries(eventKeys.lists());
      toast.success('Evento criado com sucesso!');
    },
    onError: (error: any) => {
      console.error('Erro ao criar evento:', error);
      toast.error('Erro ao criar evento');
    },
  });

  const updateEventMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UpdateEventData }) =>
      EventService.updateEvent(id, updates),
    onSuccess: (updatedEvent) => {
      queryClient.invalidateQueries(eventKeys.lists());
      queryClient.invalidateQueries(eventKeys.detail(updatedEvent.id));
      toast.success('Evento atualizado com sucesso!');
    },
    onError: (error: any) => {
      console.error('Erro ao atualizar evento:', error);
      toast.error('Erro ao atualizar evento');
    },
  });

  const deleteEventMutation = useMutation({
    mutationFn: EventService.deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries(eventKeys.lists());
      toast.success('Evento deletado com sucesso!');
    },
    onError: (error: any) => {
      console.error('Erro ao deletar evento:', error);
      toast.error('Erro ao deletar evento');
    },
  });

  // Métodos de conveniência (compatibilidade com código existente)
  const createEvent = (eventData: CreateEventData) => {
    return createEventMutation.mutateAsync(eventData);
  };

  const updateEvent = (id: string, updates: UpdateEventData) => {
    return updateEventMutation.mutateAsync({ id, updates });
  };

  const deleteEvent = (id: string) => {
    return deleteEventMutation.mutateAsync(id);
  };

  // Método para criar evento a partir de proposta (compatibilidade)
  const createEventFromProposal = async (proposalId: string, proposalData: any) => {
    const eventData: CreateEventData = {
      proposal_id: proposalId,
      quote_id: proposalData.quote_request_id,
      type: proposalData.event_type,
      date: proposalData.event_date,
      location: proposalData.event_location,
      status: 'em_planejamento',
      tenant_id: user?.tenant_id || 'anrielly_gomes',
      title: `Evento - ${proposalData.event_type}`,
      event_type: proposalData.event_type,
      start_date: proposalData.event_date,
      end_date: proposalData.event_date,
      guest_count: proposalData.guest_count || 50,
      estimated_budget: proposalData.budget || 0,
      client_id: proposalData.client_id,
      organizer_id: user?.id || '',
      suppliers: [],
      timeline: [],
      checklist: [],
      documents: [],
      is_public: false,
      allow_rsvp: true,
      theme_colors: [],
      tags: [],
      custom_fields: {},
      priority: 'media',
    };

    return createEvent(eventData);
  };

  return {
    // Dados (compatibilidade)
    events: eventsResult?.events || [],
    participants: [], // Será preenchido por hook específico
    isLoading,
    error: error?.message || null,

    // Métodos (compatibilidade)
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    createEventFromProposal,

    // Novos dados
    eventsResult,
    totalCount: eventsResult?.total_count || 0,
    totalPages: eventsResult?.total_pages || 0,

    // Estados de loading das mutations
    isCreating: createEventMutation.isLoading,
    isUpdating: updateEventMutation.isLoading,
    isDeleting: deleteEventMutation.isLoading,
  };
}

// Hook para evento específico
export function useEvent(eventId: string) {
  const queryClient = useQueryClient();

  const {
    data: event,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: eventKeys.detail(eventId),
    queryFn: () => EventService.getEventById(eventId),
    enabled: !!eventId,
    staleTime: 2 * 60 * 1000, // 2 minutos
  });

  const updateEventMutation = useMutation({
    mutationFn: (updates: UpdateEventData) =>
      EventService.updateEvent(eventId, updates),
    onSuccess: (updatedEvent) => {
      queryClient.setQueryData(eventKeys.detail(eventId), updatedEvent);
      queryClient.invalidateQueries(eventKeys.lists());
      toast.success('Evento atualizado com sucesso!');
    },
    onError: (error: any) => {
      console.error('Erro ao atualizar evento:', error);
      toast.error('Erro ao atualizar evento');
    },
  });

  return {
    event,
    isLoading,
    error: error?.message || null,
    refetch,
    updateEvent: (updates: UpdateEventData) => updateEventMutation.mutateAsync(updates),
    isUpdating: updateEventMutation.isLoading,
  };
}

// Hook para participantes do evento
export function useEventParticipants(eventId: string) {
  const queryClient = useQueryClient();

  const {
    data: participants,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: eventKeys.participants(eventId),
    queryFn: () => EventService.getParticipants(eventId),
    enabled: !!eventId,
    staleTime: 2 * 60 * 1000,
  });

  const addParticipantMutation = useMutation({
    mutationFn: EventService.addParticipant,
    onSuccess: () => {
      queryClient.invalidateQueries(eventKeys.participants(eventId));
      toast.success('Participante adicionado com sucesso!');
    },
    onError: (error: any) => {
      console.error('Erro ao adicionar participante:', error);
      toast.error('Erro ao adicionar participante');
    },
  });

  const updateParticipantMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<EventParticipant> }) =>
      EventService.updateParticipant(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries(eventKeys.participants(eventId));
      toast.success('Participante atualizado com sucesso!');
    },
    onError: (error: any) => {
      console.error('Erro ao atualizar participante:', error);
      toast.error('Erro ao atualizar participante');
    },
  });

  const removeParticipantMutation = useMutation({
    mutationFn: EventService.removeParticipant,
    onSuccess: () => {
      queryClient.invalidateQueries(eventKeys.participants(eventId));
      toast.success('Participante removido com sucesso!');
    },
    onError: (error: any) => {
      console.error('Erro ao remover participante:', error);
      toast.error('Erro ao remover participante');
    },
  });

  // Métodos de conveniência (compatibilidade)
  const addParticipant = (email: string, name: string, role: EventParticipant['role']) => {
    const participantData: Omit<EventParticipant, 'id' | 'created_at' | 'updated_at'> = {
      event_id: eventId,
      user_email: email,
      name,
      role,
      invited: true,
      accepted: false,
      participant_type: role,
      permissions: [],
      contact_info: {},
      plus_one_allowed: false,
      rsvp_status: 'pending',
    };
    return addParticipantMutation.mutateAsync(participantData);
  };

  const removeParticipant = (participantId: string) => {
    return removeParticipantMutation.mutateAsync(participantId);
  };

  const getParticipantsByEvent = async (eventId: string) => {
    return EventService.getParticipants(eventId);
  };

  return {
    participants: participants || [],
    isLoading,
    error: error?.message || null,
    refetch,
    addParticipant,
    removeParticipant,
    updateParticipant: (id: string, updates: Partial<EventParticipant>) =>
      updateParticipantMutation.mutateAsync({ id, updates }),
    getParticipantsByEvent,
    isAdding: addParticipantMutation.isLoading,
    isUpdating: updateParticipantMutation.isLoading,
    isRemoving: removeParticipantMutation.isLoading,
  };
}

// Hook para timeline do evento
export function useEventTimeline(eventId: string) {
  const queryClient = useQueryClient();

  const {
    data: timeline,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: eventKeys.timeline(eventId),
    queryFn: () => EventService.getTimeline(eventId),
    enabled: !!eventId,
    staleTime: 2 * 60 * 1000,
  });

  const createTimelineItemMutation = useMutation({
    mutationFn: EventService.createTimelineItem,
    onSuccess: () => {
      queryClient.invalidateQueries(eventKeys.timeline(eventId));
      toast.success('Item da timeline criado com sucesso!');
    },
    onError: (error: any) => {
      console.error('Erro ao criar item da timeline:', error);
      toast.error('Erro ao criar item da timeline');
    },
  });

  const updateTimelineItemMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<EventTimelineItem> }) =>
      EventService.updateTimelineItem(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries(eventKeys.timeline(eventId));
      toast.success('Item da timeline atualizado com sucesso!');
    },
    onError: (error: any) => {
      console.error('Erro ao atualizar item da timeline:', error);
      toast.error('Erro ao atualizar item da timeline');
    },
  });

  const deleteTimelineItemMutation = useMutation({
    mutationFn: EventService.deleteTimelineItem,
    onSuccess: () => {
      queryClient.invalidateQueries(eventKeys.timeline(eventId));
      toast.success('Item da timeline removido com sucesso!');
    },
    onError: (error: any) => {
      console.error('Erro ao remover item da timeline:', error);
      toast.error('Erro ao remover item da timeline');
    },
  });

  return {
    timeline: timeline || [],
    isLoading,
    error: error?.message || null,
    refetch,
    createTimelineItem: (data: Omit<EventTimelineItem, 'id' | 'created_at' | 'updated_at'>) =>
      createTimelineItemMutation.mutateAsync(data),
    updateTimelineItem: (id: string, updates: Partial<EventTimelineItem>) =>
      updateTimelineItemMutation.mutateAsync({ id, updates }),
    deleteTimelineItem: (id: string) => deleteTimelineItemMutation.mutateAsync(id),
    isCreating: createTimelineItemMutation.isLoading,
    isUpdating: updateTimelineItemMutation.isLoading,
    isDeleting: deleteTimelineItemMutation.isLoading,
  };
}

// Hook para checklist do evento
export function useEventChecklist(eventId: string) {
  const queryClient = useQueryClient();

  const {
    data: checklist,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: eventKeys.checklist(eventId),
    queryFn: () => EventService.getChecklist(eventId),
    enabled: !!eventId,
    staleTime: 2 * 60 * 1000,
  });

  const createChecklistItemMutation = useMutation({
    mutationFn: EventService.createChecklistItem,
    onSuccess: () => {
      queryClient.invalidateQueries(eventKeys.checklist(eventId));
      toast.success('Item do checklist criado com sucesso!');
    },
    onError: (error: any) => {
      console.error('Erro ao criar item do checklist:', error);
      toast.error('Erro ao criar item do checklist');
    },
  });

  const updateChecklistItemMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<EventChecklistItem> }) =>
      EventService.updateChecklistItem(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries(eventKeys.checklist(eventId));
      toast.success('Item do checklist atualizado com sucesso!');
    },
    onError: (error: any) => {
      console.error('Erro ao atualizar item do checklist:', error);
      toast.error('Erro ao atualizar item do checklist');
    },
  });

  const deleteChecklistItemMutation = useMutation({
    mutationFn: EventService.deleteChecklistItem,
    onSuccess: () => {
      queryClient.invalidateQueries(eventKeys.checklist(eventId));
      toast.success('Item do checklist removido com sucesso!');
    },
    onError: (error: any) => {
      console.error('Erro ao remover item do checklist:', error);
      toast.error('Erro ao remover item do checklist');
    },
  });

  return {
    checklist: checklist || [],
    isLoading,
    error: error?.message || null,
    refetch,
    createChecklistItem: (data: Omit<EventChecklistItem, 'id' | 'created_at' | 'updated_at'>) =>
      createChecklistItemMutation.mutateAsync(data),
    updateChecklistItem: (id: string, updates: Partial<EventChecklistItem>) =>
      updateChecklistItemMutation.mutateAsync({ id, updates }),
    deleteChecklistItem: (id: string) => deleteChecklistItemMutation.mutateAsync(id),
    isCreating: createChecklistItemMutation.isLoading,
    isUpdating: updateChecklistItemMutation.isLoading,
    isDeleting: deleteChecklistItemMutation.isLoading,
  };
}

// Hook para documentos do evento
export function useEventDocuments(eventId: string) {
  const queryClient = useQueryClient();

  const {
    data: documents,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: eventKeys.documents(eventId),
    queryFn: () => EventService.getDocuments(eventId),
    enabled: !!eventId,
    staleTime: 2 * 60 * 1000,
  });

  const uploadDocumentMutation = useMutation({
    mutationFn: EventService.uploadDocument,
    onSuccess: () => {
      queryClient.invalidateQueries(eventKeys.documents(eventId));
      toast.success('Documento enviado com sucesso!');
    },
    onError: (error: any) => {
      console.error('Erro ao enviar documento:', error);
      toast.error('Erro ao enviar documento');
    },
  });

  const deleteDocumentMutation = useMutation({
    mutationFn: EventService.deleteDocument,
    onSuccess: () => {
      queryClient.invalidateQueries(eventKeys.documents(eventId));
      toast.success('Documento removido com sucesso!');
    },
    onError: (error: any) => {
      console.error('Erro ao remover documento:', error);
      toast.error('Erro ao remover documento');
    },
  });

  return {
    documents: documents || [],
    isLoading,
    error: error?.message || null,
    refetch,
    uploadDocument: (data: Omit<EventDocument, 'id' | 'created_at'>) =>
      uploadDocumentMutation.mutateAsync(data),
    deleteDocument: (id: string) => deleteDocumentMutation.mutateAsync(id),
    isUploading: uploadDocumentMutation.isLoading,
    isDeleting: deleteDocumentMutation.isLoading,
  };
}

// Hook para analytics do evento
export function useEventAnalytics(eventId: string) {
  const {
    data: analytics,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: eventKeys.analytics(eventId),
    queryFn: () => EventService.getAnalytics(eventId),
    enabled: !!eventId,
    staleTime: 5 * 60 * 1000, // 5 minutos
    cacheTime: 10 * 60 * 1000, // 10 minutos
  });

  return {
    analytics,
    isLoading,
    error: error?.message || null,
    refetch,
  };
}

// Hook para ações de eventos (compatibilidade com código existente)
export function useEventActions() {
  const queryClient = useQueryClient();

  const updateEventMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Event> }) =>
      EventService.updateEvent(id, data),
    onSuccess: (updatedEvent) => {
      queryClient.invalidateQueries(eventKeys.lists());
      queryClient.invalidateQueries(eventKeys.detail(updatedEvent.id));
      toast.success('Evento atualizado com sucesso!');
    },
    onError: (error: any) => {
      console.error('Erro ao atualizar evento:', error);
      toast.error('Erro ao atualizar evento');
    },
  });

  const deleteEventMutation = useMutation({
    mutationFn: EventService.deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries(eventKeys.lists());
      toast.success('Evento deletado com sucesso!');
    },
    onError: (error: any) => {
      console.error('Erro ao deletar evento:', error);
      toast.error('Erro ao deletar evento');
    },
  });

  const addParticipantMutation = useMutation({
    mutationFn: ({ eventId, email, name, role }: {
      eventId: string;
      email: string;
      name: string;
      role: EventParticipant['role'];
    }) => {
      const participantData: Omit<EventParticipant, 'id' | 'created_at' | 'updated_at'> = {
        event_id: eventId,
        user_email: email,
        name,
        role,
        invited: true,
        accepted: false,
        participant_type: role,
        permissions: [],
        contact_info: {},
        plus_one_allowed: false,
        rsvp_status: 'pending',
      };
      return EventService.addParticipant(participantData);
    },
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries(eventKeys.participants(eventId));
      toast.success('Participante adicionado com sucesso!');
    },
    onError: (error: any) => {
      console.error('Erro ao adicionar participante:', error);
      toast.error('Erro ao adicionar participante');
    },
  });

  const removeParticipantMutation = useMutation({
    mutationFn: EventService.removeParticipant,
    onSuccess: () => {
      queryClient.invalidateQueries(eventKeys.all);
      toast.success('Participante removido com sucesso!');
    },
    onError: (error: any) => {
      console.error('Erro ao remover participante:', error);
      toast.error('Erro ao remover participante');
    },
  });

  return {
    updateEvent: (id: string, data: Partial<Event>) =>
      updateEventMutation.mutateAsync({ id, data }),
    deleteEvent: (id: string) => deleteEventMutation.mutateAsync(id),
    updateStatus: (id: string, status: Event['status']) =>
      updateEventMutation.mutateAsync({ id, data: { status } }),
    addParticipant: (eventId: string, email: string, name: string, role: EventParticipant['role']) =>
      addParticipantMutation.mutateAsync({ eventId, email, name, role }),
    removeParticipant: (participantId: string) =>
      removeParticipantMutation.mutateAsync(participantId),
    loading: updateEventMutation.isLoading || deleteEventMutation.isLoading ||
             addParticipantMutation.isLoading || removeParticipantMutation.isLoading,
  };
}

// Exportação para compatibilidade
export { useEvents as default };

