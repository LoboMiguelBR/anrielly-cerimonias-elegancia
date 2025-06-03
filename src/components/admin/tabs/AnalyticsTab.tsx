
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart3, TrendingUp, Users, Calendar, DollarSign, Target } from 'lucide-react';
import { useMobileLayout } from '@/hooks/useMobileLayout';

const AnalyticsTab = () => {
  const { isMobile } = useMobileLayout();
  const [periodo, setPeriodo] = useState('30');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Dados mockados para analytics
  const metricas = {
    vendasMes: 45000,
    crescimentoMes: 15.3,
    novosClientes: 12,
    eventosRealizados: 8,
    ticketMedio: 5625,
    taxaConversao: 24.5
  };

  return (
    <div className={`${isMobile ? 'p-2 space-y-4' : 'p-6 space-y-6'} min-h-screen`}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`${isMobile ? 'text-xl' : 'text-3xl'} font-bold text-gray-900`}>
            Analytics
          </h1>
          <p className={`text-gray-600 ${isMobile ? 'text-sm' : ''}`}>
            Análise detalhada do desempenho do negócio
          </p>
        </div>
        <Select value={periodo} onValueChange={setPeriodo}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Últimos 7 dias</SelectItem>
            <SelectItem value="30">Últimos 30 dias</SelectItem>
            <SelectItem value="90">Últimos 3 meses</SelectItem>
            <SelectItem value="365">Último ano</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* KPIs Principais */}
      <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-2 lg:grid-cols-6'} gap-4`}>
        <Card>
          <CardContent className={`${isMobile ? 'p-3' : 'p-6'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-gray-600`}>
                  Vendas do Mês
                </p>
                <p className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold`}>
                  {formatCurrency(metricas.vendasMes)}
                </p>
              </div>
              <DollarSign className={`${isMobile ? 'h-4 w-4' : 'h-8 w-8'} text-green-600`} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className={`${isMobile ? 'p-3' : 'p-6'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-gray-600`}>
                  Crescimento
                </p>
                <p className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold text-green-600`}>
                  +{metricas.crescimentoMes}%
                </p>
              </div>
              <TrendingUp className={`${isMobile ? 'h-4 w-4' : 'h-8 w-8'} text-green-600`} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className={`${isMobile ? 'p-3' : 'p-6'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-gray-600`}>
                  Novos Clientes
                </p>
                <p className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold`}>
                  {metricas.novosClientes}
                </p>
              </div>
              <Users className={`${isMobile ? 'h-4 w-4' : 'h-8 w-8'} text-blue-600`} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className={`${isMobile ? 'p-3' : 'p-6'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-gray-600`}>
                  Eventos
                </p>
                <p className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold`}>
                  {metricas.eventosRealizados}
                </p>
              </div>
              <Calendar className={`${isMobile ? 'h-4 w-4' : 'h-8 w-8'} text-purple-600`} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className={`${isMobile ? 'p-3' : 'p-6'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-gray-600`}>
                  Ticket Médio
                </p>
                <p className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold`}>
                  {formatCurrency(metricas.ticketMedio)}
                </p>
              </div>
              <BarChart3 className={`${isMobile ? 'h-4 w-4' : 'h-8 w-8'} text-orange-600`} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className={`${isMobile ? 'p-3' : 'p-6'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-gray-600`}>
                  Conversão
                </p>
                <p className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold`}>
                  {metricas.taxaConversao}%
                </p>
              </div>
              <Target className={`${isMobile ? 'h-4 w-4' : 'h-8 w-8'} text-red-600`} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="vendas" className="space-y-4">
        <TabsList className={`grid w-full ${isMobile ? 'grid-cols-2 h-12' : 'grid-cols-4'}`}>
          <TabsTrigger 
            value="vendas" 
            className={`${isMobile ? 'text-xs py-3' : ''}`}
          >
            Vendas
          </TabsTrigger>
          <TabsTrigger 
            value="clientes"
            className={`${isMobile ? 'text-xs py-3' : ''}`}
          >
            Clientes
          </TabsTrigger>
          <TabsTrigger 
            value="eventos"
            className={`${isMobile ? 'text-xs py-3' : ''}`}
          >
            Eventos
          </TabsTrigger>
          <TabsTrigger 
            value="financeiro"
            className={`${isMobile ? 'text-xs py-3' : ''}`}
          >
            Financeiro
          </TabsTrigger>
        </TabsList>

        <TabsContent value="vendas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Análise de Vendas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-500 py-8">
                Gráficos e análises de vendas serão implementados aqui
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clientes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Análise de Clientes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-500 py-8">
                Análises de comportamento e segmentação de clientes
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="eventos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Análise de Eventos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-500 py-8">
                Métricas e análises por tipo de evento
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financeiro" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Análise Financeira</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-500 py-8">
                Análises financeiras avançadas e projeções
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsTab;
