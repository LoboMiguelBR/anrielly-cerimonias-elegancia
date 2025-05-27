
import { useParams, Navigate } from 'react-router-dom'
import { useQuestionarioAuth } from '@/hooks/useQuestionarioAuth'
import { useQuestionarioForm } from '@/hooks/useQuestionarioForm'
import QuestionarioContainer from '@/components/questionario/QuestionarioContainer'

const QuestionarioFormulario = () => {
  const { linkPublico } = useParams<{ linkPublico: string }>()
  const { isAuthenticated, isLoading, questionario, logout, updateQuestionario } = useQuestionarioAuth(linkPublico || '')

  const {
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
  } = useQuestionarioForm({ questionario, updateQuestionario })

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

  return (
    <QuestionarioContainer
      questionario={questionario}
      respostas={respostas}
      isSaving={isSaving}
      lastSaved={lastSaved}
      respostasPreenchidas={respostasPreenchidas}
      totalPerguntas={perguntas.length}
      progresso={progresso}
      podeEditar={podeEditar}
      canFinalize={canFinalize}
      onRespostaChange={handleRespostaChange}
      onSave={() => salvarRespostas(false)}
      onFinalize={() => salvarRespostas(true)}
      onLogout={logout}
    />
  )
}

export default QuestionarioFormulario
