
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Award, DollarSign, Star, TrendingUp, Search, Filter } from 'lucide-react';
import { useMobileLayout } from '@/hooks/useMobileLayout';

const GestaoFornecedores = () => {
  const { isMobile } = useMobileLayout();
  const [busca, setBusca] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('todos');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Dados mockados
  const fornecedores = [
    {
      id: '1',
      nome: 'Flores & Decorações Ltda',
      categoria: 'decoracao',
      gastoTotal: 25000,
      gastoMedio: 2500,
      numeroEventos: 10,
      rating: 4.8,
      status: 'ativo',
      ultimoPedido: '2024-01-20'
    },
    {
      id: '2',
      nome: 'Fotografia Premium',
      categoria: 'fotografia',
      gastoTotal: 18000,
      gastoMedio: 3000,
      numeroEventos: 6,
      rating: 4.9,
      status: 'ativo',
      ultimoPedido: '2024-01-18'
    },
    {
      id: '3',
      nome: 'Buffet Gourmet',
      categoria: 'gastronomia',
      gastoTotal: 45000,
      gastoMedio: 4500,
      numeroEventos: 10,
      rating: 4.7,
      status: 'ativo',
      ultimoPedido: '2024-01-15'
    }
  ];

  const totalGastoFornecedores = fornecedores.reduce((sum, f) => sum + f.gastoTotal, 0);
  const mediaRating = fornecedores.reduce((sum, f) => sum + f.rating, 0) / fornecedores.length;

  const getCategoriaBadge = (categoria: string) => {
    const cores = {
      'decoracao': 'bg-purple-100 text-purple-800',
      'fotografia': 'bg-blue-100 text-blue-800',
      'gastronomia': 'bg-green-100 text-green-800',
      'musica': 'bg-orange-100 text-orange-800'
    };
    return cores[categoria] || 'bg-gray-100 text-gray-800';
  };

  const fornecedoresFiltrados = fornecedores.filter(fornecedor => {
    const matchBusca = fornecedor.nome.toLowerCase().includes(busca.toLowerCase());
    const matchCategoria = filtroCategoria === 'todos' || fornecedor.categoria === filtroCategoria;
    return matchBusca && matchCategoria;
  });

  return (
    <div className="space-y-6">
      {/* Resumo */}
      <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'} gap-4`}>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Gasto</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(totalGastoFornecedores)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Fornecedores Ativos</p>
                <p className="text-2xl font-bold text-green-600">
                  {fornecedores.filter(f => f.status === 'ativo').length}
                </p>
              </div>
              <Award className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avaliação Média</p>
                <p className="text-2xl font-bold text-orange-600">
                  {mediaRating.toFixed(1)} ⭐
                </p>
              </div>
              <Star className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle>Gestão de Fornecedores</CardTitle>
            <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
              <Input
                placeholder="Buscar fornecedor..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full md:w-64"
              />
              <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas</SelectItem>
                  <SelectItem value="decoracao">Decoração</SelectItem>
                  <SelectItem value="fotografia">Fotografia</SelectItem>
                  <SelectItem value="gastronomia">Gastronomia</SelectItem>
                  <SelectItem value="musica">Música</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Lista de Fornecedores */}
      <div className="space-y-4">
        {fornecedoresFiltrados.map((fornecedor) => (
          <Card key={fornecedor.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className={`${isMobile ? 'space-y-3' : 'flex justify-between items-center'}`}>
                <div className={`${isMobile ? 'space-y-2' : 'flex-1'}`}>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold">{fornecedor.nome}</h3>
                    <Badge className={getCategoriaBadge(fornecedor.categoria)}>
                      {fornecedor.categoria.charAt(0).toUpperCase() + fornecedor.categoria.slice(1)}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{fornecedor.rating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    {fornecedor.numeroEventos} eventos • Último pedido: {new Date(fornecedor.ultimoPedido).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                
                <div className={`${isMobile ? 'grid grid-cols-2 gap-4' : 'text-right space-y-1'}`}>
                  <div>
                    <p className="text-sm text-gray-600">Gasto Total</p>
                    <p className="font-bold text-blue-600">
                      {formatCurrency(fornecedor.gastoTotal)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Ticket Médio</p>
                    <p className="font-bold text-green-600">
                      {formatCurrency(fornecedor.gastoMedio)}
                    </p>
                  </div>
                  
                  {!isMobile && (
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" variant="outline">
                        Ver Histórico
                      </Button>
                      <Button size="sm">
                        Novo Pedido
                      </Button>
                    </div>
                  )}
                </div>

                {isMobile && (
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="outline" className="flex-1">
                      Ver Histórico
                    </Button>
                    <Button size="sm" className="flex-1">
                      Novo Pedido
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {fornecedoresFiltrados.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">Nenhum fornecedor encontrado com os filtros aplicados.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GestaoFornecedores;
