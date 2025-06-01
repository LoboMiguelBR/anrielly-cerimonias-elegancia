
import useSWR from 'swr';
import { supabase } from '@/integrations/supabase/client';

export interface Cliente {
  id: string;
  name: string;
  email: string;
  phone: string;
  event_type: string;
  event_date?: string;
  event_location: string;
  message?: string;
  status: string;
  quote_id?: string;
  origin: 'lead_convertido' | 'questionario';
  created_at: string;
  updated_at: string;
}

const fetcher = async (): Promise<Cliente[]> => {
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return data || [];
};

export const useClientes = () => {
  const { data, error, mutate } = useSWR('clientes', fetcher);
  
  return {
    clientes: data || [],
    isLoading: !error && !data,
    error,
    mutate,
    refetch: mutate
  };
};
