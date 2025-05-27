
import { useState } from 'react'
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } from 'docx'
import { useToast } from '@/hooks/use-toast'
import { getAllQuestions } from '@/utils/questionarioSections'

export const useQuestionarioWordExport = () => {
  const [isExporting, setIsExporting] = useState(false)
  const { toast } = useToast()

  const exportQuestionario = async (questionario: any) => {
    setIsExporting(true)
    try {
      console.log('Iniciando exportação Word...')
      
      const perguntas = getAllQuestions()
      const respostas = questionario.respostas_json || {}
      
      // Criar o documento Word
      const doc = new Document({
        sections: [{
          properties: {},
          headers: {
            default: new Paragraph({
              children: [
                new TextRun({
                  text: "Questionário de Celebração do Amor",
                  bold: true,
                  size: 48, // 24px equivalent
                  color: "d9534f",
                  font: "Playfair Display"
                })
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 }
            })
          },
          children: [
            // Título principal
            new Paragraph({
              children: [
                new TextRun({
                  text: "Questionário de Celebração do Amor",
                  bold: true,
                  size: 48, // 24px equivalent
                  color: "d9534f",
                  font: "Playfair Display"
                })
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 200 }
            }),
            
            // Subtítulo
            new Paragraph({
              children: [
                new TextRun({
                  text: `Preenchido por ${questionario.nome_responsavel}`,
                  size: 32, // 16px equivalent
                  color: "555555",
                  font: "Arial"
                })
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 600 }
            }),
            
            // Gerar perguntas e respostas
            ...perguntas.flatMap((pergunta, index) => {
              const resposta = respostas[index] || "Resposta não informada"
              
              return [
                // Pergunta
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `${index + 1}. ${pergunta}`,
                      bold: true,
                      size: 28, // 14px equivalent
                      color: "333333",
                      font: "Arial"
                    })
                  ],
                  spacing: { before: 200, after: 100 }
                }),
                
                // Resposta
                new Paragraph({
                  children: [
                    new TextRun({
                      text: resposta,
                      size: 26, // 13px equivalent
                      color: "555555",
                      font: "Arial"
                    })
                  ],
                  spacing: { after: 200 }
                }),
                
                // Linha separadora
                new Paragraph({
                  children: [
                    new TextRun({
                      text: "________________________________________________________________________________________",
                      color: "d9534f",
                      size: 16
                    })
                  ],
                  alignment: AlignmentType.CENTER,
                  spacing: { after: 300 }
                })
              ]
            }),
            
            // Rodapé
            new Paragraph({
              children: [
                new TextRun({
                  text: "Documento gerado automaticamente pelo sistema Anrielly Gomes Cerimonialista.",
                  size: 20, // 10px equivalent
                  color: "999999",
                  font: "Arial"
                })
              ],
              alignment: AlignmentType.CENTER,
              spacing: { before: 600 }
            })
          ]
        }]
      })

      // Gerar o arquivo
      const buffer = await Packer.toBuffer(doc)
      
      // Criar nome do arquivo
      const nomeFormatado = questionario.nome_responsavel
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
      
      const dataAtual = new Date().toISOString().split('T')[0]
      const nomeArquivo = `questionario-${nomeFormatado}-${dataAtual}.docx`
      
      // Fazer download
      const blob = new Blob([buffer], { 
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
      })
      
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = nomeArquivo
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast({
        title: "Exportação realizada com sucesso!",
        description: `Arquivo ${nomeArquivo} baixado`,
      })

    } catch (error) {
      console.error('Erro na exportação Word:', error)
      toast({
        title: "Erro na exportação",
        description: error instanceof Error ? error.message : "Não foi possível exportar o questionário",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  return {
    exportQuestionario,
    isExporting
  }
}
