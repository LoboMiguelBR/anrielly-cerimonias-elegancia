
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { CheckCircle2, Circle } from 'lucide-react'

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

interface QuestionarioTabsProps {
  secoes: SecaoType[];
  respostas: Record<string, string>
  podeEditar: boolean
  onRespostaChange: (index: string, valor: string) => void
  children: (sectionId: string, section: SecaoType) => React.ReactNode
}

const QuestionarioTabs = ({
  secoes,
  respostas,
  podeEditar,
  onRespostaChange,
  children
}: QuestionarioTabsProps) => {

  const getSectionProgress = (section: SecaoType) => {
    const total = section.perguntas.length;
    const answered = section.perguntas.filter((q) => {
      const val = respostas[q.id] || '';
      return val.trim().length > 0;
    }).length;
    return { answered, total };
  };

  return (
    <Tabs defaultValue={secoes[0]?.id} className="w-full">
      <div className="sticky top-20 z-40 bg-gradient-to-r from-rose-50 to-pink-50 border-b border-rose-200 mb-6">
        <div className="container mx-auto px-4">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto p-2 bg-white/80 backdrop-blur-sm shadow-lg rounded-lg">
            {secoes.map((section) => {
              const progress = getSectionProgress(section);
              const isCompleted = progress.answered === progress.total;
              return (
                <TabsTrigger
                  key={section.id}
                  value={section.id}
                  className="flex flex-col items-center gap-2 p-4 text-xs md:text-sm data-[state=active]:bg-rose-100 data-[state=active]:text-rose-800 transition-all duration-200"
                >
                  <div className="flex items-center gap-2">
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    ) : (
                      <Circle className="w-4 h-4 text-gray-400" />
                    )}
                    <span className="font-medium">{section.titulo}</span>
                  </div>
                  <div className="text-xs text-gray-600">
                    {progress.answered}/{progress.total}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-gradient-to-r from-rose-400 to-pink-400 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${(progress.answered / progress.total) * 100}%` }}
                    />
                  </div>
                </TabsTrigger>
              )
            })}
          </TabsList>
        </div>
      </div>
      <div className="container mx-auto px-4">
        {secoes.map((section) => (
          <TabsContent key={section.id} value={section.id} className="space-y-6 mt-0">
            {children(section.id, section)}
          </TabsContent>
        ))}
      </div>
    </Tabs>
  )
}

export default QuestionarioTabs
