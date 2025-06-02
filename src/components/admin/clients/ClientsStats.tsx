
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Client } from '@/hooks/useClients';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface ClientsStatsProps {
  clients: Client[];
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

const ClientsStats = ({ clients }: ClientsStatsProps) => {
  // Gráfico por mês
  const monthlyData = clients.reduce((acc, client) => {
    const month = new Date(client.created_at).toLocaleDateString('pt-BR', { 
      year: 'numeric', 
      month: 'short' 
    });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(monthlyData)
    .map(([month, count]) => ({ month, count }))
    .slice(-6); // últimos 6 meses

  // Gráfico por tipo de evento
  const eventTypeData = clients.reduce((acc, client) => {
    if (client.event_type) {
      acc[client.event_type] = (acc[client.event_type] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(eventTypeData)
    .map(([type, count]) => ({ name: type, value: count }))
    .slice(0, 4); // top 4

  // Gráfico por faixa orçamentária
  const budgetData = clients.reduce((acc, client) => {
    if (client.budget_range) {
      acc[client.budget_range] = (acc[client.budget_range] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const budgetChartData = Object.entries(budgetData)
    .map(([range, count]) => ({ range, count }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gráfico de Clientes por Mês */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Novos Clientes por Mês</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico por Tipo de Evento */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tipos de Eventos</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
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
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico por Faixa Orçamentária */}
      {budgetChartData.length > 0 && (
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Distribuição por Faixa Orçamentária</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={budgetChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ClientsStats;
