
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

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

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [participants, setParticipants] = useState<EventParticipant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Fetch events
  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({
        title: "Erro ao carregar eventos",
        description: "Não foi possível carregar os eventos",
        variant: "destructive",
      });
    }
  };

  // Fetch participants
  const fetchParticipants = async () => {
    try {
      const { data, error } = await supabase
        .from('event_participants')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setParticipants(data || []);
    } catch (error) {
      console.error('Error fetching participants:', error);
    }
  };

  // Create event from proposal
  const createEventFromProposal = async (proposalId: string, proposalData: any) => {
    try {
      const eventData = {
        proposal_id: proposalId,
        quote_id: proposalData.quote_request_id,
        type: proposalData.event_type,
        date: proposalData.event_date,
        location: proposalData.event_location,
        status: 'em_planejamento' as const,
        tenant_id: 'anrielly_gomes'
      };

      const { data, error } = await supabase
        .from('events')
        .insert([eventData])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Evento criado",
        description: "Evento criado automaticamente a partir da proposta",
      });

      await fetchEvents();
      return data;
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: "Erro ao criar evento",
        description: "Não foi possível criar o evento",
        variant: "destructive",
      });
    }
  };

  // Add participant to event
  const addParticipant = async (eventId: string, email: string, name: string, role: EventParticipant['role']) => {
    try {
      const participantData = {
        event_id: eventId,
        user_email: email,
        name: name,
        role: role,
        invited: true,
        accepted: false,
        magic_link_token: crypto.randomUUID()
      };

      const { data, error } = await supabase
        .from('event_participants')
        .insert([participantData])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Participante adicionado",
        description: `${name} foi adicionado ao evento como ${role}`,
      });

      await fetchParticipants();
      return data;
    } catch (error) {
      console.error('Error adding participant:', error);
      toast({
        title: "Erro ao adicionar participante",
        description: "Não foi possível adicionar o participante",
        variant: "destructive",
      });
    }
  };

  // Get event by ID
  const getEventById = async (eventId: string) => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching event:', error);
      return null;
    }
  };

  // Get participants by event
  const getParticipantsByEvent = async (eventId: string) => {
    try {
      const { data, error } = await supabase
        .from('event_participants')
        .select('*')
        .eq('event_id', eventId);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching participants:', error);
      return [];
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchEvents(), fetchParticipants()]);
      setIsLoading(false);
    };

    loadData();
  }, []);

  return {
    events,
    participants,
    isLoading,
    fetchEvents,
    fetchParticipants,
    createEventFromProposal,
    addParticipant,
    getEventById,
    getParticipantsByEvent
  };
}
