
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGestaoComercial } from '@/hooks/useGestaoComercial';
import { DollarSign, FileText, CheckCircle, TrendingUp, Users, Target } from 'lucide-react';

const PainelFinanceiro = () => {
  const { financialMetrics, isLoading } = useGestaoComercial();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const kpiCards = [
    {
      title: 'Orçamentos em Aberto',
      value: financialMetrics.orcamentosAbertos,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Propostas enviadas aguardando resposta'
    },
    {
      title: 'Contratos em Andamento',
      value: financialMetrics.contratosAndamento,
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: 'Contratos assinados em execução'
    },
    {
      title: 'Contratos Assinados',
      value: financialMetrics.contratosAssinados,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'Total de contratos finalizados'
    },
    {
      title: 'Valor em Orçamentos',
      value: formatCurrency(financialMetrics.valorOrcamentosAbertos),
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'Valor total dos orçamentos em aberto'
    },
    {
      title: 'Valor Contratado',
      value: formatCurrency(financialMetrics.valorContratosAssinados),
      icon: TrendingUp,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      description: 'Valor total dos contratos assinados'
    },
    {
      title: 'Ticket Médio',
      value: formatCurrency(financialMetrics.ticketMedio),
      icon: Target,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50',
      description: 'Valor médio por contrato fechado'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpiCards.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                    <p className="text-xs text-gray-500">{kpi.description}</p>
                  </div>
                  <div className={`p-3 rounded-full ${kpi.bgColor}`}>
                    <Icon className={`h-6 w-6 ${kpi.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Card especial para Taxa de Conversão */}
      <Card className="border-2 border-dashed border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-indigo-600" />
            Performance de Conversão
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-indigo-600">
                {formatPercentage(financialMetrics.taxaConversao)}
              </p>
              <p className="text-sm text-gray-600">Taxa de conversão de leads para contratos</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">
                {financialMetrics.contratosAssinados} contratos fechados
              </p>
              <p className="text-xs text-gray-400">
                de todos os leads captados
              </p>
            </div>
          </div>
          
          {/* Barra de progresso visual */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${Math.min(financialMetrics.taxaConversao, 100)}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PainelFinanceiro;
