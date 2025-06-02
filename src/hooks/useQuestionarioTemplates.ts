
import useSWR from 'swr'
import { supabase } from "@/integrations/supabase/client"
import { toast } from 'sonner'

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
  
  const deleteTemplate = async (templateId: string): Promise<boolean> => {
    try {
      // Verificar se é um template padrão
      const template = data?.find(t => t.id === templateId)
      if (template?.is_default) {
        toast.error('Não é possível excluir um template padrão')
        return false
      }

      // Primeiro, deletar as perguntas associadas
      const { error: perguntasError } = await supabase
        .from('questionario_template_perguntas')
        .delete()
        .eq('template_id', templateId)

      if (perguntasError) {
        console.error('Erro ao deletar perguntas:', perguntasError)
        throw perguntasError
      }

      // Depois, deletar as seções associadas
      const { error: secoesError } = await supabase
        .from('questionario_template_secoes')
        .delete()
        .eq('template_id', templateId)

      if (secoesError) {
        console.error('Erro ao deletar seções:', secoesError)
        throw secoesError
      }

      // Por fim, deletar o template
      const { error: templateError } = await supabase
        .from('questionario_templates')
        .delete()
        .eq('id', templateId)

      if (templateError) {
        console.error('Erro ao deletar template:', templateError)
        throw templateError
      }

      toast.success('Template excluído com sucesso!')
      mutate() // Recarregar os dados
      return true
    } catch (error: any) {
      console.error('Erro ao excluir template:', error)
      toast.error(`Erro ao excluir template: ${error.message}`)
      return false
    }
  }
  
  return {
    templates: data || [],
    isLoading: !error && !data,
    error,
    mutate,
    refetch: mutate,
    deleteTemplate
  }
}
