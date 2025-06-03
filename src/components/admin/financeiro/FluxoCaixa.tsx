
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, TrendingUp, TrendingDown, DollarSign, Plus, Download, Edit, Trash2 } from 'lucide-react';
import { useFinancialTransactions } from '@/hooks/useFinancialTransactions';
import { useMobileLayout } from '@/hooks/useMobileLayout';
import TransactionDialog from './TransactionDialog';
import { exportToPDF, generateFinancialReport } from '@/utils/pdfExporter';
import { toast } from 'sonner';

const FluxoCaixa = () => {
  const { transactions, isLoading, deleteTransaction, getFinancialSummary } = useFinancialTransactions();
  const { isMobile } = useMobileLayout();
  const [periodo, setPeriodo] = useState('30');
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const filteredTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.transaction_date);
    const now = new Date();
    const daysAgo = new Date(now.getTime() - parseInt(periodo) * 24 * 60 * 60 * 1000);
    
    const isInDateRange = transactionDate >= daysAgo;
    const isTypeMatch = filtroTipo === 'todos' || 
      (filtroTipo === 'entradas' && transaction.type === 'entrada') ||
      (filtroTipo === 'saidas' && transaction.type === 'saida');
    
    return isInDateRange && isTypeMatch;
  });

  const summary = getFinancialSummary();

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta transação?')) {
      await deleteTransaction(id);
    }
  };

  const handleExportPDF = async () => {
    try {
      const startDate = new Date(Date.now() - parseInt(periodo) * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR');
      const endDate = new Date().toLocaleDateString('pt-BR');
      
      const pdf = generateFinancialReport(filteredTransactions, startDate, endDate);
      pdf.save(`relatorio-financeiro-${periodo}dias.pdf`);
      toast.success('Relatório exportado com sucesso!');
    } catch (error) {
      toast.error('Erro ao exportar relatório');
    }
  };

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
              <Button size="sm" onClick={handleExportPDF} className="w-full md:w-auto">
                <Download className="h-4 w-4 mr-2" />
                Exportar PDF
              </Button>
              <Button size="sm" onClick={() => setDialogOpen(true)} className="w-full md:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Nova Transação
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Resumo */}
      <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'} gap-4`} id="financial-summary">
        <Card className="border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Entradas</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(summary.totalEntradas)}
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
                  {formatCurrency(summary.totalSaidas)}
                </p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className={`border-${summary.saldoLiquido >= 0 ? 'blue' : 'orange'}-200`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Saldo Líquido</p>
                <p className={`text-2xl font-bold ${summary.saldoLiquido >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                  {formatCurrency(summary.saldoLiquido)}
                </p>
              </div>
              <DollarSign className={`h-8 w-8 ${summary.saldoLiquido >= 0 ? 'text-blue-600' : 'text-orange-600'}`} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Transações */}
      <Card>
        <CardHeader>
          <CardTitle>Transações Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredTransactions.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Nenhuma transação encontrada</p>
            ) : (
              filteredTransactions.map((transaction) => (
                <div 
                  key={transaction.id} 
                  className={`flex justify-between items-center p-4 rounded-lg border ${
                    transaction.type === 'entrada' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{transaction.description}</p>
                      <span className={`text-xs px-2 py-1 rounded ${
                        transaction.type === 'entrada' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {transaction.category}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {new Date(transaction.transaction_date).toLocaleDateString('pt-BR')}
                      {transaction.payment_method && ` • ${transaction.payment_method}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className={`font-bold ${
                      transaction.type === 'entrada' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'entrada' ? '+' : '-'}{formatCurrency(Number(transaction.amount))}
                    </p>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(transaction)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(transaction.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <TransactionDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingTransaction(null);
        }}
        transaction={editingTransaction}
      />
    </div>
  );
};

export default FluxoCaixa;
