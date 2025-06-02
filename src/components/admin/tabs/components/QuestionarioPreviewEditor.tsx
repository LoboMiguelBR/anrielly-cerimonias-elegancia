
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface QuestionarioPreviewEditorProps {
  questionario: any
  structure: any
}

const QuestionarioPreviewEditor = ({ questionario, structure }: QuestionarioPreviewEditorProps) => {
  if (!structure) return null

  const renderPerguntaInput = (pergunta: any) => {
    const commonProps = {
      placeholder: pergunta.placeholder || '',
      disabled: true,
      className: "bg-gray-50"
    }

    switch (pergunta.tipo_resposta) {
      case 'texto_curto':
        return <Input {...commonProps} />
      case 'texto_longo':
        return <Textarea {...commonProps} rows={3} />
      case 'numero':
        return <Input {...commonProps} type="number" />
      case 'data':
        return <Input {...commonProps} type="date" />
      case 'email':
        return <Input {...commonProps} type="email" />
      case 'telefone':
        return <Input {...commonProps} type="tel" />
      default:
        return <Textarea {...commonProps} rows={3} />
    }
  }

  return (
    <div className="h-full">
      <ScrollArea className="h-full p-4">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header do Preview */}
          <div className="text-center py-6 border-b">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              {questionario.nome_evento || 'Questionário'}
            </h1>
            <p className="text-gray-600">
              Responsável: {questionario.nome_responsavel}
            </p>
            <div className="flex justify-center gap-2 mt-2">
              <Badge variant="outline">{questionario.tipo_evento}</Badge>
              <Badge variant={questionario.status === 'ativo' ? 'default' : 'secondary'}>
                {questionario.status}
              </Badge>
            </div>
          </div>

          {/* Seções e Perguntas */}
          {structure.secoes
            .filter((secao: any) => secao.ativo)
            .sort((a: any, b: any) => a.ordem - b.ordem)
            .map((secao: any) => {
              const perguntasSecao = structure.perguntas
                .filter((p: any) => p.secao_id === secao.id && p.ativo)
                .sort((a: any, b: any) => a.ordem - b.ordem)

              if (perguntasSecao.length === 0) return null

              return (
                <Card key={secao.id} className="shadow-sm">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                    <CardTitle className="text-xl text-gray-800">
                      {secao.titulo}
                    </CardTitle>
                    {secao.descricao && (
                      <p className="text-gray-600 text-sm">{secao.descricao}</p>
                    )}
                  </CardHeader>
                  
                  <CardContent className="space-y-6 p-6">
                    {perguntasSecao.map((pergunta: any, index: number) => (
                      <div key={pergunta.id} className="space-y-2">
                        <Label className="text-base font-medium text-gray-700">
                          {index + 1}. {pergunta.texto}
                          {pergunta.obrigatoria && (
                            <span className="text-red-500 ml-1">*</span>
                          )}
                        </Label>
                        {renderPerguntaInput(pergunta)}
                        {pergunta.obrigatoria && (
                          <p className="text-xs text-gray-500">
                            Campo obrigatório
                          </p>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )
            })}

          {/* Footer do Preview */}
          <div className="text-center py-6 border-t">
            <p className="text-sm text-gray-500">
              Preview do questionário • {structure.perguntas.filter((p: any) => p.ativo).length} perguntas ativas
            </p>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}

export default QuestionarioPreviewEditor
