
import QuestionarioHeader from './QuestionarioHeader'
import QuestionarioSidebar from './QuestionarioSidebar'
import QuestionarioContent from './QuestionarioContent'
import QuestionarioFooter from './QuestionarioFooter'
import { useQuestionarioSections } from '@/hooks/useQuestionarioSections'

interface QuestionarioContainerProps {
  questionario: any
  respostas: Record<string, string>
  isSaving: boolean
  lastSaved: Date | null
  respostasPreenchidas: number
  totalPerguntas: number
  progresso: number
  podeEditar: boolean
  canFinalize: boolean
  onRespostaChange: (index: number, valor: string) => void
  onSave: () => void
  onFinalize: () => void
  onLogout: () => void
}

const QuestionarioContainer = ({
  questionario,
  respostas,
  isSaving,
  lastSaved,
  respostasPreenchidas,
  totalPerguntas,
  progresso,
  podeEditar,
  canFinalize,
  onRespostaChange,
  onSave,
  onFinalize,
  onLogout
}: QuestionarioContainerProps) => {
  const { currentSection, sectionRefs, handleNavigateToSection } = useQuestionarioSections()

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100">
      <QuestionarioHeader
        nomeResponsavel={questionario?.nomeResponsavel || ''}
        progresso={progresso}
        respostasPreenchidas={respostasPreenchidas}
        totalPerguntas={totalPerguntas}
        lastSaved={lastSaved}
        onLogout={onLogout}
        isFinalized={questionario?.status === 'concluido'}
      />

      <div className="container mx-auto px-4 max-w-6xl py-8">
        <div className="flex gap-8">
          <QuestionarioSidebar
            respostas={respostas}
            onNavigateToSection={handleNavigateToSection}
            currentSection={currentSection}
          />

          <QuestionarioContent
            respostas={respostas}
            podeEditar={podeEditar}
            sectionRefs={sectionRefs}
            onRespostaChange={onRespostaChange}
          />
        </div>
      </div>

      <QuestionarioFooter
        isSaving={isSaving}
        canFinalize={canFinalize}
        podeEditar={podeEditar}
        onSave={onSave}
        onFinalize={onFinalize}
      />
    </div>
  )
}

export default QuestionarioContainer
