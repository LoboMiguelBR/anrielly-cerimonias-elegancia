
import { useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCache } from './useCache';

export const useOptimizedQueries = () => {
  const { getCache, setCache } = useCache();

  // Optimized dashboard query with selective fields and proper joins
  const fetchDashboardData = useCallback(async () => {
    const cacheKey = 'dashboard_data';
    const cached = await getCache(cacheKey);
    
    if (cached) return cached;

    try {
      // Parallel queries for better performance
      const [eventsResult, proposalsResult, contractsResult, clientsResult] = await Promise.all([
        supabase
          .from('events')
          .select('id, status, date, type')
          .gte('date', new Date().toISOString().split('T')[0])
          .limit(10),
        
        supabase
          .from('proposals')
          .select('id, status, total_price, created_at')
          .order('created_at', { ascending: false })
          .limit(5),
        
        supabase
          .from('contracts')
          .select('id, status, total_price, created_at')
          .order('created_at', { ascending: false })
          .limit(5),
        
        supabase
          .from('clientes')
          .select('id, name, status, created_at')
          .order('created_at', { ascending: false })
          .limit(10)
      ]);

      const dashboardData = {
        upcomingEvents: eventsResult.data || [],
        recentProposals: proposalsResult.data || [],
        recentContracts: contractsResult.data || [],
        recentClients: clientsResult.data || [],
        timestamp: new Date().toISOString()
      };

      await setCache(cacheKey, dashboardData, 180); // 3 minutes cache
      return dashboardData;
    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
      throw error;
    }
  }, [getCache, setCache]);

  // Optimized events query with proper indexing
  const fetchOptimizedEvents = useCallback(async (filters = {}) => {
    const cacheKey = `events_optimized_${JSON.stringify(filters)}`;
    const cached = await getCache(cacheKey);
    
    if (cached) return cached;

    try {
      let query = supabase
        .from('events')
        .select(`
          id,
          type,
          date,
          location,
          status,
          client_id,
          cerimonialista_id,
          description,
          created_at
        `)
        .order('date', { ascending: false });

      const { data, error } = await query.limit(50);
      
      if (error) throw error;

      await setCache(cacheKey, data, 300); // 5 minutes cache
      return data;
    } catch (error) {
      console.error('Erro ao buscar eventos otimizados:', error);
      throw error;
    }
  }, [getCache, setCache]);

  // Optimized clients query with pagination
  const fetchOptimizedClients = useCallback(async (page = 0, pageSize = 20) => {
    const cacheKey = `clients_page_${page}_${pageSize}`;
    const cached = await getCache(cacheKey);
    
    if (cached) return cached;

    try {
      const from = page * pageSize;
      const to = from + pageSize - 1;

      const { data, error, count } = await supabase
        .from('clientes')
        .select(`
          id,
          name,
          email,
          phone,
          event_type,
          event_date,
          status,
          created_at
        `, { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      const result = {
        data: data || [],
        count: count || 0,
        page,
        pageSize,
        totalPages: Math.ceil((count || 0) / pageSize)
      };

      await setCache(cacheKey, result, 300); // 5 minutes cache
      return result;
    } catch (error) {
      console.error('Erro ao buscar clientes otimizados:', error);
      throw error;
    }
  }, [getCache, setCache]);

  // Batch operations for better performance - corrigido para usar tipo específico
  const batchUpdate = useCallback(async (
    tableName: 'suppliers' | 'clientes' | 'events' | 'contracts' | 'proposals',
    updates: Array<{ id: string; data: any }>
  ) => {
    try {
      const promises = updates.map(({ id, data }) =>
        supabase.from(tableName).update(data).eq('id', id)
      );

      const results = await Promise.allSettled(promises);
      
      const successful = results.filter(result => result.status === 'fulfilled').length;
      const failed = results.filter(result => result.status === 'rejected').length;

      return { successful, failed, total: updates.length };
    } catch (error) {
      console.error('Erro em operação em lote:', error);
      throw error;
    }
  }, []);

  return {
    fetchDashboardData,
    fetchOptimizedEvents,
    fetchOptimizedClients,
    batchUpdate
  };
};
