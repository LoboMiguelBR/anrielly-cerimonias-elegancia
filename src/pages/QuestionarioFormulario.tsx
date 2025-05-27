
import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { useToast } from '@/components/ui/use-toast'
import { useQuestionarioAuth } from '@/hooks/useQuestionarioAuth'
import { supabase } from '@/integrations/supabase/client'
import QuestionarioHeader from '@/components/questionario/QuestionarioHeader'
import PerguntaCard from '@/components/questionario/PerguntaCard'
import QuestionarioNavigation from '@/components/questionario/QuestionarioNavigation'
import QuestionarioFooter from '@/components/questionario/QuestionarioFooter'
import { questionarioSections, getAllQuestions, getSectionByQuestionIndex } from '@/utils/questionarioSections'

const QuestionarioFormulario = () => {
  const { linkPublico } = useParams<{ linkPublico: string }>()
  const { toast } = useToast()
  const { isAuthenticated, isLoading, questionario, logout, updateQuestionario } = useQuestionarioAuth(linkPublico || '')

  const [respostas, setRespostas] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [currentSection, setCurrentSection] = useState<string>('casal')
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>()

  const perguntas = getAllQuestions()

  useEffect(() => {
    if (questionario?.respostasJson) {
      setRespostas(questionario.respostasJson)
    }
  }, [questionario])

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

  // Intersection Observer for section detection
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.getAttribute('data-section-id')
            if (sectionId) {
              setCurrentSection(sectionId)
            }
          }
        })
      },
      { threshold: 0.3 }
    )

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to={`/questionario/${linkPublico}`} replace />
  }

  const respostasPreenchidas = Object.values(respostas).filter(r => r && r.trim().length > 0).length
  const progresso = (respostasPreenchidas / perguntas.length) * 100

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
        toast({
          title: "🎉 Parabéns!",
          description: "Seu questionário foi enviado com sucesso. Gratidão por compartilhar sua história!",
          duration: 5000,
        })
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

  const handleNavigateToSection = (sectionId: string) => {
    const ref = sectionRefs.current[sectionId]
    if (ref) {
      ref.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const podeEditar = questionario?.status !== 'concluido'
  const canFinalize = respostasPreenchidas >= perguntas.length * 0.8

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100">
      <QuestionarioHeader
        nomeResponsavel={questionario?.nomeResponsavel || ''}
        progresso={progresso}
        respostasPreenchidas={respostasPreenchidas}
        totalPerguntas={perguntas.length}
        lastSaved={lastSaved}
        onLogout={logout}
        isFinalized={questionario?.status === 'concluido'}
      />

      <div className="container mx-auto px-4 max-w-6xl py-8">
        <div className="flex gap-8">
          {/* Navigation Sidebar */}
          <div className="hidden lg:block w-80 sticky top-32 h-fit">
            <QuestionarioNavigation
              respostas={respostas}
              onNavigateToSection={handleNavigateToSection}
              currentSection={currentSection}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-8">
            {questionarioSections.map((section, sectionIndex) => (
              <div
                key={section.id}
                ref={(el) => (sectionRefs.current[section.id] = el)}
                data-section-id={section.id}
                className="space-y-6"
              >
                <div className="text-center py-6">
                  <h2 className="text-2xl md:text-3xl font-bold font-playfair text-gray-800 mb-2">
                    {section.title}
                  </h2>
                  <div className="w-24 h-1 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full mx-auto"></div>
                </div>

                <div className="space-y-6">
                  {section.questions.map((pergunta, questionIndex) => {
                    const globalIndex = section.range[0] + questionIndex
                    return (
                      <div key={globalIndex} id={`pergunta-${globalIndex}`}>
                        <PerguntaCard
                          pergunta={pergunta}
                          index={globalIndex}
                          valor={respostas[globalIndex] || ''}
                          onChange={(valor) => handleRespostaChange(globalIndex, valor)}
                          disabled={!podeEditar}
                          isEven={globalIndex % 2 === 0}
                        />
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <QuestionarioFooter
        isSaving={isSaving}
        canFinalize={canFinalize}
        podeEditar={podeEditar}
        onSave={() => salvarRespostas(false)}
        onFinalize={() => salvarRespostas(true)}
      />
    </div>
  )
}

export default QuestionarioFormulario
