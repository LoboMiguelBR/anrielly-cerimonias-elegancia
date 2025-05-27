import { useState, useEffect } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { useQuestionarioAuth } from '@/hooks/useQuestionarioAuth'
import { supabase } from '@/integrations/supabase/client'
import { LogOut, Save, Send } from 'lucide-react'

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

const QuestionarioFormulario = () => {
  const { linkPublico } = useParams<{ linkPublico: string }>()
  const { toast } = useToast()
  const { isAuthenticated, isLoading, questionario, logout, updateQuestionario } = useQuestionarioAuth(linkPublico || '')

  const [respostas, setRespostas] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  useEffect(() => {
    if (questionario?.respostasJson) {
      setRespostas(questionario.respostasJson)
    }
  }, [questionario])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to={`/questionario/${linkPublico}`} replace />
  }

  const respostasPreenchidas = Object.values(respostas).filter(r => r && r.trim().length > 0).length
  const progresso = (respostasPreenchidas / perguntas.length) * 100

  const handleRespostaChange = (index: number, valor: string) => {
    setRespostas(prev => ({
      ...prev,
      [index]: valor
    }))
  }

  const salvarRespostas = async (finalizar = false) => {
    if (!questionario) return

    setIsSaving(true)
    try {
      const { data, error } = await supabase.functions.invoke('questionario-respostas', {
        body: {
          questionarioId: questionario.id,
          respostas,
          finalizar
        }
      })

      if (error || data.error) {
        throw new Error(data.error || 'Erro ao salvar')
      }

      setLastSaved(new Date())
      updateQuestionario({
        ...questionario,
        respostasJson: respostas,
        status: data.status
      })

      toast({
        title: finalizar ? "Questionário finalizado!" : "Respostas salvas!",
        description: data.message,
      })

    } catch (error) {
      console.error('Erro ao salvar:', error)
      toast({
        title: "Erro ao salvar",
        description: "Tente novamente em alguns instantes",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const podeEditar = questionario?.status !== 'concluido'

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header com Logo */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-4">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              <img 
                src="/LogoAG_192x192.png" 
                alt="Anrielly Gomes Cerimonialista" 
                className="w-12 h-12"
              />
              <div>
                <h1 className="text-2xl md:text-3xl font-playfair text-gray-800">Questionário de Noivos</h1>
                <p className="text-gray-600">Olá, {questionario?.nomeResponsavel}!</p>
              </div>
            </div>
            <Button variant="outline" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Progresso: {respostasPreenchidas} de {perguntas.length} perguntas</span>
              <span>{Math.round(progresso)}%</span>
            </div>
            <Progress value={progresso} className="h-2" />
          </div>

          {lastSaved && (
            <p className="text-sm text-green-600 mt-2">
              Última atualização: {lastSaved.toLocaleTimeString()}
            </p>
          )}

          {questionario?.status === 'concluido' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
              <p className="text-green-800 font-medium">
                ✅ Questionário finalizado e enviado com sucesso!
              </p>
            </div>
          )}
        </div>

        {/* Formulário */}
        <div className="space-y-6">
          {perguntas.map((pergunta, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium text-gray-800">
                  {index + 1}. {pergunta}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={respostas[index] || ''}
                  onChange={(e) => handleRespostaChange(index, e.target.value)}
                  placeholder="Digite sua resposta aqui..."
                  className="min-h-[100px] resize-y"
                  disabled={!podeEditar}
                />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Botões de ação */}
        {podeEditar && (
          <div className="sticky bottom-0 bg-white border-t shadow-lg p-4 mt-8">
            <div className="container mx-auto max-w-4xl flex gap-4 justify-end">
              <Button
                variant="outline"
                onClick={() => salvarRespostas(false)}
                disabled={isSaving}
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Salvando...' : 'Salvar'}
              </Button>
              
              <Button
                onClick={() => salvarRespostas(true)}
                disabled={isSaving || respostasPreenchidas < perguntas.length * 0.8}
              >
                <Send className="w-4 h-4 mr-2" />
                Finalizar e Enviar
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default QuestionarioFormulario
