import React, { useState, useEffect } from 'react';
import { 
  useSystemHealth, 
  useSystemMetrics, 
  useSystemLogs, 
  useSystemAlerts,
  useSystemLogger
} from '@/hooks/useSystemMonitoring';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Clock,
  Server,
  Database,
  Cpu,
  HardDrive,
  Memory,
  Wifi,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Download,
  Filter,
  Search,
  Bell,
  Shield,
  Zap,
  BarChart3,
  LineChart,
  Eye,
  Settings
} from 'lucide-react';
import { LineChart as RechartsLineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';

// Componente principal de monitoramento
export function SystemMonitoring() {
  const [selectedLogLevel, setSelectedLogLevel] = useState<string>('all');
  const [selectedAlertType, setSelectedAlertType] = useState<string>('all');
  const [autoRefresh, setAutoRefresh] = useState(true);

  const { health, isLoading: healthLoading, refetch: refetchHealth } = useSystemHealth();
  const { metrics, isLoading: metricsLoading, refetch: refetchMetrics } = useSystemMetrics();
  const { logs, isLoading: logsLoading, refetch: refetchLogs } = useSystemLogs({
    level: selectedLogLevel !== 'all' ? selectedLogLevel : undefined,
    limit: 100,
  });
  const { alerts, isLoading: alertsLoading, resolveAlert, refetch: refetchAlerts } = useSystemAlerts({
    type: selectedAlertType !== 'all' ? selectedAlertType : undefined,
    limit: 50,
  });

  // Auto-refresh a cada 30 segundos
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      refetchHealth();
      refetchMetrics();
      refetchLogs();
      refetchAlerts();
    }, 30000);

    return () => clearInterval(interval);
  }, [autoRefresh, refetchHealth, refetchMetrics, refetchLogs, refetchAlerts]);

  const getHealthStatus = () => {
    if (!health) return { color: 'text-gray-500', bg: 'bg-gray-100', text: 'Desconhecido' };
    
    switch (health.status) {
      case 'healthy':
        return { color: 'text-green-600', bg: 'bg-green-100', text: 'Saudável' };
      case 'warning':
        return { color: 'text-yellow-600', bg: 'bg-yellow-100', text: 'Atenção' };
      case 'critical':
        return { color: 'text-red-600', bg: 'bg-red-100', text: 'Crítico' };
      default:
        return { color: 'text-gray-500', bg: 'bg-gray-100', text: 'Desconhecido' };
    }
  };

  const healthStatus = getHealthStatus();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Monitoramento do Sistema</h1>
          <p className="text-muted-foreground">
            Saúde, performance e logs do sistema em tempo real
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={autoRefresh ? 'bg-green-50 border-green-200' : ''}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${autoRefresh ? 'animate-spin' : ''}`} />
            Auto-refresh {autoRefresh ? 'ON' : 'OFF'}
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Exportar Logs
          </Button>
        </div>
      </div>

      {/* Status Geral */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status do Sistema</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${healthStatus.color}`}>
              {healthLoading ? '...' : healthStatus.text}
            </div>
            <p className="text-xs text-muted-foreground">
              Última verificação: {health?.last_check ? new Date(health.last_check).toLocaleTimeString('pt-BR') : 'N/A'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo de Resposta</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {healthLoading ? '...' : `${health?.response_time.toFixed(0) || '0'}ms`}
            </div>
            <p className="text-xs text-muted-foreground">
              {health?.response_time && health.response_time < 100 ? (
                <span className="text-green-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Excelente
                </span>
              ) : (
                <span className="text-yellow-600 flex items-center">
                  <TrendingDown className="h-3 w-3 mr-1" />
                  Pode melhorar
                </span>
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Erro</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {healthLoading ? '...' : `${health?.error_rate.toFixed(1) || '0'}%`}
            </div>
            <p className="text-xs text-muted-foreground">
              {health?.error_rate && health.error_rate < 1 ? (
                <span className="text-green-600">Baixa</span>
              ) : (
                <span className="text-red-600">Alta</span>
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
            <Wifi className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metricsLoading ? '...' : metrics?.active_users || '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics?.requests_per_minute || 0} req/min
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de Monitoramento */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
          <TabsTrigger value="alerts">Alertas</TabsTrigger>
          <TabsTrigger value="resources">Recursos</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <SystemOverview health={health} metrics={metrics} />
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <PerformanceMetrics metrics={metrics} />
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <SystemLogs 
            logs={logs} 
            isLoading={logsLoading}
            selectedLevel={selectedLogLevel}
            onLevelChange={setSelectedLogLevel}
          />
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <SystemAlerts 
            alerts={alerts}
            isLoading={alertsLoading}
            selectedType={selectedAlertType}
            onTypeChange={setSelectedAlertType}
            onResolveAlert={resolveAlert}
          />
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <ResourceMonitoring health={health} metrics={metrics} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Componente de visão geral do sistema
function SystemOverview({ health, metrics }: { health: any; metrics: any }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Saúde do Sistema</CardTitle>
            <CardDescription>
              Indicadores principais de saúde
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Status Geral</span>
              <Badge variant={health?.status === 'healthy' ? 'default' : 'destructive'}>
                {health?.status === 'healthy' ? 'Saudável' : 'Problema'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Uptime</span>
              <span className="text-sm">
                {health?.uptime ? Math.floor(health.uptime / (1000 * 60 * 60 * 24)) : 0} dias
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Conexões Ativas</span>
              <span className="text-sm">{health?.active_connections || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Tempo de Resposta</span>
              <span className="text-sm">{health?.response_time?.toFixed(0) || 0}ms</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Métricas de Performance</CardTitle>
            <CardDescription>
              Indicadores de performance em tempo real
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Requisições/min</span>
              <span className="text-sm font-bold">{metrics?.requests_per_minute || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Tempo Médio</span>
              <span className="text-sm">{metrics?.average_response_time?.toFixed(0) || 0}ms</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Taxa de Cache</span>
              <span className="text-sm">{metrics?.cache_hit_rate?.toFixed(1) || 0}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Erros</span>
              <span className="text-sm text-red-600">{metrics?.error_count || 0}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gráfico de Performance</CardTitle>
          <CardDescription>
            Métricas ao longo do tempo (simulado)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            Gráfico de performance em tempo real será implementado aqui
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Componente de métricas de performance
function PerformanceMetrics({ metrics }: { metrics: any }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Requisições</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.requests_per_minute || 0}</div>
            <p className="text-xs text-muted-foreground">por minuto</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Tempo de Resposta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.average_response_time?.toFixed(0) || 0}ms</div>
            <p className="text-xs text-muted-foreground">média</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Taxa de Cache</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.cache_hit_rate?.toFixed(1) || 0}%</div>
            <p className="text-xs text-muted-foreground">hit rate</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Métricas Detalhadas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Usuários Ativos</span>
                <span>{metrics?.active_users || 0}</span>
              </div>
              <Progress value={(metrics?.active_users || 0) / 10} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Conexões BD</span>
                <span>{metrics?.database_connections || 0}/100</span>
              </div>
              <Progress value={(metrics?.database_connections || 0)} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Uso de Banda</span>
                <span>{metrics?.bandwidth_usage?.toFixed(1) || 0} Mbps</span>
              </div>
              <Progress value={(metrics?.bandwidth_usage || 0)} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Armazenamento</span>
                <span>{metrics?.storage_usage?.toFixed(1) || 0} GB</span>
              </div>
              <Progress value={(metrics?.storage_usage || 0) / 10} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Componente de logs do sistema
function SystemLogs({ 
  logs, 
  isLoading, 
  selectedLevel, 
  onLevelChange 
}: { 
  logs: any[]; 
  isLoading: boolean;
  selectedLevel: string;
  onLevelChange: (level: string) => void;
}) {
  const getLevelBadge = (level: string) => {
    const variants = {
      info: { variant: 'default' as const, color: 'text-blue-600' },
      warning: { variant: 'secondary' as const, color: 'text-yellow-600' },
      error: { variant: 'destructive' as const, color: 'text-red-600' },
      critical: { variant: 'destructive' as const, color: 'text-red-800' },
    };

    const config = variants[level as keyof typeof variants] || variants.info;

    return (
      <Badge variant={config.variant} className={config.color}>
        {level.toUpperCase()}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Logs do Sistema</CardTitle>
            <CardDescription>
              Histórico de eventos e atividades do sistema
            </CardDescription>
          </div>
          <Select value={selectedLevel} onValueChange={onLevelChange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Nível" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="error">Error</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {logs.map((log) => (
              <div key={log.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                <div className="flex-shrink-0">
                  {getLevelBadge(log.level)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{log.message}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(log.created_at).toLocaleString('pt-BR')}
                  </p>
                  {log.details && (
                    <details className="mt-2">
                      <summary className="text-xs text-muted-foreground cursor-pointer">
                        Detalhes
                      </summary>
                      <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-auto">
                        {JSON.stringify(log.details, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {logs.length === 0 && !isLoading && (
          <div className="text-center py-8">
            <Activity className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-semibold">Nenhum log encontrado</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Não há logs para o filtro selecionado.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Componente de alertas do sistema
function SystemAlerts({ 
  alerts, 
  isLoading, 
  selectedType, 
  onTypeChange,
  onResolveAlert
}: { 
  alerts: any[]; 
  isLoading: boolean;
  selectedType: string;
  onTypeChange: (type: string) => void;
  onResolveAlert: (data: { alertId: string; resolvedBy: string }) => void;
}) {
  const getSeverityBadge = (severity: string) => {
    const variants = {
      low: { variant: 'outline' as const, color: 'text-green-600' },
      medium: { variant: 'secondary' as const, color: 'text-yellow-600' },
      high: { variant: 'destructive' as const, color: 'text-orange-600' },
      critical: { variant: 'destructive' as const, color: 'text-red-600' },
    };

    const config = variants[severity as keyof typeof variants] || variants.low;

    return (
      <Badge variant={config.variant} className={config.color}>
        {severity.toUpperCase()}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: { variant: 'destructive' as const, icon: AlertTriangle },
      acknowledged: { variant: 'secondary' as const, icon: Eye },
      resolved: { variant: 'default' as const, icon: CheckCircle },
    };

    const config = variants[status as keyof typeof variants] || variants.active;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {status === 'active' && 'Ativo'}
        {status === 'acknowledged' && 'Reconhecido'}
        {status === 'resolved' && 'Resolvido'}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Alertas do Sistema</CardTitle>
            <CardDescription>
              Alertas e notificações de segurança e performance
            </CardDescription>
          </div>
          <Select value={selectedType} onValueChange={onTypeChange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="performance">Performance</SelectItem>
              <SelectItem value="security">Segurança</SelectItem>
              <SelectItem value="error">Erro</SelectItem>
              <SelectItem value="system">Sistema</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-start space-x-3 p-4 border rounded-lg">
                <div className="flex-shrink-0 space-y-1">
                  {getSeverityBadge(alert.severity)}
                  {getStatusBadge(alert.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium">{alert.title}</h4>
                  <p className="text-sm text-muted-foreground">{alert.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(alert.created_at).toLocaleString('pt-BR')}
                  </p>
                </div>
                {alert.status === 'active' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onResolveAlert({ alertId: alert.id, resolvedBy: 'admin' })}
                  >
                    Resolver
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}

        {alerts.length === 0 && !isLoading && (
          <div className="text-center py-8">
            <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
            <h3 className="mt-2 text-sm font-semibold">Nenhum alerta ativo</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Todos os sistemas estão funcionando normalmente.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Componente de monitoramento de recursos
function ResourceMonitoring({ health, metrics }: { health: any; metrics: any }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CPU</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{health?.cpu_usage?.toFixed(1) || 0}%</div>
            <Progress value={health?.cpu_usage || 0} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memória</CardTitle>
            <Memory className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{health?.memory_usage?.toFixed(1) || 0}%</div>
            <Progress value={health?.memory_usage || 0} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disco</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{health?.disk_usage?.toFixed(1) || 0}%</div>
            <Progress value={health?.disk_usage || 0} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rede</CardTitle>
            <Wifi className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.bandwidth_usage?.toFixed(1) || 0} Mbps</div>
            <Progress value={(metrics?.bandwidth_usage || 0) / 100 * 100} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Recursos</CardTitle>
          <CardDescription>
            Uso de recursos ao longo do tempo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            Gráfico de histórico de recursos será implementado aqui
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default SystemMonitoring;

