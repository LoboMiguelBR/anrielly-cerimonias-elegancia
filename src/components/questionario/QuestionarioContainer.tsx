
import QuestionarioHeader from './QuestionarioHeader'
import QuestionarioTabs from './QuestionarioTabs'
import QuestionarioContent from './QuestionarioContent'
import QuestionarioFooter from './QuestionarioFooter'
import { useMobileLayout } from '@/hooks/useMobileLayout'

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
  const { isMobile } = useMobileLayout()

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100">
      <QuestionarioHeader
        nomeResponsavel={questionario?.nomeResponsavel || ''}
        progresso={progresso}
        respostasPreenchidas={respostasPreenchidas}
        totalPerguntas={totalPerguntas}
        lastSaved={lastSaved}
        onLogout={onLogout}
        isFinalized={questionario?.status === 'preenchido'}
      />

      <div className={`py-4 lg:py-8 ${isMobile ? 'pb-24' : ''}`}>
        <QuestionarioTabs
          respostas={respostas}
          podeEditar={podeEditar}
          onRespostaChange={onRespostaChange}
        >
          {(sectionId, section) => (
            <QuestionarioContent
              respostas={respostas}
              podeEditar={podeEditar}
              onRespostaChange={onRespostaChange}
              sectionId={sectionId}
              section={section}
            />
          )}
        </QuestionarioTabs>
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
