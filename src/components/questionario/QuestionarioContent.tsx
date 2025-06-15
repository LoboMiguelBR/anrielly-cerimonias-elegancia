
import PerguntaCard from './PerguntaCard'

interface SecaoType {
  id: string;
  titulo: string;
  descricao?: string;
  ordem: number;
  perguntas: {
    id: string;
    texto: string;
    ordem: number;
    tipo_resposta: string;
    obrigatoria?: boolean;
    placeholder?: string;
    opcoes_resposta?: any;
  }[];
}

interface QuestionarioContentProps {
  secaoId: string;
  secao: SecaoType;
  respostas: Record<string, string>
  podeEditar: boolean
  onRespostaChange: (index: string, valor: string) => void
}

const QuestionarioContent = ({
  secaoId,
  secao,
  respostas,
  podeEditar,
  onRespostaChange,
}: QuestionarioContentProps) => {

  return (
    <div className="space-y-6">
      <div className="text-center py-6">
        <h2 className="text-2xl md:text-3xl font-bold font-playfair text-gray-800 mb-2">
          {secao.titulo}
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full mx-auto"></div>
        {secao.descricao && (
          <p className="text-gray-600 mt-4">{secao.descricao}</p>
        )}
      </div>

      <div className="space-y-6">
        {secao.perguntas.map((pergunta, idx) => (
          <div key={pergunta.id} id={`pergunta-${pergunta.id}`}>
            <PerguntaCard
              pergunta={pergunta.texto}
              index={pergunta.id}
              valor={respostas[pergunta.id] || ''}
              onChange={(valor) => onRespostaChange(pergunta.id, valor)}
              disabled={!podeEditar}
              isEven={idx % 2 === 0}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default QuestionarioContent
