
import useSWR from 'swr';
import { supabase } from '@/integrations/supabase/client';

export interface Event {
  id: string;
  type: string;
  date?: string;
  location?: string;
  status: 'em_planejamento' | 'confirmado' | 'em_andamento' | 'concluido' | 'cancelado';
  notes?: string;
  client_id?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface EventParticipant {
  id: string;
  event_id: string;
  user_email: string;
  name?: string;
  participant_type: 'cliente' | 'cerimonialista';
  client_id?: string;
  professional_id?: string;
  role: string;
  invited: boolean;
  accepted: boolean;
  created_at: string;
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
    status: mapEventStatus(event.status)
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
