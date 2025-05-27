
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { LogOut } from 'lucide-react'

interface QuestionarioHeaderProps {
  nomeResponsavel: string
  progresso: number
  respostasPreenchidas: number
  totalPerguntas: number
  lastSaved?: Date | null
  onLogout: () => void
  isFinalized?: boolean
}

const QuestionarioHeader = ({
  nomeResponsavel,
  progresso,
  respostasPreenchidas,
  totalPerguntas,
  lastSaved,
  onLogout,
  isFinalized
}: QuestionarioHeaderProps) => {
  return (
    <div className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="container mx-auto px-4 max-w-4xl py-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <img 
              src="/LogoAG_192x192.png" 
              alt="Anrielly Gomes Cerimonialista" 
              className="w-12 h-12"
            />
            <div>
              <h1 className="text-2xl md:text-4xl font-bold font-playfair text-gray-800">
                Questionário de Noivos
              </h1>
              <p className="text-gray-600">
                Olá, <span className="font-semibold text-rose-600">{nomeResponsavel}</span>!
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={onLogout} className="border-rose-200 text-rose-600 hover:bg-rose-50">
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Progresso: {respostasPreenchidas} de {totalPerguntas} perguntas</span>
            <span className="font-medium">{Math.round(progresso)}%</span>
          </div>
          
          <Progress 
            value={progresso} 
            className={`h-3 transition-all duration-500 ${
              progresso <= 40 ? '[&>div]:bg-red-400' :
              progresso <= 70 ? '[&>div]:bg-yellow-400' :
              '[&>div]:bg-green-500'
            }`}
          />

          {lastSaved && (
            <p className="text-sm text-green-600 flex items-center">
              ✓ Última atualização: {lastSaved.toLocaleTimeString()}
            </p>
          )}

          {isFinalized && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-green-800 font-medium text-sm">
                🎉 Questionário finalizado e enviado com sucesso!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default QuestionarioHeader
