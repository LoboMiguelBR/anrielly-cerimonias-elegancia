
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import useSWR from 'swr';

interface QuoteRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  event_type: string;
  event_date: string | null;
  event_location: string;
  message: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export function useQuoteRequests() {
  const fetcher = async (): Promise<QuoteRequest[]> => {
    const { data, error } = await supabase
      .from('quote_requests')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      throw error;
    }
    
    return data || [];
  };

  const { data, error, mutate, isLoading } = useSWR(
    'quote_requests',
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnMount: true,
      refreshInterval: 30000, // Refresh every 30 seconds
    }
  );

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('public:quote_requests')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'quote_requests' 
        }, 
        (payload) => {
          console.log('Real-time update received:', payload);
          mutate();
        })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [mutate]);

  return {
    data,
    error,
    isLoading,
    mutate,
  };
}
