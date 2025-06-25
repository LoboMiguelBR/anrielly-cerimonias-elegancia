
import useSWR from 'swr'
import { supabase } from "@/integrations/supabase/client"
import { toast } from 'sonner'

interface QuestionarioTemplateSecao {
  id: string
  template_id: string
  titulo: string
  descricao?: string
  ordem: number
  ativo: boolean
  created_at: string
  updated_at: string
}

interface QuestionarioTemplatePergunta {
  id: string
  template_id: string
  secao_id: string
  texto: string
  tipo_resposta: string
  placeholder?: string
  opcoes_resposta?: any
  validacoes?: any
  obrigatoria: boolean
  ordem: number
  ativo: boolean
  created_at: string
  updated_at: string
}

interface QuestionarioTemplateStructure {
  secoes: QuestionarioTemplateSecao[]
  perguntas: QuestionarioTemplatePergunta[]
}

const fetcher = async (templateId: string): Promise<QuestionarioTemplateStructure> => {
  const [secoesResult, perguntasResult] = await Promise.all([
    supabase
      .from('questionario_template_secoes')
      .select('*')
      .eq('template_id', templateId)
      .order('ordem', { ascending: true }),
    supabase
      .from('questionario_template_perguntas')
      .select('*')
      .eq('template_id', templateId)
      .order('ordem', { ascending: true })
  ])
  
  if (secoesResult.error) throw secoesResult.error
  if (perguntasResult.error) throw perguntasResult.error
  
  return {
    secoes: secoesResult.data || [],
    perguntas: perguntasResult.data || []
  }
}

export const useQuestionarioTemplateStructure = (templateId: string) => {
  const { data, error, mutate } = useSWR(
    templateId ? `questionario-template-structure-${templateId}` : null,
    () => fetcher(templateId)
  )

  const updateTemplateSecao = async (secaoId: string, updates: Partial<QuestionarioTemplateSecao>) => {
    try {
      const { error } = await supabase
        .from('questionario_template_secoes')
        .update(updates)
        .eq('id', secaoId)

      if (error) throw error

      toast.success('Seção atualizada com sucesso!')
      mutate()
      return true
    } catch (error: any) {
      console.error('Erro ao atualizar seção:', error)
      toast.error(`Erro ao atualizar seção: ${error.message}`)
      return false
    }
  }

  const updateTemplatePergunta = async (perguntaId: string, updates: Partial<QuestionarioTemplatePergunta>) => {
    try {
      const { error } = await supabase
        .from('questionario_template_perguntas')
        .update(updates)
        .eq('id', perguntaId)

      if (error) throw error

      toast.success('Pergunta atualizada com sucesso!')
      mutate()
      return true
    } catch (error: any) {
      console.error('Erro ao atualizar pergunta:', error)
      toast.error(`Erro ao atualizar pergunta: ${error.message}`)
      return false
    }
  }

  const deleteTemplatePergunta = async (perguntaId: string) => {
    try {
      const { error } = await supabase
        .from('questionario_template_perguntas')
        .delete()
        .eq('id', perguntaId)

      if (error) throw error

      toast.success('Pergunta excluída com sucesso!')
      mutate()
      return true
    } catch (error: any) {
      console.error('Erro ao excluir pergunta:', error)
      toast.error(`Erro ao excluir pergunta: ${error.message}`)
      return false
    }
  }

  const addTemplatePergunta = async (secaoId: string, pergunta: Omit<QuestionarioTemplatePergunta, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { error } = await supabase
        .from('questionario_template_perguntas')
        .insert([pergunta])

      if (error) throw error

      toast.success('Pergunta adicionada com sucesso!')
      mutate()
      return true
    } catch (error: any) {
      console.error('Erro ao adicionar pergunta:', error)
      toast.error(`Erro ao adicionar pergunta: ${error.message}`)
      return false
    }
  }

  const reorderTemplatePerguntas = async (perguntasOrdenadas: { id: string; ordem: number }[]) => {
    try {
      const updates = perguntasOrdenadas.map(p => 
        supabase
          .from('questionario_template_perguntas')
          .update({ ordem: p.ordem })
          .eq('id', p.id)
      )

      await Promise.all(updates)
      toast.success('Ordem das perguntas atualizada!')
      mutate()
      return true
    } catch (error: any) {
      console.error('Erro ao reordenar perguntas:', error)
      toast.error(`Erro ao reordenar perguntas: ${error.message}`)
      return false
    }
  }

  const deleteTemplateSecao = async (secaoId: string) => {
    try {
      // Primeiro excluir todas as perguntas da seção
      const { error: perguntasError } = await supabase
        .from('questionario_template_perguntas')
        .delete()
        .eq('secao_id', secaoId)

      if (perguntasError) throw perguntasError

      // Depois excluir a seção
      const { error: secaoError } = await supabase
        .from('questionario_template_secoes')
        .delete()
        .eq('id', secaoId)

      if (secaoError) throw secaoError

      toast.success('Seção excluída com sucesso!')
      mutate()
      return true
    } catch (error: any) {
      console.error('Erro ao excluir seção:', error)
      toast.error(`Erro ao excluir seção: ${error.message}`)
      return false
    }
  }
  
  return {
    structure: data,
    isLoading: !error && !data,
    error,
    mutate,
    updateTemplateSecao,
    updateTemplatePergunta,
    deleteTemplatePergunta,
    addTemplatePergunta,
    reorderTemplatePerguntas,
    deleteTemplateSecao
  }
}
