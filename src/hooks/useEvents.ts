
import useSWR from 'swr';
import { supabase } from '@/integrations/supabase/client';

export interface Event {
  id: string;
  type: string;
  date?: string;
  location?: string;
  status: string;
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
  return data || [];
};

export const useEvents = () => {
  const { data, error, mutate } = useSWR('events-full', fetcher);
  
  return {
    events: data || [],
    isLoading: !error && !data,
    error,
    mutate,
    refetch: mutate
  };
};
