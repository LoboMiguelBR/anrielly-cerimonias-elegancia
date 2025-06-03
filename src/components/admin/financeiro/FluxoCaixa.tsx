
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, TrendingUp, TrendingDown, DollarSign, Plus, Filter } from 'lucide-react';
import { useGestaoComercial } from '@/hooks/useGestaoComercial';
import { useMobileLayout } from '@/hooks/useMobileLayout';

const FluxoCaixa = () => {
  const { financialMetrics, isLoading } = useGestaoComercial();
  const { isMobile } = useMobileLayout();
  const [periodo, setPeriodo] = useState('30');
  const [filtroTipo, setFiltroTipo] = useState('todos');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Dados mockados para demonstração
  const entradas = [
    { data: '2024-01-15', descricao: 'Contrato - Casamento Silva', valor: 15000, tipo: 'contrato' },
    { data: '2024-01-20', descricao: 'Sinal - Formatura João', valor: 3000, tipo: 'sinal' },
    { data: '2024-01-25', descricao: 'Pagamento Final - Aniversário Maria', valor: 8000, tipo: 'final' }
  ];

  const saidas = [
    { data: '2024-01-10', descricao: 'Fornecedor - Decoração', valor: -2500, tipo: 'fornecedor' },
    { data: '2024-01-18', descricao: 'Aluguel Escritório', valor: -1200, tipo: 'operacional' },
    { data: '2024-01-22', descricao: 'Marketing Digital', valor: -800, tipo: 'marketing' }
  ];

  const totalEntradas = entradas.reduce((sum, item) => sum + item.valor, 0);
  const totalSaidas = Math.abs(saidas.reduce((sum, item) => sum + item.valor, 0));
  const saldoLiquido = totalEntradas - totalSaidas;

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

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Fluxo de Caixa
            </CardTitle>
            <div className="flex flex-col md:flex-row gap-2">
              <Select value={periodo} onValueChange={setPeriodo}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Últimos 7 dias</SelectItem>
                  <SelectItem value="30">Últimos 30 dias</SelectItem>
                  <SelectItem value="90">Últimos 90 dias</SelectItem>
                  <SelectItem value="365">Último ano</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="entradas">Entradas</SelectItem>
                  <SelectItem value="saidas">Saídas</SelectItem>
                </SelectContent>
              </Select>
              <Button size="sm" className="w-full md:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Novo Lançamento
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Resumo */}
      <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'} gap-4`}>
        <Card className="border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Entradas</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(totalEntradas)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Saídas</p>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(totalSaidas)}
                </p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className={`border-${saldoLiquido >= 0 ? 'blue' : 'orange'}-200`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Saldo Líquido</p>
                <p className={`text-2xl font-bold ${saldoLiquido >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                  {formatCurrency(saldoLiquido)}
                </p>
              </div>
              <DollarSign className={`h-8 w-8 ${saldoLiquido >= 0 ? 'text-blue-600' : 'text-orange-600'}`} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Movimentações */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Entradas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Entradas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {entradas.map((entrada, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-sm">{entrada.descricao}</p>
                  <p className="text-xs text-gray-500">{entrada.data}</p>
                </div>
                <p className="font-bold text-green-600">
                  {formatCurrency(entrada.valor)}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Saídas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center gap-2">
              <TrendingDown className="h-5 w-5" />
              Saídas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {saidas.map((saida, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-sm">{saida.descricao}</p>
                  <p className="text-xs text-gray-500">{saida.data}</p>
                </div>
                <p className="font-bold text-red-600">
                  {formatCurrency(Math.abs(saida.valor))}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FluxoCaixa;
