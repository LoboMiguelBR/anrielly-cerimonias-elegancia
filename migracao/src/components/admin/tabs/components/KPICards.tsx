
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, CheckCircle2, Clock, AlertCircle, TrendingUp } from 'lucide-react'

interface KPICardsProps {
  questionarios: Array<{
    status: string
    total_perguntas_resp?: number
  }>
}

const KPICards = ({ questionarios }: KPICardsProps) => {
  const total = questionarios.length
  
  // Considerar tanto 'concluido' quanto 'preenchido' como finalizados
  const concluidos = questionarios.filter(q => 
    q.status === 'concluido' || q.status === 'preenchido'
  ).length
  
  // Em andamento: tem algumas respostas mas não está finalizado
  const emAndamento = questionarios.filter(q => 
    q.status === 'rascunho' && q.total_perguntas_resp && q.total_perguntas_resp > 0
  ).length
  
  // Aguardando início: não tem respostas ou tem status rascunho sem respostas
  const aguardando = questionarios.filter(q => 
    !q.total_perguntas_resp || q.total_perguntas_resp === 0
  ).length
  
  const taxaConclusao = total > 0 ? Math.round((concluidos / total) * 100) : 0

  const cards = [
    {
      title: "Total de Questionários",
      value: total,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Concluídos",
      value: concluidos,
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Em Andamento",
      value: emAndamento,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    },
    {
      title: "Aguardando Início",
      value: aguardando,
      icon: AlertCircle,
      color: "text-gray-600",
      bgColor: "bg-gray-50"
    },
    {
      title: "Taxa de Conclusão",
      value: `${taxaConclusao}%`,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
      {cards.map((card, index) => {
        const Icon = card.icon
        return (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${card.color}`}>
                {card.value}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

export default KPICards
