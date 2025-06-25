
import useSWR from 'swr';
import { supabase } from '@/integrations/supabase/client';
import { Questionario } from '@/components/admin/tabs/types/questionario';

const fetcher = async (): Promise<Questionario[]> => {
  const { data, error } = await supabase
    .from('questionarios_noivos')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  
  return data || [];
};

export const useQuestionarios = () => {
  const { data, error, mutate } = useSWR('questionarios', fetcher);
  
  return {
    questionarios: data || [],
    isLoading: !error && !data,
    error,
    refetch: mutate
  };
};
