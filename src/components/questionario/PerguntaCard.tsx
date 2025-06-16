
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { CheckCircle } from 'lucide-react'
import { useMobileLayout } from '@/hooks/useMobileLayout'

interface PerguntaCardProps {
  pergunta: string
  perguntaId: string
  ordem: number
  valor: string
  onChange: (valor: string) => void
  disabled?: boolean
  isEven?: boolean
}

const PerguntaCard = ({
  pergunta,
  perguntaId,
  ordem,
  valor,
  onChange,
  disabled = false,
  isEven = false
}: PerguntaCardProps) => {
  const [wordCount, setWordCount] = useState(0)
  const { isMobile } = useMobileLayout()
  const isAnswered = valor && valor.trim().length > 0

  useEffect(() => {
    const words = valor.trim().split(/\s+/).filter(word => word.length > 0)
    setWordCount(words.length)
  }, [valor])

  const placeholders = [
    "Conte aqui sua história...",
    "Compartilhe sua resposta...",
    "Descreva sua experiência...",
    "Fale sobre isso...",
    "Nos conte mais detalhes..."
  ]

  const placeholder = placeholders[ordem % placeholders.length]

  return (
    <Card 
      className={`hover:shadow-md transition-all duration-300 ${
        isMobile ? 'rounded-xl' : 'rounded-2xl'
      } border-l-4 animate-fade-in ${
        isEven ? 'bg-neutral-50 border-l-rose-200' : 'bg-white border-l-pink-200'
      } ${isAnswered ? 'border-l-green-400' : ''}`}
    >
      <CardHeader className={`pb-3 relative ${isMobile ? 'p-4' : ''}`}>
        <div className="flex justify-between items-start">
          <CardTitle className={`${
            isMobile ? 'text-base' : 'text-lg md:text-xl'
          } font-medium text-gray-800 pr-4`}>
            {ordem}. {pergunta}
          </CardTitle>
          {isAnswered && (
            <Badge variant="default" className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1 flex-shrink-0">
              <CheckCircle className="w-3 h-3" />
              <span className={isMobile ? 'text-xs' : ''}>
                {isMobile ? '✓' : 'Respondida'}
              </span>
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className={`space-y-2 ${isMobile ? 'p-4 pt-0' : ''}`}>
        <Textarea
          value={valor}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`${
            isMobile ? 'min-h-[150px] text-base' : 'min-h-[120px]'
          } resize-y border-gray-200 focus:border-rose-300 focus:ring-rose-200 touch-manipulation`}
          disabled={disabled}
        />
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>{wordCount} palavras</span>
          <span className="text-gray-400">Opcional</span>
        </div>
      </CardContent>
    </Card>
  )
}

export default PerguntaCard
