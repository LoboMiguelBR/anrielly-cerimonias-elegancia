
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGestaoComercial } from '@/hooks/useGestaoComercial';
import { DollarSign, FileText, CheckCircle, TrendingUp, Users, Target } from 'lucide-react';
import { useMobileLayout } from '@/hooks/useMobileLayout';

const PainelFinanceiro = () => {
  const { financialMetrics, isLoading } = useGestaoComercial();
  const { isMobile, isTablet } = useMobileLayout();

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

  // Determinar número de colunas baseado no dispositivo
  const gridCols = isMobile ? 'grid-cols-1' : 
                   isTablet ? 'grid-cols-2' : 
                   'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

  return (
    <div className="space-y-6">
      <div className={`grid ${gridCols} gap-4 md:gap-6`}>
        {kpiCards.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className={`${isMobile ? 'p-4' : 'p-6'}`}>
                <div className="flex items-center justify-between">
                  <div className="space-y-2 flex-1 min-w-0">
                    <p className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-gray-600 truncate`}>
                      {kpi.title}
                    </p>
                    <p className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold text-gray-900 truncate`}>
                      {kpi.value}
                    </p>
                    {!isMobile && (
                      <p className="text-xs text-gray-500 line-clamp-2">
                        {kpi.description}
                      </p>
                    )}
                  </div>
                  <div className={`${isMobile ? 'p-2' : 'p-3'} rounded-full ${kpi.bgColor} flex-shrink-0 ml-3`}>
                    <Icon className={`${isMobile ? 'h-5 w-5' : 'h-6 w-6'} ${kpi.color}`} />
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
          <CardTitle className={`flex items-center gap-2 ${isMobile ? 'text-lg' : 'text-xl'}`}>
            <Target className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-indigo-600`} />
            Performance de Conversão
          </CardTitle>
        </CardHeader>
        <CardContent className={isMobile ? 'p-4' : 'p-6'}>
          <div className={`flex ${isMobile ? 'flex-col space-y-4' : 'items-center justify-between'}`}>
            <div className={isMobile ? 'text-center' : ''}>
              <p className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-indigo-600`}>
                {formatPercentage(financialMetrics.taxaConversao)}
              </p>
              <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600 mt-1`}>
                Taxa de conversão de leads para contratos
              </p>
            </div>
            <div className={`${isMobile ? 'text-center' : 'text-right'}`}>
              <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500`}>
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
