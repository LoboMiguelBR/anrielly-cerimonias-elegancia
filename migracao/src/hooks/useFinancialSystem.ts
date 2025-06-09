import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Tipos para sistema financeiro
export interface FinancialOverview {
  total_revenue: number;
  monthly_revenue: number;
  annual_revenue: number;
  revenue_growth: number;
  active_subscriptions: number;
  trial_subscriptions: number;
  cancelled_subscriptions: number;
  churn_rate: number;
  average_revenue_per_user: number;
  lifetime_value: number;
  conversion_rate: number;
}

export interface RevenueData {
  date: string;
  revenue: number;
  subscriptions: number;
  new_customers: number;
  churned_customers: number;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'monthly' | 'yearly';
  features: string[];
  limits: {
    users: number;
    events: number;
    storage_gb: number;
    suppliers: number;
  };
  is_active: boolean;
  created_at: string;
}

export interface TenantSubscription {
  id: string;
  tenant_id: string;
  plan_id: string;
  status: 'active' | 'trialing' | 'past_due' | 'cancelled' | 'unpaid';
  current_period_start: string;
  current_period_end: string;
  trial_start?: string;
  trial_end?: string;
  cancelled_at?: string;
  created_at: string;
  updated_at: string;
  tenant?: {
    name: string;
    slug: string;
  };
  plan?: SubscriptionPlan;
}

export interface Payment {
  id: string;
  tenant_id: string;
  subscription_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed' | 'refunded';
  payment_method: string;
  description: string;
  invoice_url?: string;
  created_at: string;
  tenant?: {
    name: string;
    slug: string;
  };
}

export interface Invoice {
  id: string;
  tenant_id: string;
  subscription_id: string;
  amount_due: number;
  amount_paid: number;
  currency: string;
  status: 'draft' | 'open' | 'paid' | 'void' | 'uncollectible';
  due_date: string;
  paid_at?: string;
  invoice_pdf?: string;
  created_at: string;
  tenant?: {
    name: string;
    slug: string;
  };
}

// Query keys
export const financialKeys = {
  all: ['financial'] as const,
  overview: () => [...financialKeys.all, 'overview'] as const,
  revenue: () => [...financialKeys.all, 'revenue'] as const,
  subscriptions: () => [...financialKeys.all, 'subscriptions'] as const,
  payments: () => [...financialKeys.all, 'payments'] as const,
  invoices: () => [...financialKeys.all, 'invoices'] as const,
  plans: () => [...financialKeys.all, 'plans'] as const,
};

// Serviços financeiros
class FinancialService {
  static async getFinancialOverview(): Promise<FinancialOverview> {
    // Buscar dados de assinaturas
    const { data: subscriptions, error: subsError } = await supabase
      .from('tenant_subscriptions')
      .select(`
        *,
        plan:subscription_plans(price, interval),
        tenant:tenants(created_at)
      `);

    if (subsError) {
      console.error('Erro ao buscar assinaturas:', subsError);
      return this.getMockFinancialOverview();
    }

    // Buscar dados de pagamentos
    const { data: payments, error: paymentsError } = await supabase
      .from('payments')
      .select('amount, status, created_at')
      .eq('status', 'succeeded');

    if (paymentsError) {
      console.error('Erro ao buscar pagamentos:', paymentsError);
    }

    // Calcular métricas
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const thisYear = new Date(now.getFullYear(), 0, 1);

    const totalRevenue = payments?.reduce((sum, p) => sum + p.amount, 0) || 0;
    const monthlyRevenue = payments?.filter(p => new Date(p.created_at) >= thisMonth)
      .reduce((sum, p) => sum + p.amount, 0) || 0;
    const lastMonthRevenue = payments?.filter(p => {
      const date = new Date(p.created_at);
      return date >= lastMonth && date < thisMonth;
    }).reduce((sum, p) => sum + p.amount, 0) || 0;
    const annualRevenue = payments?.filter(p => new Date(p.created_at) >= thisYear)
      .reduce((sum, p) => sum + p.amount, 0) || 0;

    const activeSubscriptions = subscriptions?.filter(s => s.status === 'active').length || 0;
    const trialSubscriptions = subscriptions?.filter(s => s.status === 'trialing').length || 0;
    const cancelledSubscriptions = subscriptions?.filter(s => s.status === 'cancelled').length || 0;

    const revenueGrowth = lastMonthRevenue > 0 
      ? ((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
      : 0;

    const totalSubscriptions = subscriptions?.length || 1;
    const churnRate = (cancelledSubscriptions / totalSubscriptions) * 100;
    const arpu = totalRevenue / Math.max(activeSubscriptions, 1);

    return {
      total_revenue: totalRevenue,
      monthly_revenue: monthlyRevenue,
      annual_revenue: annualRevenue,
      revenue_growth: revenueGrowth,
      active_subscriptions: activeSubscriptions,
      trial_subscriptions: trialSubscriptions,
      cancelled_subscriptions: cancelledSubscriptions,
      churn_rate: churnRate,
      average_revenue_per_user: arpu,
      lifetime_value: arpu * 12, // Estimativa simples
      conversion_rate: activeSubscriptions / Math.max(trialSubscriptions + activeSubscriptions, 1) * 100,
    };
  }

  static async getRevenueData(period: 'week' | 'month' | 'year' = 'month'): Promise<RevenueData[]> {
    const now = new Date();
    let startDate: Date;
    let groupBy: string;

    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        groupBy = 'day';
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        groupBy = 'month';
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1);
        groupBy = 'month';
    }

    // Em produção, isso seria uma query SQL mais complexa
    // Por agora, retornar dados simulados
    return this.generateMockRevenueData(period);
  }

  static async getSubscriptions(filters?: {
    status?: string;
    plan_id?: string;
    limit?: number;
    offset?: number;
  }): Promise<TenantSubscription[]> {
    let query = supabase
      .from('tenant_subscriptions')
      .select(`
        *,
        tenant:tenants(name, slug),
        plan:subscription_plans(name, price, currency, interval)
      `);

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.plan_id) {
      query = query.eq('plan_id', filters.plan_id);
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
      console.error('Erro ao buscar assinaturas:', error);
      return this.generateMockSubscriptions();
    }

    return data as TenantSubscription[];
  }

  static async getPayments(filters?: {
    status?: string;
    tenant_id?: string;
    limit?: number;
    offset?: number;
  }): Promise<Payment[]> {
    let query = supabase
      .from('payments')
      .select(`
        *,
        tenant:tenants(name, slug)
      `);

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.tenant_id) {
      query = query.eq('tenant_id', filters.tenant_id);
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
      console.error('Erro ao buscar pagamentos:', error);
      return this.generateMockPayments();
    }

    return data as Payment[];
  }

  static async getInvoices(filters?: {
    status?: string;
    tenant_id?: string;
    limit?: number;
    offset?: number;
  }): Promise<Invoice[]> {
    let query = supabase
      .from('invoices')
      .select(`
        *,
        tenant:tenants(name, slug)
      `);

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.tenant_id) {
      query = query.eq('tenant_id', filters.tenant_id);
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
      console.error('Erro ao buscar faturas:', error);
      return this.generateMockInvoices();
    }

    return data as Invoice[];
  }

  static async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    const { data, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('is_active', true)
      .order('price', { ascending: true });

    if (error) {
      console.error('Erro ao buscar planos:', error);
      return this.getDefaultPlans();
    }

    return data as SubscriptionPlan[];
  }

  // Métodos auxiliares para dados simulados
  private static getMockFinancialOverview(): FinancialOverview {
    return {
      total_revenue: 125000,
      monthly_revenue: 15000,
      annual_revenue: 180000,
      revenue_growth: 12.5,
      active_subscriptions: 45,
      trial_subscriptions: 8,
      cancelled_subscriptions: 3,
      churn_rate: 6.25,
      average_revenue_per_user: 2777.78,
      lifetime_value: 33333.33,
      conversion_rate: 84.9,
    };
  }

  private static generateMockRevenueData(period: string): RevenueData[] {
    const data: RevenueData[] = [];
    const count = period === 'week' ? 7 : period === 'year' ? 12 : 12;

    for (let i = count - 1; i >= 0; i--) {
      const date = new Date();
      if (period === 'week') {
        date.setDate(date.getDate() - i);
      } else {
        date.setMonth(date.getMonth() - i);
      }

      data.push({
        date: date.toISOString().split('T')[0],
        revenue: Math.floor(Math.random() * 5000) + 10000,
        subscriptions: Math.floor(Math.random() * 10) + 40,
        new_customers: Math.floor(Math.random() * 5) + 2,
        churned_customers: Math.floor(Math.random() * 3),
      });
    }

    return data;
  }

  private static generateMockSubscriptions(): TenantSubscription[] {
    const statuses: TenantSubscription['status'][] = ['active', 'trialing', 'past_due', 'cancelled'];
    const plans = this.getDefaultPlans();

    return Array.from({ length: 20 }, (_, i) => ({
      id: `sub-${i}`,
      tenant_id: `tenant-${i}`,
      plan_id: plans[i % plans.length].id,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      current_period_start: new Date().toISOString(),
      current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
      tenant: {
        name: `Empresa ${i + 1}`,
        slug: `empresa-${i + 1}`,
      },
      plan: plans[i % plans.length],
    }));
  }

  private static generateMockPayments(): Payment[] {
    const statuses: Payment['status'][] = ['succeeded', 'pending', 'failed'];

    return Array.from({ length: 30 }, (_, i) => ({
      id: `pay-${i}`,
      tenant_id: `tenant-${i % 10}`,
      subscription_id: `sub-${i % 10}`,
      amount: Math.floor(Math.random() * 500) + 100,
      currency: 'BRL',
      status: statuses[Math.floor(Math.random() * statuses.length)],
      payment_method: 'card',
      description: `Pagamento da assinatura - Mês ${i + 1}`,
      created_at: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
      tenant: {
        name: `Empresa ${(i % 10) + 1}`,
        slug: `empresa-${(i % 10) + 1}`,
      },
    }));
  }

  private static generateMockInvoices(): Invoice[] {
    const statuses: Invoice['status'][] = ['paid', 'open', 'void'];

    return Array.from({ length: 25 }, (_, i) => ({
      id: `inv-${i}`,
      tenant_id: `tenant-${i % 10}`,
      subscription_id: `sub-${i % 10}`,
      amount_due: Math.floor(Math.random() * 500) + 100,
      amount_paid: Math.random() > 0.3 ? Math.floor(Math.random() * 500) + 100 : 0,
      currency: 'BRL',
      status: statuses[Math.floor(Math.random() * statuses.length)],
      due_date: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
      tenant: {
        name: `Empresa ${(i % 10) + 1}`,
        slug: `empresa-${(i % 10) + 1}`,
      },
    }));
  }

  private static getDefaultPlans(): SubscriptionPlan[] {
    return [
      {
        id: 'basic',
        name: 'Básico',
        price: 99,
        currency: 'BRL',
        interval: 'monthly',
        features: ['Até 10 usuários', 'Até 50 eventos', '5GB de armazenamento'],
        limits: { users: 10, events: 50, storage_gb: 5, suppliers: 50 },
        is_active: true,
        created_at: new Date().toISOString(),
      },
      {
        id: 'premium',
        name: 'Premium',
        price: 199,
        currency: 'BRL',
        interval: 'monthly',
        features: ['Até 50 usuários', 'Eventos ilimitados', '20GB de armazenamento', 'IA incluída'],
        limits: { users: 50, events: -1, storage_gb: 20, suppliers: 200 },
        is_active: true,
        created_at: new Date().toISOString(),
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        price: 399,
        currency: 'BRL',
        interval: 'monthly',
        features: ['Usuários ilimitados', 'Eventos ilimitados', '100GB de armazenamento', 'Suporte prioritário'],
        limits: { users: -1, events: -1, storage_gb: 100, suppliers: -1 },
        is_active: true,
        created_at: new Date().toISOString(),
      },
    ];
  }
}

// Hook para visão geral financeira
export function useFinancialOverview() {
  const {
    data: overview,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: financialKeys.overview(),
    queryFn: FinancialService.getFinancialOverview,
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchInterval: 10 * 60 * 1000, // Atualizar a cada 10 minutos
  });

  return {
    overview,
    isLoading,
    error,
    refetch,
  };
}

// Hook para dados de receita
export function useRevenueData(period: 'week' | 'month' | 'year' = 'month') {
  const {
    data: revenueData = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: [...financialKeys.revenue(), period],
    queryFn: () => FinancialService.getRevenueData(period),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  return {
    revenueData,
    isLoading,
    error,
    refetch,
  };
}

// Hook para assinaturas
export function useSubscriptions(filters?: {
  status?: string;
  plan_id?: string;
  limit?: number;
  offset?: number;
}) {
  const {
    data: subscriptions = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: [...financialKeys.subscriptions(), filters],
    queryFn: () => FinancialService.getSubscriptions(filters),
    staleTime: 2 * 60 * 1000, // 2 minutos
  });

  return {
    subscriptions,
    isLoading,
    error,
    refetch,
  };
}

// Hook para pagamentos
export function usePayments(filters?: {
  status?: string;
  tenant_id?: string;
  limit?: number;
  offset?: number;
}) {
  const {
    data: payments = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: [...financialKeys.payments(), filters],
    queryFn: () => FinancialService.getPayments(filters),
    staleTime: 2 * 60 * 1000, // 2 minutos
  });

  return {
    payments,
    isLoading,
    error,
    refetch,
  };
}

// Hook para faturas
export function useInvoices(filters?: {
  status?: string;
  tenant_id?: string;
  limit?: number;
  offset?: number;
}) {
  const {
    data: invoices = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: [...financialKeys.invoices(), filters],
    queryFn: () => FinancialService.getInvoices(filters),
    staleTime: 2 * 60 * 1000, // 2 minutos
  });

  return {
    invoices,
    isLoading,
    error,
    refetch,
  };
}

// Hook para planos de assinatura
export function useSubscriptionPlans() {
  const {
    data: plans = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: financialKeys.plans(),
    queryFn: FinancialService.getSubscriptionPlans,
    staleTime: 10 * 60 * 1000, // 10 minutos
  });

  return {
    plans,
    isLoading,
    error,
    refetch,
  };
}

export default useFinancialOverview;

