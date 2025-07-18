import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface ReportChartProps {
  data: any;
  reportType: string;
}

export const ReportChart: React.FC<ReportChartProps> = ({ data, reportType }) => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const renderFinancialReport = () => {
    const chartData = [
      { name: 'Receita', value: data.total_revenue || 0, color: '#00C49F' },
      { name: 'Despesas', value: data.total_expenses || 0, color: '#FF8042' },
      { name: 'Lucro Líquido', value: data.net_profit || 0, color: '#0088FE' },
    ];

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.total_revenue || 0)}
            </div>
            <div className="text-sm text-muted-foreground">Receita Total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.total_expenses || 0)}
            </div>
            <div className="text-sm text-muted-foreground">Despesas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.net_profit || 0)}
            </div>
            <div className="text-sm text-muted-foreground">Lucro Líquido</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">
              {data.transaction_count || 0}
            </div>
            <div className="text-sm text-muted-foreground">Transações</div>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={(value) => 
              new Intl.NumberFormat('pt-BR', { 
                style: 'currency', 
                currency: 'BRL',
                minimumFractionDigits: 0 
              }).format(value)
            } />
            <Tooltip formatter={(value) => 
              new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value as number)
            } />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderClientsReport = () => {
    const eventTypes = data.by_event_type || {};
    const pieData = Object.entries(eventTypes).map(([type, count], index) => ({
      name: type,
      value: count as number,
      color: COLORS[index % COLORS.length],
    }));

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{data.total_clients || 0}</div>
            <div className="text-sm text-muted-foreground">Total de Clientes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{data.new_clients || 0}</div>
            <div className="text-sm text-muted-foreground">Novos Clientes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{data.active_clients || 0}</div>
            <div className="text-sm text-muted-foreground">Clientes Ativos</div>
          </div>
        </div>

        {pieData.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Distribuição por Tipo de Evento</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    );
  };

  const renderProposalsReport = () => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{data.total_proposals || 0}</div>
            <div className="text-sm text-muted-foreground">Total de Propostas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{data.approved_proposals || 0}</div>
            <div className="text-sm text-muted-foreground">Aprovadas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{data.pending_proposals || 0}</div>
            <div className="text-sm text-muted-foreground">Pendentes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.average_value || 0)}
            </div>
            <div className="text-sm text-muted-foreground">Valor Médio</div>
          </div>
        </div>

        <div className="text-center p-4 bg-muted rounded-lg">
          <div className="text-3xl font-bold text-primary">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.total_value || 0)}
          </div>
          <div className="text-sm text-muted-foreground">Valor Total em Propostas</div>
        </div>
      </div>
    );
  };

  const renderReport = () => {
    switch (reportType) {
      case 'financial':
        return renderFinancialReport();
      case 'clients':
        return renderClientsReport();
      case 'proposals':
        return renderProposalsReport();
      default:
        return (
          <div className="text-center py-8 text-muted-foreground">
            Relatório não implementado ainda
          </div>
        );
    }
  };

  return <div>{renderReport()}</div>;
};