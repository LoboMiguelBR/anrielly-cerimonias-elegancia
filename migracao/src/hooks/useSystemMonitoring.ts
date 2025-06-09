import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Tipos para monitoramento
export interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical';
  uptime: number;
  response_time: number;
  error_rate: number;
  active_connections: number;
  memory_usage: number;
  cpu_usage: number;
  disk_usage: number;
  last_check: string;
}

export interface SystemMetrics {
  requests_per_minute: number;
  average_response_time: number;
  error_count: number;
  active_users: number;
  database_connections: number;
  cache_hit_rate: number;
  storage_usage: number;
  bandwidth_usage: number;
}

export interface SystemLog {
  id: string;
  level: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  details?: any;
  user_id?: string;
  tenant_id?: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface SystemAlert {
  id: string;
  type: 'performance' | 'security' | 'error' | 'system';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  status: 'active' | 'acknowledged' | 'resolved';
  created_at: string;
  resolved_at?: string;
  resolved_by?: string;
}

// Query keys
export const systemKeys = {
  all: ['system'] as const,
  health: () => [...systemKeys.all, 'health'] as const,
  metrics: () => [...systemKeys.all, 'metrics'] as const,
  logs: () => [...systemKeys.all, 'logs'] as const,
  alerts: () => [...systemKeys.all, 'alerts'] as const,
  analytics: () => [...systemKeys.all, 'analytics'] as const,
};

// Serviços de monitoramento
class SystemMonitoringService {
  static async getSystemHealth(): Promise<SystemHealth> {
    try {
      // Verificar conexão com banco
      const dbStart = performance.now();
      const { error: dbError } = await supabase
        .from('tenants')
        .select('count')
        .limit(1);
      const dbTime = performance.now() - dbStart;

      if (dbError) {
        return {
          status: 'critical',
          uptime: 0,
          response_time: dbTime,
          error_rate: 100,
          active_connections: 0,
          memory_usage: 0,
          cpu_usage: 0,
          disk_usage: 0,
          last_check: new Date().toISOString(),
        };
      }

      // Simular métricas do sistema (em produção, viria de APIs de monitoramento)
      const health: SystemHealth = {
        status: dbTime < 100 ? 'healthy' : dbTime < 500 ? 'warning' : 'critical',
        uptime: Date.now() - new Date('2024-01-01').getTime(),
        response_time: dbTime,
        error_rate: Math.random() * 5, // 0-5%
        active_connections: Math.floor(Math.random() * 100) + 50,
        memory_usage: Math.random() * 80 + 10, // 10-90%
        cpu_usage: Math.random() * 60 + 10, // 10-70%
        disk_usage: Math.random() * 50 + 20, // 20-70%
        last_check: new Date().toISOString(),
      };

      return health;
    } catch (error) {
      return {
        status: 'critical',
        uptime: 0,
        response_time: 0,
        error_rate: 100,
        active_connections: 0,
        memory_usage: 0,
        cpu_usage: 0,
        disk_usage: 0,
        last_check: new Date().toISOString(),
      };
    }
  }

  static async getSystemMetrics(): Promise<SystemMetrics> {
    // Em produção, essas métricas viriam de ferramentas como Prometheus, DataDog, etc.
    const metrics: SystemMetrics = {
      requests_per_minute: Math.floor(Math.random() * 1000) + 100,
      average_response_time: Math.random() * 200 + 50,
      error_count: Math.floor(Math.random() * 10),
      active_users: Math.floor(Math.random() * 500) + 50,
      database_connections: Math.floor(Math.random() * 50) + 10,
      cache_hit_rate: Math.random() * 20 + 80, // 80-100%
      storage_usage: Math.random() * 1000 + 500, // GB
      bandwidth_usage: Math.random() * 100 + 50, // Mbps
    };

    return metrics;
  }

  static async getSystemLogs(filters?: {
    level?: string;
    limit?: number;
    offset?: number;
    start_date?: string;
    end_date?: string;
  }): Promise<SystemLog[]> {
    let query = supabase
      .from('system_logs')
      .select('*');

    if (filters?.level) {
      query = query.eq('level', filters.level);
    }

    if (filters?.start_date) {
      query = query.gte('created_at', filters.start_date);
    }

    if (filters?.end_date) {
      query = query.lte('created_at', filters.end_date);
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    if (filters?.offset) {
      query = query.range(filters.offset, (filters.offset + (filters.limit || 50)) - 1);
    }

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
      // Se a tabela não existir, retornar logs simulados
      return this.generateMockLogs();
    }

    return data as SystemLog[];
  }

  static async getSystemAlerts(filters?: {
    status?: string;
    severity?: string;
    type?: string;
    limit?: number;
  }): Promise<SystemAlert[]> {
    let query = supabase
      .from('system_alerts')
      .select('*');

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.severity) {
      query = query.eq('severity', filters.severity);
    }

    if (filters?.type) {
      query = query.eq('type', filters.type);
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
      // Se a tabela não existir, retornar alertas simulados
      return this.generateMockAlerts();
    }

    return data as SystemAlert[];
  }

  static async createSystemLog(log: Omit<SystemLog, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('system_logs')
      .insert({
        ...log,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar log:', error);
      return null;
    }

    return data;
  }

  static async resolveAlert(alertId: string, resolvedBy: string) {
    const { data, error } = await supabase
      .from('system_alerts')
      .update({
        status: 'resolved',
        resolved_at: new Date().toISOString(),
        resolved_by: resolvedBy,
      })
      .eq('id', alertId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Métodos auxiliares para dados simulados
  private static generateMockLogs(): SystemLog[] {
    const levels: SystemLog['level'][] = ['info', 'warning', 'error', 'critical'];
    const messages = [
      'Sistema iniciado com sucesso',
      'Backup automático concluído',
      'Usuário logado no sistema',
      'Erro de conexão com banco de dados',
      'Limite de memória atingido',
      'Tentativa de acesso não autorizado',
      'Cache limpo automaticamente',
      'Novo tenant criado',
    ];

    return Array.from({ length: 50 }, (_, i) => ({
      id: `log-${i}`,
      level: levels[Math.floor(Math.random() * levels.length)],
      message: messages[Math.floor(Math.random() * messages.length)],
      details: { mock: true },
      created_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    }));
  }

  private static generateMockAlerts(): SystemAlert[] {
    const types: SystemAlert['type'][] = ['performance', 'security', 'error', 'system'];
    const severities: SystemAlert['severity'][] = ['low', 'medium', 'high', 'critical'];
    const statuses: SystemAlert['status'][] = ['active', 'acknowledged', 'resolved'];

    const alerts = [
      { title: 'Alto uso de CPU', message: 'CPU acima de 80% por mais de 5 minutos' },
      { title: 'Erro de banco de dados', message: 'Múltiplas falhas de conexão detectadas' },
      { title: 'Tentativa de invasão', message: 'Múltiplas tentativas de login falharam' },
      { title: 'Espaço em disco baixo', message: 'Menos de 10% de espaço disponível' },
      { title: 'Tempo de resposta alto', message: 'Tempo médio de resposta acima de 2s' },
    ];

    return alerts.map((alert, i) => ({
      id: `alert-${i}`,
      type: types[Math.floor(Math.random() * types.length)],
      severity: severities[Math.floor(Math.random() * severities.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      title: alert.title,
      message: alert.message,
      created_at: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
    }));
  }
}

// Hook para saúde do sistema
export function useSystemHealth() {
  const {
    data: health,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: systemKeys.health(),
    queryFn: SystemMonitoringService.getSystemHealth,
    staleTime: 30 * 1000, // 30 segundos
    refetchInterval: 60 * 1000, // Atualizar a cada minuto
  });

  return {
    health,
    isLoading,
    error,
    refetch,
  };
}

// Hook para métricas do sistema
export function useSystemMetrics() {
  const {
    data: metrics,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: systemKeys.metrics(),
    queryFn: SystemMonitoringService.getSystemMetrics,
    staleTime: 60 * 1000, // 1 minuto
    refetchInterval: 2 * 60 * 1000, // Atualizar a cada 2 minutos
  });

  return {
    metrics,
    isLoading,
    error,
    refetch,
  };
}

// Hook para logs do sistema
export function useSystemLogs(filters?: {
  level?: string;
  limit?: number;
  offset?: number;
  start_date?: string;
  end_date?: string;
}) {
  const {
    data: logs = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: [...systemKeys.logs(), filters],
    queryFn: () => SystemMonitoringService.getSystemLogs(filters),
    staleTime: 2 * 60 * 1000, // 2 minutos
  });

  return {
    logs,
    isLoading,
    error,
    refetch,
  };
}

// Hook para alertas do sistema
export function useSystemAlerts(filters?: {
  status?: string;
  severity?: string;
  type?: string;
  limit?: number;
}) {
  const queryClient = useQueryClient();

  const {
    data: alerts = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: [...systemKeys.alerts(), filters],
    queryFn: () => SystemMonitoringService.getSystemAlerts(filters),
    staleTime: 60 * 1000, // 1 minuto
    refetchInterval: 2 * 60 * 1000, // Atualizar a cada 2 minutos
  });

  const resolveMutation = useMutation({
    mutationFn: ({ alertId, resolvedBy }: { alertId: string; resolvedBy: string }) =>
      SystemMonitoringService.resolveAlert(alertId, resolvedBy),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: systemKeys.alerts() });
      toast.success('Alerta resolvido com sucesso!');
    },
    onError: (error: any) => {
      toast.error(`Erro ao resolver alerta: ${error.message}`);
    },
  });

  return {
    alerts,
    isLoading,
    error,
    refetch,
    resolveAlert: resolveMutation.mutate,
    isResolving: resolveMutation.isPending,
  };
}

// Hook para criar logs
export function useSystemLogger() {
  const queryClient = useQueryClient();

  const logMutation = useMutation({
    mutationFn: SystemMonitoringService.createSystemLog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: systemKeys.logs() });
    },
  });

  const log = {
    info: (message: string, details?: any) => {
      logMutation.mutate({ level: 'info', message, details });
    },
    warning: (message: string, details?: any) => {
      logMutation.mutate({ level: 'warning', message, details });
    },
    error: (message: string, details?: any) => {
      logMutation.mutate({ level: 'error', message, details });
    },
    critical: (message: string, details?: any) => {
      logMutation.mutate({ level: 'critical', message, details });
    },
  };

  return {
    log,
    isLogging: logMutation.isPending,
  };
}

export default useSystemHealth;

