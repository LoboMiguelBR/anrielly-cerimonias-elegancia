
import useSWR from 'swr'
import { supabase } from "@/integrations/supabase/client"
import type { Json } from "@/integrations/supabase/types"

interface QuestionarioStats {
  total: number
  preenchidos: number
  rascunhos: number
  concluidos: number
}

interface Questionario {
  id: string;
  link_publico: string;
  nome_responsavel: string;
  email: string;
  status: string;
  data_criacao: string;
  data_atualizacao: string;
  respostas_json: Json | null;
  total_perguntas_resp: number;
  historia_gerada?: string;
}

const fetcher = async (): Promise<{ questionarios: Questionario[], stats: QuestionarioStats }> => {
  const { data, error } = await supabase
    .from('questionarios_noivos')
    .select('*')
    .order('data_criacao', { ascending: false })
    
  if (error) throw error
  
  const questionarios = data || []
  
  const stats = {
    total: questionarios.length,
    preenchidos: questionarios.filter(q => q.status === 'preenchido').length,
    rascunhos: questionarios.filter(q => q.status === 'rascunho').length,
    concluidos: questionarios.filter(q => q.status === 'concluido').length
  }

  return { questionarios, stats }
}

export const useQuestionarios = () => {
  const { data, error, mutate } = useSWR('questionarios-full', fetcher)
  
  return {
    questionarios: data?.questionarios || [],
    stats: data?.stats,
    isLoading: !error && !data,
    error,
    mutate,
    refetch: mutate
  }
}
