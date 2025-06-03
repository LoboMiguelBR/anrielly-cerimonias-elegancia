
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Download, Calendar, BarChart3, PieChart, TrendingUp } from 'lucide-react';
import { useMobileLayout } from '@/hooks/useMobileLayout';
import { useFinancialTransactions } from '@/hooks/useFinancialTransactions';
import { generateFinancialReport } from '@/utils/pdfExporter';
import { toast } from 'sonner';

const RelatoriosFinanceiros = () => {
  const { isMobile } = useMobileLayout();
  const { transactions, getFinancialSummary } = useFinancialTransactions();
  const [periodo, setPeriodo] = useState('30');
  const [tipoRelatorio, setTipoRelatorio] = useState('geral');

  const summary = getFinancialSummary();

  const relatoriosDisponiveis = [
    {
      id: 'vendas-mensal',
      titulo: 'Relatório de Vendas Mensal',
      descricao: 'Vendas, contratos fechados e receita por mês',
      icon: TrendingUp,
      categoria: 'vendas'
    },
    {
      id: 'fluxo-caixa',
      titulo: 'Fluxo de Caixa Detalhado',
      descricao: 'Entradas, saídas e saldo por período',
      icon: BarChart3,
      categoria: 'financeiro'
    },
    {
      id: 'rentabilidade-evento',
      titulo: 'Rentabilidade por Tipo de Evento',
      descricao: 'Análise de margem e lucro por categoria',
      icon: PieChart,
      categoria: 'analise'
    },
    {
      id: 'fornecedores',
      titulo: 'Relatório de Fornecedores',
      descricao: 'Gastos e performance dos fornecedores',
      icon: FileText,
      categoria: 'operacional'
    }
  ];

  const gerarRelatorio = async (relatorioId: string) => {
    try {
      const daysAgo = parseInt(periodo);
      const filteredTransactions = transactions.filter(transaction => {
        const transactionDate = new Date(transaction.transaction_date);
        const now = new Date();
        const cutoffDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
        return transactionDate >= cutoffDate;
      });

      const startDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR');
      const endDate = new Date().toLocaleDateString('pt-BR');

      const pdf = generateFinancialReport(filteredTransactions, startDate, endDate);
      
      const relatorio = relatoriosDisponiveis.find(r => r.id === relatorioId);
      const filename = `${relatorio?.titulo.toLowerCase().replace(/\s+/g, '-')}-${periodo}dias`;
      
      pdf.save(`${filename}.pdf`);
      toast.success('Relatório gerado com sucesso!');
    } catch (error) {
      toast.error('Erro ao gerar relatório');
      console.error('Error generating report:', error);
    }
  };

  const exportarExcel = (relatorioId: string) => {
    // Simular exportação para Excel
    const csvContent = transactions.map(t => 
      `${t.transaction_date},${t.type},${t.category},${t.description},${t.amount}`
    ).join('\n');
    
    const header = 'Data,Tipo,Categoria,Descrição,Valor\n';
    const csv = header + csvContent;
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-${relatorioId}-${periodo}dias.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success('Dados exportados para CSV!');
  };

  return (
    <div className="space-y-6">
      {/* Header com filtros */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Relatórios Financeiros
            </CardTitle>
            <div className="flex gap-2">
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
              <Select value={tipoRelatorio} onValueChange={setTipoRelatorio}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="geral">Todos</SelectItem>
                  <SelectItem value="vendas">Vendas</SelectItem>
                  <SelectItem value="financeiro">Financeiro</SelectItem>
                  <SelectItem value="analise">Análise</SelectItem>
                  <SelectItem value="operacional">Operacional</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Grid de Relatórios */}
      <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'} gap-6`}>
        {relatoriosDisponiveis
          .filter(rel => tipoRelatorio === 'geral' || rel.categoria === tipoRelatorio)
          .map((relatorio) => {
            const Icon = relatorio.icon;
            return (
              <Card key={relatorio.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{relatorio.titulo}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        {relatorio.descricao}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => gerarRelatorio(relatorio.id)}
                      className="flex-1"
                      size="sm"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Gerar PDF
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => exportarExcel(relatorio.id)}
                      size="sm"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      CSV
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
      </div>

      {/* Relatórios Rápidos */}
      <Card>
        <CardHeader>
          <CardTitle>Relatórios Rápidos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'} gap-4`}>
            <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
              <Calendar className="h-6 w-6" />
              <span className="font-medium">Entradas Hoje</span>
              <span className="text-sm text-gray-600">
                R$ {summary.totalEntradas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
              <TrendingUp className="h-6 w-6" />
              <span className="font-medium">Saldo Atual</span>
              <span className="text-sm text-gray-600">
                R$ {summary.saldoLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
              <BarChart3 className="h-6 w-6" />
              <span className="font-medium">Transações</span>
              <span className="text-sm text-gray-600">{transactions.length} no período</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RelatoriosFinanceiros;
