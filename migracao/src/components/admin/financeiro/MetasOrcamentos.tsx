
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Target, TrendingUp, Calendar, DollarSign, Plus, Edit } from 'lucide-react';
import { useMobileLayout } from '@/hooks/useMobileLayout';

const MetasOrcamentos = () => {
  const { isMobile } = useMobileLayout();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Dados mockados
  const metas = [
    {
      id: '1',
      titulo: 'Receita Mensal',
      metaValor: 50000,
      valorAtual: 35000,
      periodo: 'Janeiro 2024',
      progresso: 70
    },
    {
      id: '2',
      titulo: 'Novos Contratos',
      metaValor: 8,
      valorAtual: 5,
      periodo: 'Janeiro 2024',
      progresso: 62.5,
      unidade: 'contratos'
    },
    {
      id: '3',
      titulo: 'Ticket Médio',
      metaValor: 15000,
      valorAtual: 12500,
      periodo: 'Janeiro 2024',
      progresso: 83.3
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Metas & Orçamentos
            </CardTitle>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Meta
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Metas Atuais */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Metas do Mês</h3>
        <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'} gap-4`}>
          {metas.map((meta) => (
            <Card key={meta.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base">{meta.titulo}</CardTitle>
                    <p className="text-sm text-gray-600">{meta.periodo}</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progresso</span>
                    <span>{meta.progresso.toFixed(1)}%</span>
                  </div>
                  <Progress value={meta.progresso} className="h-2" />
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Atual:</span>
                    <span className="font-semibold">
                      {meta.unidade === 'contratos' 
                        ? `${meta.valorAtual} ${meta.unidade}`
                        : formatCurrency(meta.valorAtual)
                      }
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Meta:</span>
                    <span className="font-semibold">
                      {meta.unidade === 'contratos' 
                        ? `${meta.metaValor} ${meta.unidade}`
                        : formatCurrency(meta.metaValor)
                      }
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Restante:</span>
                    <span className="text-sm font-medium text-orange-600">
                      {meta.unidade === 'contratos' 
                        ? `${meta.metaValor - meta.valorAtual} ${meta.unidade}`
                        : formatCurrency(meta.metaValor - meta.valorAtual)
                      }
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Orçamento Anual */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Orçamento Anual 2024
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'} gap-6`}>
            <div className="space-y-4">
              <h4 className="font-semibold">Receitas Previstas</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Casamentos</span>
                  <span className="font-medium">R$ 480.000</span>
                </div>
                <div className="flex justify-between">
                  <span>Formaturas</span>
                  <span className="font-medium">R$ 120.000</span>
                </div>
                <div className="flex justify-between">
                  <span>Aniversários</span>
                  <span className="font-medium">R$ 80.000</span>
                </div>
                <div className="flex justify-between">
                  <span>Outros Eventos</span>
                  <span className="font-medium">R$ 40.000</span>
                </div>
                <hr />
                <div className="flex justify-between font-bold">
                  <span>Total Previsto</span>
                  <span>R$ 720.000</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold">Despesas Previstas</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Fornecedores</span>
                  <span className="font-medium">R$ 350.000</span>
                </div>
                <div className="flex justify-between">
                  <span>Operacionais</span>
                  <span className="font-medium">R$ 120.000</span>
                </div>
                <div className="flex justify-between">
                  <span>Marketing</span>
                  <span className="font-medium">R$ 60.000</span>
                </div>
                <div className="flex justify-between">
                  <span>Outros</span>
                  <span className="font-medium">R$ 30.000</span>
                </div>
                <hr />
                <div className="flex justify-between font-bold">
                  <span>Total Previsto</span>
                  <span>R$ 560.000</span>
                </div>
                <div className="flex justify-between font-bold text-green-600">
                  <span>Lucro Líquido</span>
                  <span>R$ 160.000</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MetasOrcamentos;
