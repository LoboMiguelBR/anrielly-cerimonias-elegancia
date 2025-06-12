
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  DollarSign, 
  AlertCircle,
  FileText,
  Clock,
  Star,
  ArrowRight
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface DashboardMetrics {
  totalClients: number;
  newClientsThisMonth: number;
  totalProposals: number;
  proposalsThisMonth: number;
  totalContracts: number;
  contractsThisMonth: number;
  monthlyRevenue: number;
  conversionRate: number;
  averageProposalValue: number;
  pendingTasks: number;
}

interface AtividadeRecente {
  id: string;
  tipo: 'proposta' | 'contrato' | 'cliente' | 'evento';
  clienteNome: string;
  valor?: number;
  status: string;
  data: string;
}

interface AlertaGestao {
  id: string;
  tipo: 'prazo' | 'pagamento' | 'followup' | 'documento';
  titulo: string;
  descricao: string;
  prioridade: 'alta' | 'media' | 'baixa';
  dataVencimento?: string;
}

const IntelligentDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalClients: 0,
    newClientsThisMonth: 0,
    totalProposals: 0,
    proposalsThisMonth: 0,
    totalContracts: 0,
    contractsThisMonth: 0,
    monthlyRevenue: 0,
    conversionRate: 0,
    averageProposalValue: 0,
    pendingTasks: 0
  });

  const [atividadesRecentes, setAtividadesRecentes] = useState<AtividadeRecente[]>([]);
  const [alertas, setAlertas] = useState<AlertaGestao[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Buscar métricas básicas
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      // Clientes
      const { data: clientes } = await supabase
        .from('clientes')
        .select('created_at');

      const { data: clientesDoMes } = await supabase
        .from('clientes')
        .select('created_at')
        .gte('created_at', startOfMonth.toISOString());

      // Propostas
      const { data: propostas } = await supabase
        .from('proposals')
        .select('created_at, total_price, status');

      const { data: propostasDoMes } = await supabase
        .from('proposals')
        .select('created_at, total_price')
        .gte('created_at', startOfMonth.toISOString());

      // Contratos
      const { data: contratos } = await supabase
        .from('contracts')
        .select('created_at, total_price, status');

      const { data: contratosDoMes } = await supabase
        .from('contracts')
        .select('created_at, total_price')
        .gte('created_at', startOfMonth.toISOString());

      // Calcular métricas
      const totalClients = clientes?.length || 0;
      const newClientsThisMonth = clientesDoMes?.length || 0;
      const totalProposals = propostas?.length || 0;
      const proposalsThisMonth = propostasDoMes?.length || 0;
      const totalContracts = contratos?.length || 0;
      const contractsThisMonth = contratosDoMes?.length || 0;

      const monthlyRevenue = contratosDoMes?.reduce((acc, contrato) => 
        acc + (Number(contrato.total_price) || 0), 0) || 0;

      const conversionRate = totalProposals > 0 ? (totalContracts / totalProposals) * 100 : 0;
      const averageProposalValue = totalProposals > 0 ? 
        (propostas?.reduce((acc, prop) => acc + (Number(prop.total_price) || 0), 0) || 0) / totalProposals : 0;

      setMetrics({
        totalClients,
        newClientsThisMonth,
        totalProposals,
        proposalsThisMonth,
        totalContracts,
        contractsThisMonth,
        monthlyRevenue,
        conversionRate,
        averageProposalValue,
        pendingTasks: 0 // Implementar depois
      });

      // Atividades recentes (mock por agora)
      const atividadesMock: AtividadeRecente[] = [
        {
          id: '1',
          tipo: 'proposta',
          clienteNome: 'Maria Silva',
          valor: 15000,
          status: 'enviada',
          data: new Date().toISOString()
        },
        {
          id: '2',
          tipo: 'contrato',
          clienteNome: 'João Santos',
          valor: 20000,
          status: 'assinado',
          data: new Date(Date.now() - 86400000).toISOString()
        }
      ];

      setAtividadesRecentes(atividadesMock);

      // Alertas (mock por agora)
      const alertasMock: AlertaGestao[] = [
        {
          id: '1',
          tipo: 'prazo',
          titulo: 'Proposta vencendo',
          descricao: 'Proposta para Ana Costa vence em 2 dias',
          prioridade: 'alta',
          dataVencimento: new Date(Date.now() + 172800000).toISOString()
        }
      ];

      setAlertas(alertasMock);

    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
      toast.error('Erro ao carregar dados do dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Inteligente</h1>
          <p className="text-gray-600">Insights e métricas do seu negócio</p>
        </div>
        <Button onClick={fetchDashboardData} variant="outline">
          Atualizar Dados
        </Button>
      </div>

      {/* Alertas Críticos */}
      {alertas.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <AlertCircle className="w-5 h-5" />
              Alertas Importantes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {alertas.map(alerta => (
                <div key={alerta.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{alerta.titulo}</p>
                    <p className="text-sm text-gray-600">{alerta.descricao}</p>
                  </div>
                  <Badge variant={alerta.prioridade === 'alta' ? 'destructive' : 'secondary'}>
                    {alerta.prioridade}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita do Mês</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {metrics.monthlyRevenue.toLocaleString('pt-BR')}
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics.contractsThisMonth} contratos este mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Novos Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.newClientsThisMonth}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.totalClients} total de clientes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.conversionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {metrics.totalContracts} de {metrics.totalProposals} propostas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {metrics.averageProposalValue.toLocaleString('pt-BR')}
            </div>
            <p className="text-xs text-muted-foreground">
              Valor médio das propostas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Atividades Recentes e Próximas Ações */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Atividades Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {atividadesRecentes.map(atividade => (
                <div key={atividade.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{atividade.clienteNome}</p>
                    <p className="text-sm text-gray-600 capitalize">
                      {atividade.tipo} • {atividade.status}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(atividade.data).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  {atividade.valor && (
                    <div className="text-right">
                      <p className="font-medium text-green-600">
                        R$ {atividade.valor.toLocaleString('pt-BR')}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Próximas Ações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-blue-900">Follow-up Propostas</p>
                    <p className="text-sm text-blue-700">3 propostas aguardando resposta</p>
                  </div>
                  <Button size="sm" variant="outline">
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-green-900">Contratos para Envio</p>
                    <p className="text-sm text-green-700">2 contratos prontos para envio</p>
                  </div>
                  <Button size="sm" variant="outline">
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-purple-900">Eventos Próximos</p>
                    <p className="text-sm text-purple-700">1 evento na próxima semana</p>
                  </div>
                  <Button size="sm" variant="outline">
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IntelligentDashboard;
