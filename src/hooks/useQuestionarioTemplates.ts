
import useSWR from 'swr'
import { supabase } from "@/integrations/supabase/client"

interface QuestionarioTemplate {
  id: string
  nome: string
  tipo_evento: string
  categoria: string
  descricao?: string
  is_default: boolean
  ativo: boolean
  ordem: number
  created_at: string
  updated_at: string
}

const fetcher = async (): Promise<QuestionarioTemplate[]> => {
  const { data, error } = await supabase
    .from('questionario_templates')
    .select('*')
    .order('ordem', { ascending: true })
    
  if (error) throw error
  
  return data || []
}

export const useQuestionarioTemplates = () => {
  const { data, error, mutate } = useSWR('questionario-templates', fetcher)
  
  return {
    templates: data || [],
    isLoading: !error && !data,
    error,
    mutate,
    refetch: mutate
  }
}
