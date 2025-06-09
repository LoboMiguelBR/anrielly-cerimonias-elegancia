
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Eye, Settings, Save, X } from 'lucide-react'
import { useQuestionarioStructure } from '@/hooks/useQuestionarioStructure'
import QuestionarioStructureEditor from './QuestionarioStructureEditor'
import QuestionarioBasicDataEditor from './QuestionarioBasicDataEditor'
import QuestionarioPreviewEditor from './QuestionarioPreviewEditor'

interface QuestionarioAdvancedEditorProps {
  questionario: any
  onClose: () => void
  onSuccess: () => void
}

const QuestionarioAdvancedEditor = ({ 
  questionario, 
  onClose, 
  onSuccess 
}: QuestionarioAdvancedEditorProps) => {
  const [activeTab, setActiveTab] = useState('dados')
  const { structure, isLoading } = useQuestionarioStructure(questionario.id)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando estrutura...</p>
        </div>
      </div>
    )
  }

  const totalPerguntas = structure?.perguntas.length || 0
  const perguntasAtivas = structure?.perguntas.filter(p => p.ativo).length || 0
  const totalSecoes = structure?.secoes.length || 0

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <h3 className="text-lg font-semibold">Editar Questionário</h3>
          <p className="text-sm text-gray-600">{questionario.nome_evento}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            {totalSecoes} {totalSecoes === 1 ? 'seção' : 'seções'}
          </Badge>
          <Badge variant="outline">
            {perguntasAtivas} de {totalPerguntas} perguntas ativas
          </Badge>
          <Button variant="outline" size="sm" onClick={onClose}>
            <X className="h-4 w-4 mr-1" />
            Fechar
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="mx-4 mt-4">
            <TabsTrigger value="dados">
              <Settings className="h-4 w-4 mr-2" />
              Dados Básicos
            </TabsTrigger>
            <TabsTrigger value="estrutura">
              <Settings className="h-4 w-4 mr-2" />
              Estrutura
            </TabsTrigger>
            <TabsTrigger value="preview">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-hidden">
            <TabsContent value="dados" className="h-full m-4 mt-2">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Informações do Questionário</CardTitle>
                </CardHeader>
                <CardContent>
                  <QuestionarioBasicDataEditor 
                    questionario={questionario}
                    onSuccess={onSuccess}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="estrutura" className="h-full m-4 mt-2">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Seções e Perguntas</CardTitle>
                </CardHeader>
                <CardContent className="h-full p-0">
                  <QuestionarioStructureEditor 
                    questionarioId={questionario.id}
                    structure={structure}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preview" className="h-full m-4 mt-2">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Preview do Questionário</CardTitle>
                </CardHeader>
                <CardContent className="h-full p-0">
                  <QuestionarioPreviewEditor 
                    questionario={questionario}
                    structure={structure}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}

export default QuestionarioAdvancedEditor
