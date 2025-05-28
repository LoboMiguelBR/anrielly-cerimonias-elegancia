
import PerguntaCard from './PerguntaCard'
import { questionarioSections } from '@/utils/questionarioSections'

interface QuestionarioContentProps {
  respostas: Record<string, string>
  podeEditar: boolean
  onRespostaChange: (index: number, valor: string) => void
  sectionId?: string
  section?: any
}

const QuestionarioContent = ({
  respostas,
  podeEditar,
  onRespostaChange,
  sectionId,
  section
}: QuestionarioContentProps) => {
  
  // Se não há seção específica, renderizar todas (modo legado)
  if (!section) {
    return (
      <div className="flex-1 space-y-8">
        {questionarioSections.map((currentSection, sectionIndex) => (
          <div key={currentSection.id} className="space-y-6">
            <div className="text-center py-6">
              <h2 className="text-2xl md:text-3xl font-bold font-playfair text-gray-800 mb-2">
                {currentSection.title}
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full mx-auto"></div>
            </div>

            <div className="space-y-6">
              {currentSection.questions.map((pergunta, questionIndex) => {
                const globalIndex = currentSection.range[0] + questionIndex
                return (
                  <div key={globalIndex} id={`pergunta-${globalIndex}`}>
                    <PerguntaCard
                      pergunta={pergunta}
                      index={globalIndex}
                      valor={respostas[globalIndex] || ''}
                      onChange={(valor) => onRespostaChange(globalIndex, valor)}
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
    )
  }

  // Renderizar seção específica
  return (
    <div className="space-y-6">
      <div className="text-center py-6">
        <h2 className="text-2xl md:text-3xl font-bold font-playfair text-gray-800 mb-2">
          {section.title}
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full mx-auto"></div>
        <p className="text-gray-600 mt-4">
          Seção {questionarioSections.findIndex(s => s.id === sectionId) + 1} de {questionarioSections.length}
        </p>
      </div>

      <div className="space-y-6">
        {section.questions.map((pergunta: string, questionIndex: number) => {
          const globalIndex = section.range[0] + questionIndex
          return (
            <div key={globalIndex} id={`pergunta-${globalIndex}`}>
              <PerguntaCard
                pergunta={pergunta}
                index={globalIndex}
                valor={respostas[globalIndex] || ''}
                onChange={(valor) => onRespostaChange(globalIndex, valor)}
                disabled={!podeEditar}
                isEven={globalIndex % 2 === 0}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default QuestionarioContent
