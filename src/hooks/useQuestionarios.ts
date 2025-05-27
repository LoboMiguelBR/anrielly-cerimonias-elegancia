
import useSWR from 'swr'
import { supabase } from "@/integrations/supabase/client"

interface QuestionarioStats {
  total: number
  preenchidos: number
  rascunhos: number
  concluidos: number
}

const fetcher = async (): Promise<QuestionarioStats> => {
  const { data, error } = await supabase
    .from('questionarios_noivos')
    .select('status')
    
  if (error) throw error
  
  const questionarios = data || []
  
  return {
    total: questionarios.length,
    preenchidos: questionarios.filter(q => q.status === 'preenchido').length,
    rascunhos: questionarios.filter(q => q.status === 'rascunho').length,
    concluidos: questionarios.filter(q => q.status === 'concluido').length
  }
}

export const useQuestionarios = () => {
  const { data, error, mutate } = useSWR('questionarios-stats', fetcher)
  
  return {
    stats: data,
    isLoading: !error && !data,
    error,
    mutate
  }
}
