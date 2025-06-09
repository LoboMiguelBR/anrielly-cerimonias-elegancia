
import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { supabase } from '@/integrations/supabase/client'
import { Save } from 'lucide-react'

const perguntas = [
  "Como se conheceram?",
  "Foi atração imediata?",
  "Há quanto tempo estão juntos? (namoro, noivado, morando juntos...)",
  "O que mais chamou sua atenção nele(a) quando se conheceram?",
  "O que te fez escolher ele(a) entre tantas pessoas no mundo?",
  "Sobre a admiração que sente por ele(a):",
  "Quais os maiores desafios que já enfrentaram (se houver)?",
  "Quais as maiores alegrias até hoje?",
  "Momento inesquecível do início do namoro:",
  "Melhor surpresa que já fez e a que recebeu:",
  "A declaração de amor inesquecível (com data e local):",
  "Qual o papel de Deus na relação de vocês?",
  "Praticam alguma religião?",
  "Como é sua convivência com sua família?",
  "E com a família dele(a)?",
  "Seus pais estão vivos e casados?",
  "Alguma viagem inesquecível? Qual e por quê?",
  "O que significa casamento para você?",
  "O que significa formar uma família?",
  "O que vocês mais gostam de fazer juntos?",
  "O que a pandemia mudou na vida ou nos planos de vocês?",
  "Ele(a) te colocou algum apelido? Qual?",
  "Quem é o mais amoroso?",
  "Como é seu jeito de ser?",
  "Como é o jeito de ser dele(a)?",
  "Possuem algum animal de estimação? Qual?",
  "Vocês se consideram parecidos? De que maneira?",
  "Como você enxerga vocês enquanto casal?",
  "Você prefere praia ou montanha?",
  "Qual música marcou a relação de vocês?",
  "O que mais deseja em sua cerimônia?",
  "Sua cor preferida:",
  "Você cozinha? Se sim, o que ele(a) mais gosta que você faça?",
  "Alguma mania dele(a) que te tira do sério?",
  "E aquele jeitinho dele(a) que te mantém apaixonado(a) até hoje...",
  "As principais qualidades dele(a):",
  "Quais sonhos vocês sonham juntos?",
  "Sobre sentir saudade dele(a):",
  "Quem é o primeiro a estender a mão após uma discussão?",
  "Qual seu pedido para o futuro?",
  "Desejam ter filhos ou já têm? (Se sim, quantos e nomes)",
  "Pretendem se casar no civil? Quando?",
  "Quantos casais de padrinhos terão no total?",
  "Quem levará as alianças? (Nome, idade e parentesco)",
  "Desejam alguma entrada diferente (Bíblia, Espírito Santo, etc)?",
  "Já escolheram as músicas da cerimônia? Quais?",
  "Algum detalhe, curiosidade ou fato importante sobre o relacionamento?",
  "Algo que vocês não querem de jeito nenhum na cerimônia?"
]

interface QuestionarioEditModalProps {
  open: boolean
  onClose: () => void
  questionario: {
    id: string
    nome_responsavel: string
    respostas_json: Record<string, string> | null
  } | null
  onSave: () => void
}

const QuestionarioEditModal = ({ 
  open, 
  onClose, 
  questionario, 
  onSave 
}: QuestionarioEditModalProps) => {
  const [respostas, setRespostas] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (questionario?.respostas_json) {
      setRespostas(questionario.respostas_json)
    } else {
      setRespostas({})
    }
  }, [questionario])

  const handleSave = async () => {
    if (!questionario) return

    setIsSaving(true)
    try {
      const { error } = await supabase
        .from('questionarios_noivos')
        .update({ 
          respostas_json: respostas,
          data_atualizacao: new Date().toISOString()
        })
        .eq('id', questionario.id)

      if (error) throw error

      toast({
        title: "Respostas salvas!",
        description: "As alterações foram salvas com sucesso.",
      })

      onSave()
      onClose()
    } catch (error) {
      console.error('Erro ao salvar:', error)
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as alterações.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleRespostaChange = (index: number, valor: string) => {
    setRespostas(prev => ({
      ...prev,
      [index]: valor
    }))
  }

  if (!questionario) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Editando Respostas - {questionario.nome_responsavel}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {perguntas.map((pergunta, index) => (
            <div key={index} className="space-y-2">
              <Label className="text-sm font-medium">
                {index + 1}. {pergunta}
              </Label>
              <Textarea
                value={respostas[index] || ''}
                onChange={(e) => handleRespostaChange(index, e.target.value)}
                placeholder="Digite a resposta aqui..."
                className="min-h-[80px] resize-y"
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default QuestionarioEditModal
