
import useSWR from 'swr';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type EventRow = Database['public']['Tables']['events']['Row'];
type ParticipantRow = Database['public']['Tables']['event_participants']['Row'];

export interface EventParticipant extends ParticipantRow {
  client?: { name: string; email: string; } | null;
  professional?: { name: string; email: string; } | null;
}

export interface Event extends EventRow {
  client?: { name: string; email: string; phone: string; } | null;
  participants?: EventParticipant[];
}

const fetcher = async (): Promise<Event[]> => {
  console.log('Fetching events from Supabase...');
  
  try {
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
    
    console.log('Events fetch result:', { data, error, count: data?.length });
    
    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Erro ao carregar eventos: ${error.message}`);
    }
    
    console.log('Mapped events:', data);
    return data || [];
  } catch (err) {
    console.error('Error in events fetcher:', err);
    throw err;
  }
};

export const useEvents = () => {
  const { data, error, mutate } = useSWR('events-full', fetcher, {
    onError: (error) => {
      console.error('SWR error in useEvents:', error);
    },
    onSuccess: (data) => {
      console.log('SWR success in useEvents:', data?.length, 'events loaded');
    }
  });
  
  console.log('useEvents hook state:', {
    data: data?.length,
    error: error?.message,
    isLoading: !error && !data
  });
  
  return {
    events: data || [],
    isLoading: !error && !data,
    error,
    mutate,
    refetch: mutate,
  };
};
