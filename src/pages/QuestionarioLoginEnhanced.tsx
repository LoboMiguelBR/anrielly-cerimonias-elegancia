
import { useParams, Navigate } from 'react-router-dom'
import { useQuestionarioAuth } from '@/hooks/useQuestionarioAuth'
import QuestionarioSecurityCard from '@/components/questionario/QuestionarioSecurityCard'
import QuestionarioAuthFormsEnhanced from '@/components/questionario/QuestionarioAuthFormsEnhanced'
import QuestionarioWelcomeCard from '@/components/questionario/QuestionarioWelcomeCard'
import QuestionarioLoadingSpinner from '@/components/questionario/QuestionarioLoadingSpinner'

const QuestionarioLoginEnhanced = () => {
  const { linkPublico } = useParams<{ linkPublico: string }>()
  const { isAuthenticated, isLoading } = useQuestionarioAuth(linkPublico || '')

  if (!linkPublico) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Link Inválido</h1>
          <p className="text-gray-600">O link do questionário não é válido.</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return <QuestionarioLoadingSpinner message="Verificando acesso..." />
  }

  if (isAuthenticated) {
    return <Navigate to={`/questionario/${linkPublico}/formulario`} replace />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-100 flex items-center justify-center p-4">
      <div className="w-full max-w-[420px] space-y-6 animate-fadeIn">
        {/* Logo */}
        <div className="text-center">
          <img 
            src="/LogoAG_192x192.png" 
            alt="Anrielly Gomes Cerimonialista" 
            className="w-20 h-20 mx-auto mb-4 transition-transform hover:scale-105"
          />
          <h1 className="text-3xl font-playfair font-bold text-gray-800 mb-2">
            Anrielly Gomes Cerimonialista
          </h1>
        </div>

        {/* Card de Cadastro Essencial */}
        <QuestionarioSecurityCard />

        {/* Formulários de Login/Cadastro */}
        <QuestionarioAuthFormsEnhanced linkPublico={linkPublico} />

        {/* Mensagem de Boas-vindas */}
        <QuestionarioWelcomeCard />
      </div>
    </div>
  )
}

export default QuestionarioLoginEnhanced
