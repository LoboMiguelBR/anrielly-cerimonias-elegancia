
import { useState, useEffect, useRef, useCallback } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { supabase } from '@/integrations/supabase/client'
import { getAllQuestions } from '@/utils/questionarioSections'
import { sendQuestionarioCompletionEmail } from '@/utils/emailUtils'

interface UseQuestionarioFormProps {
  questionario: any
  updateQuestionario: (data: any) => void
  logout?: () => void
}

export const useQuestionarioForm = ({ questionario, updateQuestionario, logout }: UseQuestionarioFormProps) => {
  const { toast } = useToast()
  const [respostas, setRespostas] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>()

  const perguntas = getAllQuestions()

  useEffect(() => {
    if (questionario?.respostasJson) {
      setRespostas(questionario.respostasJson)
    }
  }, [questionario])

  const salvarRespostas = async (finalizar = false, respostasToSave = respostas) => {
    if (!questionario) return

    setIsSaving(true)
    try {
      const { data, error } = await supabase.functions.invoke('questionario-respostas', {
        body: {
          questionarioId: questionario.id,
          respostas: respostasToSave,
          finalizar
        }
      })

      if (error || data.error) {
        throw new Error(data.error || 'Erro ao salvar')
      }

      setLastSaved(new Date())
      updateQuestionario({
        ...questionario,
        respostasJson: respostasToSave,
        status: data.status
      })

      if (finalizar) {
        // Enviar email de finalização
        try {
          await sendQuestionarioCompletionEmail(
            questionario.nomeResponsavel,
            questionario.email,
            questionario.id
          )
        } catch (emailError) {
          console.error('Erro ao enviar email de finalização:', emailError)
        }

        toast({
          title: "🎉 Parabéns!",
          description: "Seu questionário foi enviado com sucesso. Gratidão por compartilhar sua história! Um email de confirmação foi enviado.",
          duration: 5000,
        })

        // Logout automático após 3 segundos
        setTimeout(() => {
          if (logout) {
            logout()
          }
        }, 3000)
      } else {
        toast({
          title: "✓ Respostas salvas!",
          description: `Salvo às ${new Date().toLocaleTimeString()}`,
        })
      }

    } catch (error) {
      console.error('Erro ao salvar:', error)
      toast({
        title: "Erro ao salvar",
        description: "Tente novamente em alguns instantes",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Auto-save implementation with debounce
  const debouncedSave = useCallback(
    (newRespostas: Record<string, string>) => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current)
      }
      
      autoSaveTimeoutRef.current = setTimeout(() => {
        salvarRespostas(false, newRespostas)
      }, 60000) // Auto-save after 60 seconds of inactivity
    },
    []
  )

  const handleRespostaChange = (index: number, valor: string) => {
    const newRespostas = {
      ...respostas,
      [index]: valor
    }
    setRespostas(newRespostas)
    debouncedSave(newRespostas)

    // Auto-scroll to next question if current one is answered
    if (valor.trim().length > 50) {
      setTimeout(() => {
        const nextIndex = index + 1
        if (nextIndex < perguntas.length) {
          const nextElement = document.getElementById(`pergunta-${nextIndex}`)
          if (nextElement) {
            nextElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }
        }
      }, 1000)
    }
  }

  const respostasPreenchidas = Object.values(respostas).filter(r => r && r.trim().length > 0).length
  const progresso = (respostasPreenchidas / perguntas.length) * 100
  const podeEditar = questionario?.status !== 'concluido'
  const canFinalize = respostasPreenchidas >= perguntas.length * 0.8

  return {
    respostas,
    isSaving,
    lastSaved,
    respostasPreenchidas,
    progresso,
    podeEditar,
    canFinalize,
    perguntas,
    handleRespostaChange,
    salvarRespostas
  }
}
