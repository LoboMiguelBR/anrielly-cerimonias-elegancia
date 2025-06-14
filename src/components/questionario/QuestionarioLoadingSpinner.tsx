
import { Loader2 } from 'lucide-react'

interface QuestionarioLoadingSpinnerProps {
  message?: string
}

const QuestionarioLoadingSpinner = ({ message = "Carregando..." }: QuestionarioLoadingSpinnerProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-100">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin text-rose-500 mx-auto mb-4" />
        <p className="text-gray-600 text-lg font-medium">{message}</p>
      </div>
    </div>
  )
}

export default QuestionarioLoadingSpinner
