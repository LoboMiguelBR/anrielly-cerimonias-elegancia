
import { Button } from "@/components/ui/button"
import { Save, Send } from 'lucide-react'
import { useMobileLayout } from '@/hooks/useMobileLayout'

interface QuestionarioFooterProps {
  isSaving: boolean
  canFinalize: boolean
  podeEditar: boolean
  onSave: () => void
  onFinalize: () => void
}

const QuestionarioFooter = ({
  isSaving,
  canFinalize,
  podeEditar,
  onSave,
  onFinalize
}: QuestionarioFooterProps) => {
  const { isMobile } = useMobileLayout()

  if (!podeEditar) return null

  return (
    <div className="sticky bottom-0 bg-white border-t shadow-lg rounded-t-2xl mt-8 z-40">
      <div className="container mx-auto max-w-4xl p-4">
        <div className={`flex gap-3 lg:gap-4 ${isMobile ? 'flex-col' : 'justify-end'}`}>
          <Button
            variant="outline"
            onClick={onSave}
            disabled={isSaving}
            className={`border-rose-200 text-rose-600 hover:bg-rose-50 ${
              isMobile ? 'w-full h-12' : ''
            }`}
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Salvando...' : 'Salvar'}
          </Button>
          
          <Button
            onClick={onFinalize}
            disabled={isSaving || !canFinalize}
            className={`bg-rose-500 hover:bg-rose-600 text-white ${
              isMobile ? 'w-full h-12' : ''
            }`}
          >
            <Send className="w-4 h-4 mr-2" />
            Finalizar e Enviar
          </Button>
        </div>
        
        {!canFinalize && (
          <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500 mt-2 text-center`}>
            Complete pelo menos 80% das perguntas para finalizar
          </p>
        )}
      </div>
    </div>
  )
}

export default QuestionarioFooter
