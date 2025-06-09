import React from 'react';
import { useAuth, usePermissions, useTenant } from '@/hooks/useAuthEnhanced';
import { useUserStats } from '@/hooks/useUsersMultiTenant';
import { useEvents } from '@/hooks/useEventsEnhanced';
import { useSuppliers } from '@/hooks/useSuppliersSystem';
import { useCMSAnalytics } from '@/hooks/useCMSEnhanced';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  Calendar, 
  Users, 
  Building2, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Star,
  FileText,
  Settings,
  Bell,
  Activity
} from 'lucide-react';

// Dashboard para Admin Master
export function AdminMasterDashboard() {
  const { user } = useAuth();
  const { stats: userStats } = useUserStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Master</h1>
          <p className="text-muted-foreground">
            Visão geral de todos os tenants e sistema
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            Admin Master
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="tenants">Tenants</TabsTrigger>
          <TabsTrigger value="financial">Financeiro</TabsTrigger>
          <TabsTrigger value="system">Sistema</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Tenants</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">
                  +3 novos este mês
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userStats?.total || 0}</div>
                <p className="text-xs text-muted-foreground">
                  +12% em relação ao mês anterior
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ 45.231</div>
                <p className="text-xs text-muted-foreground">
                  +20.1% em relação ao mês anterior
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taxa de Retenção</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">94.2%</div>
                <p className="text-xs text-muted-foreground">
                  +2.1% em relação ao mês anterior
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Crescimento de Tenants</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                  Gráfico de crescimento de tenants
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Tenants Recentes</CardTitle>
                <CardDescription>
                  Últimos tenants cadastrados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center">
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          Empresa {i}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          empresa{i}@email.com
                        </p>
                      </div>
                      <div className="ml-auto font-medium">
                        <Badge variant="outline">Ativo</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tenants" className="space-y-4">
          <TenantsManagement />
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <FinancialOverview />
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <SystemHealth />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Dashboard para Admin (Cerimonialista)
export function AdminDashboard() {
  const { user, tenant } = useAuth();
  const { events } = useEvents();
  const { suppliers } = useSuppliers();

  const upcomingEvents = events.filter(event => 
    new Date(event.start_date) > new Date() && 
    event.status === 'confirmado'
  ).slice(0, 5);

  const pendingEvents = events.filter(event => 
    event.status === 'em_planejamento'
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Bem-vindo de volta, {user?.first_name}!
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Cerimonialista
          </Badge>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eventos Ativos</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{events.length}</div>
            <p className="text-xs text-muted-foreground">
              {pendingEvents} em planejamento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fornecedores</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{suppliers.length}</div>
            <p className="text-xs text-muted-foreground">
              Parceiros ativos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 12.450</div>
            <p className="text-xs text-muted-foreground">
              +15% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfação</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8</div>
            <p className="text-xs text-muted-foreground">
              Avaliação média dos clientes
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Próximos Eventos</CardTitle>
            <CardDescription>
              Eventos confirmados para os próximos dias
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-center">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {event.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(event.start_date).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="ml-auto font-medium">
                    <Badge variant="outline">{event.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full justify-start" variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Novo Evento
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Users className="mr-2 h-4 w-4" />
              Gerenciar Clientes
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Building2 className="mr-2 h-4 w-4" />
              Fornecedores
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Relatórios
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Dashboard para Cliente (Fornecedor)
export function ClientDashboard() {
  const { user } = useAuth();
  const { suppliers } = useSuppliers({ user_id: user?.id });

  const supplier = suppliers[0]; // Assumindo que o cliente tem um fornecedor associado

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Painel do Fornecedor</h1>
          <p className="text-muted-foreground">
            Gerencie seus serviços e cotações
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Fornecedor
          </Badge>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cotações Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              Aguardando resposta
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eventos Confirmados</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Para os próximos 3 meses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avaliação</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{supplier?.rating?.overall || 0}</div>
            <p className="text-xs text-muted-foreground">
              {supplier?.rating?.total_reviews || 0} avaliações
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 8.750</div>
            <p className="text-xs text-muted-foreground">
              +8% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Cotações Recentes</CardTitle>
            <CardDescription>
              Últimas solicitações de cotação
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Casamento - Cliente {i}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Solicitado há 2 dias
                    </p>
                  </div>
                  <div className="ml-auto font-medium">
                    <Badge variant="outline">Pendente</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Próximos Eventos</CardTitle>
            <CardDescription>
              Eventos confirmados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Evento {i}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(Date.now() + i * 7 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="ml-auto font-medium">
                    <Badge variant="outline">Confirmado</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Dashboard para Usuário (Noivos/Contratantes)
export function UserDashboard() {
  const { user } = useAuth();
  const { events } = useEvents({ client_id: user?.id });

  const myEvents = events.filter(event => event.client_id === user?.id);
  const upcomingEvent = myEvents.find(event => 
    new Date(event.start_date) > new Date()
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Meus Eventos</h1>
          <p className="text-muted-foreground">
            Acompanhe o planejamento do seu evento especial
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-pink-50 text-pink-700 border-pink-200">
            Cliente
          </Badge>
        </div>
      </div>

      {upcomingEvent ? (
        <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Próximo Evento
            </CardTitle>
            <CardDescription>
              {upcomingEvent.title}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <p className="text-sm font-medium">Data</p>
                <p className="text-2xl font-bold">
                  {new Date(upcomingEvent.start_date).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Local</p>
                <p className="text-lg">{upcomingEvent.location || 'A definir'}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Status</p>
                <Badge variant="outline">{upcomingEvent.status}</Badge>
              </div>
            </div>
            <div className="mt-4">
              <Button>Ver Detalhes do Evento</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Bem-vindo!</CardTitle>
            <CardDescription>
              Você ainda não tem eventos cadastrados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button>Solicitar Orçamento</Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Meus Eventos</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myEvents.length}</div>
            <p className="text-xs text-muted-foreground">
              Total de eventos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progresso</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">75%</div>
            <p className="text-xs text-muted-foreground">
              Planejamento concluído
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orçamento</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 25.000</div>
            <p className="text-xs text-muted-foreground">
              Valor estimado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dias Restantes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {upcomingEvent ? 
                Math.ceil((new Date(upcomingEvent.start_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) 
                : 0
              }
            </div>
            <p className="text-xs text-muted-foreground">
              Para o grande dia
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Checklist do Evento</CardTitle>
            <CardDescription>
              Itens pendentes para o seu evento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {['Escolher decoração', 'Confirmar cardápio', 'Definir música', 'Enviar convites'].map((item, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mensagens</CardTitle>
            <CardDescription>
              Comunicação com sua cerimonialista
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium">Anrielly Gomes</p>
                  <p className="text-sm text-muted-foreground">
                    Olá! Vamos agendar uma reunião para...
                  </p>
                  <p className="text-xs text-muted-foreground">2 horas atrás</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Componente principal que renderiza o dashboard baseado no perfil
export function MultiProfileDashboard() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Acesso Negado</h2>
          <p className="text-muted-foreground">Você precisa estar logado para acessar esta página.</p>
        </div>
      </div>
    );
  }

  switch (user.role) {
    case 'admin_master':
      return <AdminMasterDashboard />;
    case 'admin':
      return <AdminDashboard />;
    case 'cliente':
      return <ClientDashboard />;
    case 'usuario':
      return <UserDashboard />;
    default:
      return <UserDashboard />;
  }
}

// Componentes auxiliares
function TenantsManagement() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerenciamento de Tenants</CardTitle>
        <CardDescription>
          Gerencie todas as empresas do sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-muted-foreground">
          Componente de gerenciamento de tenants será implementado aqui
        </div>
      </CardContent>
    </Card>
  );
}

function FinancialOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Visão Financeira</CardTitle>
        <CardDescription>
          Receitas e métricas financeiras
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-muted-foreground">
          Componente de visão financeira será implementado aqui
        </div>
      </CardContent>
    </Card>
  );
}

function SystemHealth() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Saúde do Sistema</CardTitle>
        <CardDescription>
          Monitoramento e métricas do sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-muted-foreground">
          Componente de saúde do sistema será implementado aqui
        </div>
      </CardContent>
    </Card>
  );
}

export default MultiProfileDashboard;

