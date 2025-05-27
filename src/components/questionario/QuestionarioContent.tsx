
import PerguntaCard from './PerguntaCard'
import { questionarioSections } from '@/utils/questionarioSections'

interface QuestionarioContentProps {
  respostas: Record<string, string>
  podeEditar: boolean
  sectionRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>
  onRespostaChange: (index: number, valor: string) => void
}

const QuestionarioContent = ({
  respostas,
  podeEditar,
  sectionRefs,
  onRespostaChange
}: QuestionarioContentProps) => {
  return (
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

export default QuestionarioContent
