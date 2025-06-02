
import useSWR from 'swr'
import { supabase } from "@/integrations/supabase/client"
import { toast } from 'sonner'

interface QuestionarioSecao {
  id: string
  questionario_id: string
  template_secao_id?: string
  titulo: string
  descricao?: string
  ordem: number
  ativo: boolean
  created_at: string
  updated_at: string
}

interface QuestionarioPergunta {
  id: string
  questionario_id: string
  secao_id: string
  template_pergunta_id?: string
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

interface QuestionarioStructure {
  secoes: QuestionarioSecao[]
  perguntas: QuestionarioPergunta[]
}

const fetcher = async (questionarioId: string): Promise<QuestionarioStructure> => {
  const [secoesResult, perguntasResult] = await Promise.all([
    supabase
      .from('questionario_secoes')
      .select('*')
      .eq('questionario_id', questionarioId)
      .order('ordem', { ascending: true }),
    supabase
      .from('questionario_perguntas')
      .select('*')
      .eq('questionario_id', questionarioId)
      .order('ordem', { ascending: true })
  ])
  
  if (secoesResult.error) throw secoesResult.error
  if (perguntasResult.error) throw perguntasResult.error
  
  return {
    secoes: secoesResult.data || [],
    perguntas: perguntasResult.data || []
  }
}

export const useQuestionarioStructure = (questionarioId: string) => {
  const { data, error, mutate } = useSWR(
    questionarioId ? `questionario-structure-${questionarioId}` : null,
    () => fetcher(questionarioId)
  )

  const updateSecao = async (secaoId: string, updates: Partial<QuestionarioSecao>) => {
    try {
      const { error } = await supabase
        .from('questionario_secoes')
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

  const updatePergunta = async (perguntaId: string, updates: Partial<QuestionarioPergunta>) => {
    try {
      const { error } = await supabase
        .from('questionario_perguntas')
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

  const deletePergunta = async (perguntaId: string) => {
    try {
      const { error } = await supabase
        .from('questionario_perguntas')
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

  const addPergunta = async (secaoId: string, pergunta: Omit<QuestionarioPergunta, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { error } = await supabase
        .from('questionario_perguntas')
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

  const reorderPerguntas = async (perguntasOrdenadas: { id: string; ordem: number }[]) => {
    try {
      const updates = perguntasOrdenadas.map(p => 
        supabase
          .from('questionario_perguntas')
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
  
  return {
    structure: data,
    isLoading: !error && !data,
    error,
    mutate,
    updateSecao,
    updatePergunta,
    deletePergunta,
    addPergunta,
    reorderPerguntas
  }
}
