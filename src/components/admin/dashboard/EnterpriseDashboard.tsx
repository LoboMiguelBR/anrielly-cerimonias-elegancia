
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Users, Gauge, Info } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid, PieChart, Pie, Cell } from "recharts";
import { useNotifications } from "@/hooks/useNotifications";
import { toast } from "sonner";
import { useFinancialTransactions } from "@/hooks/useFinancialTransactions";

// Cores para os gráficos
const COLORS = ["#41AFFF", "#FFC145", "#21c55d", "#FA5252", "#7048e8"];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

const EnterpriseDashboard = () => {
  // KPIs & Finance hooks
  const { getFinancialSummary, transactions, isLoading } = useFinancialTransactions();
  const [kpis, setKpis] = useState({
    totalEntradas: 0,
    totalSaidas: 0,
    saldoLiquido: 0,
    conversion: 0
  });

  // Example: Notificações automáticas (mock para demo)
  const { notifications, unreadCount } = useNotifications();
  useEffect(() => {
    // Exemplo: Notificação automática ao atingir saldo negativo
    if (kpis.saldoLiquido < 0) {
      toast.warning("Alerta financeiro", {
        description: "O saldo está negativo! Revise as contas a pagar."
      });
    }
  }, [kpis.saldoLiquido]);

  // Atualização dos KPIs ao carregar dados financeiros
  useEffect(() => {
    const summary = getFinancialSummary?.() ?? { totalEntradas: 0, totalSaidas: 0, saldoLiquido: 0 };
    setKpis({
      totalEntradas: summary.totalEntradas,
      totalSaidas: summary.totalSaidas,
      saldoLiquido: summary.saldoLiquido,
      conversion: summary.totalEntradas > 0 ? ((summary.saldoLiquido / summary.totalEntradas) * 100) : 0
    });
  }, [transactions]);

  // Gráfico de barras de entradas x saídas por mês (mock para demo)
  const monthlyData = [
    { month: "Jan", entrada: 12000, saida: 8000 },
    { month: "Feb", entrada: 18000, saida: 6500 },
    { month: "Mar", entrada: 16500, saida: 11000 },
    { month: "Abr", entrada: kpis.totalEntradas, saida: kpis.totalSaidas }, // Current (demo)
  ];

  // Gráfico pizza: distribuição das despesas por categoria
  const summary = getFinancialSummary?.();
  const pieData = Array.isArray(summary?.transactionsByCategory)
    ? summary?.transactionsByCategory.map((cat: any, i: number) => ({
        name: cat.category,
        value: cat.total
      }))
    : [];

  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-600">
              <DollarSign className="h-4 w-4" /> Entradas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(kpis.totalEntradas)}</p>
            <span className="text-xs text-gray-500">Recebimentos do mês</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <TrendingDown className="h-4 w-4" /> Saídas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(kpis.totalSaidas)}</p>
            <span className="text-xs text-gray-500">Despesas do mês</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-600">
              <Gauge className="h-4 w-4" /> Saldo Líquido
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold ${kpis.saldoLiquido < 0 ? 'text-red-500' : 'text-gray-900'}`}>
              {formatCurrency(kpis.saldoLiquido)}
            </p>
            <span className="text-xs text-gray-500">Saldo atualizado</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-600">
              <Info className="h-4 w-4" /> Notificações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{unreadCount}</p>
            <span className="text-xs text-gray-500">Não lidas</span>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Gráfico Barras */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-primary">Fluxo Financeiro (Entradas x Saídas)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72 -ml-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="entrada" fill="#41AFFF" name="Entradas" />
                  <Bar dataKey="saida" fill="#FA5252" name="Saídas" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        {/* Gráfico Pizza */}
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">Despesas por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      dataKey="value"
                      label
                    >
                      {pieData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend layout="vertical" align="right" verticalAlign="middle" />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                  Sem dados suficientes para a pizza.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Relatórios e Alertas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Relatório Financeiro Avançado */}
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-800 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" /> Relatório Financeiro Avançado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr>
                    <th className="py-2 pr-4 text-left font-semibold">Data</th>
                    <th className="py-2 pr-4 text-left font-semibold">Descrição</th>
                    <th className="py-2 pr-4 text-left font-semibold">Categoria</th>
                    <th className="py-2 pr-4 text-right font-semibold">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={4} className="py-10 text-center text-gray-400">Carregando...</td>
                    </tr>
                  ) : (transactions.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-gray-400">Nenhuma transação encontrada.</td>
                    </tr>
                  ) : (
                    transactions.slice(0, 12).map((t) => (
                      <tr key={t.id} className="border-b last:border-none">
                        <td className="py-2 pr-4">{t.transaction_date}</td>
                        <td className="py-2 pr-4">{t.description}</td>
                        <td className="py-2 pr-4">{t.category}</td>
                        <td className="py-2 pr-4 text-right">{formatCurrency(Number(t.amount))}</td>
                      </tr>
                    ))
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        {/* Alertas Automáticos */}
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-800 flex items-center gap-2">
              <Info className="h-5 w-5 text-yellow-500" /> Alertas Automáticos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {kpis.saldoLiquido < 0 && (
                <li className="bg-red-100 border-l-4 border-red-500 px-4 py-2 rounded text-red-700">
                  Saldo negativo! Revise despesas e receitas.
                </li>
              )}
              {kpis.totalEntradas > 0 && kpis.totalSaidas / kpis.totalEntradas > 0.8 && (
                <li className="bg-amber-50 border-l-4 border-amber-500 px-4 py-2 rounded text-amber-700">
                  Alerta: Despesas estão consumindo mais de 80% das receitas.
                </li>
              )}
              {unreadCount > 0 && (
                <li className="bg-blue-50 border-l-4 border-blue-500 px-4 py-2 rounded text-blue-700">
                  Você tem {unreadCount} notificações não lidas.
                </li>
              )}
              {(kpis.saldoLiquido >= 0 && unreadCount === 0) && (
                <li className="text-gray-500">Nenhum alerta urgente no momento.</li>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnterpriseDashboard;
