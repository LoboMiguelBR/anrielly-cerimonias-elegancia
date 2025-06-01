
import useSWR from 'swr';
import { supabase } from '@/integrations/supabase/client';

export interface EventParticipant {
  id: string;
  event_id: string;
  user_email: string;
  name?: string;
  participant_type: string; // Mudado para string para aceitar qualquer valor do banco
  client_id?: string;
  professional_id?: string;
  profile_id?: string;
  role: string;
  invited: boolean;
  accepted: boolean;
  created_at: string;
}

export interface Event {
  id: string;
  type: string;
  date?: string;
  location?: string;
  status: 'em_planejamento' | 'confirmado' | 'em_andamento' | 'concluido' | 'cancelado';
  notes?: string;
  client_id?: string;
  cerimonialista_id?: string;
  description?: string;
  created_at: string;
  updated_at: string;
  participants?: EventParticipant[];
}

const fetcher = async (): Promise<Event[]> => {
  const { data, error } = await supabase
    .from('events')
    .select(`
      *,
      client:clientes(name, email, phone),
      participants:event_participants(
        *,
        client:clientes(name, email),
        professional:professionals(name, email)
      )
    `)
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  
  // Mapear os status do banco para os tipos esperados
  return (data || []).map(event => ({
    ...event,
    status: mapEventStatus(event.status),
    participants: (event.participants || []).map((p: any) => ({
      id: p.id,
      event_id: p.event_id,
      user_email: p.user_email,
      name: p.name,
      participant_type: p.participant_type || 'cliente',
      client_id: p.client_id,
      professional_id: p.professional_id,
      profile_id: p.profile_id,
      role: p.role,
      invited: p.invited || false,
      accepted: p.accepted || false,
      created_at: p.created_at
    }))
  }));
};

// Função para mapear status do banco para tipos da interface
const mapEventStatus = (status: string): Event['status'] => {
  switch (status) {
    case 'contratado':
      return 'confirmado';
    default:
      return status as Event['status'];
  }
};

export const useEvents = () => {
  const { data, error, mutate } = useSWR('events-full', fetcher);
  
  const createEventFromProposal = async (proposalData: any) => {
    try {
      const eventData = {
        type: proposalData.event_type,
        date: proposalData.event_date,
        location: proposalData.event_location,
        status: 'em_planejamento' as const,
        description: `Evento criado a partir da proposta para ${proposalData.client_name}`,
        client_id: null
      };

      const { data: newEvent, error } = await supabase
        .from('events')
        .insert([{
          ...eventData,
          status: eventData.status as any
        }])
        .select()
        .single();

      if (error) throw error;

      mutate();
      return newEvent;
    } catch (err) {
      console.error('Erro ao criar evento a partir da proposta:', err);
      throw err;
    }
  };
  
  return {
    events: data || [],
    isLoading: !error && !data,
    error,
    mutate,
    refetch: mutate,
    createEventFromProposal
  };
};
