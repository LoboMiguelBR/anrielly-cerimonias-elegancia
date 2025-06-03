
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, AlertTriangle, CheckCircle, DollarSign, Filter, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useMobileLayout } from '@/hooks/useMobileLayout';

const ContasReceber = () => {
  const { isMobile } = useMobileLayout();
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [busca, setBusca] = useState('');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  // Dados mockados para demonstração
  const contasReceber = [
    {
      id: '1',
      cliente: 'João Silva',
      evento: 'Casamento',
      valor: 15000,
      valorPago: 5000,
      valorPendente: 10000,
      vencimento: '2024-02-15',
      status: 'pendente',
      parcela: '2/3'
    },
    {
      id: '2',
      cliente: 'Maria Santos',
      evento: 'Aniversário 15 anos',
      valor: 8000,
      valorPago: 8000,
      valorPendente: 0,
      vencimento: '2024-01-20',
      status: 'pago',
      parcela: '3/3'
    },
    {
      id: '3',
      cliente: 'Pedro Oliveira',
      evento: 'Formatura',
      valor: 12000,
      valorPago: 4000,
      valorPendente: 8000,
      vencimento: '2024-01-10',
      status: 'vencido',
      parcela: '1/2'
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      'pendente': { variant: 'secondary' as const, icon: Clock, color: 'text-yellow-600' },
      'vencido': { variant: 'destructive' as const, icon: AlertTriangle, color: 'text-red-600' },
      'pago': { variant: 'default' as const, icon: CheckCircle, color: 'text-green-600' }
    };
    
    const config = variants[status] || variants.pendente;
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const totalPendente = contasReceber
    .filter(conta => conta.status !== 'pago')
    .reduce((sum, conta) => sum + conta.valorPendente, 0);

  const totalVencido = contasReceber
    .filter(conta => conta.status === 'vencido')
    .reduce((sum, conta) => sum + conta.valorPendente, 0);

  const contasFiltradas = contasReceber.filter(conta => {
    const matchStatus = filtroStatus === 'todos' || conta.status === filtroStatus;
    const matchBusca = conta.cliente.toLowerCase().includes(busca.toLowerCase()) ||
                      conta.evento.toLowerCase().includes(busca.toLowerCase());
    return matchStatus && matchBusca;
  });

  return (
    <div className="space-y-6">
      {/* Resumo */}
      <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'} gap-4`}>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total a Receber</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(totalPendente)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Valores Vencidos</p>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(totalVencido)}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Contas em Dia</p>
                <p className="text-2xl font-bold text-green-600">
                  {contasReceber.filter(c => c.status === 'pago').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle>Contas a Receber</CardTitle>
            <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
              <Input
                placeholder="Buscar cliente ou evento..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full md:w-64"
              />
              <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="vencido">Vencido</SelectItem>
                  <SelectItem value="pago">Pago</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Lista de Contas */}
      <div className="space-y-4">
        {contasFiltradas.map((conta) => (
          <Card key={conta.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className={`${isMobile ? 'space-y-3' : 'flex justify-between items-center'}`}>
                <div className={`${isMobile ? 'space-y-2' : 'flex-1'}`}>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold">{conta.cliente}</h3>
                    {getStatusBadge(conta.status)}
                  </div>
                  <p className="text-sm text-gray-600">{conta.evento}</p>
                  <p className="text-xs text-gray-500">
                    Parcela {conta.parcela} • Vencimento: {formatDate(conta.vencimento)}
                  </p>
                </div>
                
                <div className={`${isMobile ? 'space-y-2' : 'text-right space-y-1'}`}>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">
                      Valor Total: {formatCurrency(conta.valor)}
                    </p>
                    <p className="text-sm text-green-600">
                      Pago: {formatCurrency(conta.valorPago)}
                    </p>
                    {conta.valorPendente > 0 && (
                      <p className="text-lg font-bold text-red-600">
                        Pendente: {formatCurrency(conta.valorPendente)}
                      </p>
                    )}
                  </div>
                  
                  {conta.status !== 'pago' && (
                    <div className={`flex gap-2 ${isMobile ? 'justify-stretch' : 'justify-end'}`}>
                      <Button size="sm" variant="outline" className={isMobile ? 'flex-1' : ''}>
                        Registrar Pagamento
                      </Button>
                      <Button size="sm" className={isMobile ? 'flex-1' : ''}>
                        Enviar Cobrança
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {contasFiltradas.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">Nenhuma conta encontrada com os filtros aplicados.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ContasReceber;
