
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ClientEnhanced {
  id: string;
  name: string;
  email: string;
  phone: string;
  event_type: string;
  event_date?: string;
  event_location?: string;
  status: 'ativo' | 'inativo' | 'lead' | 'convertido';
  budget_range?: string;
  partner_name?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip_code?: string;
  };
  preferences?: {
    communication_method?: 'email' | 'phone' | 'whatsapp';
    best_time_to_contact?: string;
    notes?: string;
  };
  tags?: string[];
  interactions_count?: number;
  last_interaction?: string;
  conversion_date?: string;
  lifetime_value?: number;
  created_at: string;
  updated_at: string;
}

export interface ClientStats {
  total_clients: number;
  active_clients: number;
  leads: number;
  converted_this_month: number;
  average_lifetime_value: number;
  retention_rate: number;
}

export interface ClientFilters {
  status?: string[];
  event_type?: string[];
  budget_range?: string[];
  date_range?: {
    start: string;
    end: string;
  };
  tags?: string[];
  search_query?: string;
}

export const useClientsEnhanced = () => {
  const [clients, setClients] = useState<ClientEnhanced[]>([]);
  const [stats, setStats] = useState<ClientStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<ClientFilters>({});

  const fetchClients = async (currentFilters?: ClientFilters) => {
    try {
      setLoading(true);
      let query = supabase
        .from('clientes')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply filters
      const activeFilters = currentFilters || filters;
      
      if (activeFilters.status?.length) {
        query = query.in('status', activeFilters.status);
      }
      
      if (activeFilters.event_type?.length) {
        query = query.in('event_type', activeFilters.event_type);
      }
      
      if (activeFilters.search_query) {
        query = query.or(`name.ilike.%${activeFilters.search_query}%,email.ilike.%${activeFilters.search_query}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Transform data to enhanced format
      const enhancedClients: ClientEnhanced[] = (data || []).map(client => ({
        id: client.id,
        name: client.name,
        email: client.email,
        phone: client.phone,
        event_type: client.event_type,
        event_date: client.event_date,
        event_location: client.event_location,
        status: client.status as 'ativo' | 'inativo' | 'lead' | 'convertido',
        budget_range: client.budget_range,
        partner_name: client.partner_name,
        address: client.address || {},
        preferences: client.preferences || {},
        tags: [], // Will be populated from tags relations
        interactions_count: 0, // Will be calculated
        created_at: client.created_at,
        updated_at: client.updated_at,
      }));

      setClients(enhancedClients);
    } catch (error: any) {
      console.error('Erro ao buscar clientes:', error);
      toast.error('Erro ao carregar clientes');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data: clientsData } = await supabase
        .from('clientes')
        .select('status, created_at, budget_range');

      if (clientsData) {
        const now = new Date();
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        
        const stats: ClientStats = {
          total_clients: clientsData.length,
          active_clients: clientsData.filter(c => c.status === 'ativo').length,
          leads: clientsData.filter(c => c.status === 'lead').length,
          converted_this_month: clientsData.filter(c => 
            c.status === 'convertido' && 
            new Date(c.created_at) >= thisMonth
          ).length,
          average_lifetime_value: 0, // Calculate based on contracts
          retention_rate: 0, // Calculate based on repeat customers
        };
        
        setStats(stats);
      }
    } catch (error: any) {
      console.error('Erro ao buscar estatísticas:', error);
    }
  };

  const createClient = async (clientData: Partial<ClientEnhanced>) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('clientes')
        .insert([{
          name: clientData.name,
          email: clientData.email,
          phone: clientData.phone,
          event_type: clientData.event_type,
          event_date: clientData.event_date,
          event_location: clientData.event_location,
          status: clientData.status || 'ativo',
          budget_range: clientData.budget_range,
          partner_name: clientData.partner_name,
          address: clientData.address,
          preferences: clientData.preferences,
        }])
        .select()
        .single();

      if (error) throw error;

      toast.success('Cliente criado com sucesso!');
      await fetchClients();
      return data;
    } catch (error: any) {
      console.error('Erro ao criar cliente:', error);
      toast.error('Erro ao criar cliente');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateClient = async (id: string, updates: Partial<ClientEnhanced>) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('clientes')
        .update({
          name: updates.name,
          email: updates.email,
          phone: updates.phone,
          event_type: updates.event_type,
          event_date: updates.event_date,
          event_location: updates.event_location,
          status: updates.status,
          budget_range: updates.budget_range,
          partner_name: updates.partner_name,
          address: updates.address,
          preferences: updates.preferences,
        })
        .eq('id', id);

      if (error) throw error;

      toast.success('Cliente atualizado com sucesso!');
      await fetchClients();
    } catch (error: any) {
      console.error('Erro ao atualizar cliente:', error);
      toast.error('Erro ao atualizar cliente');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteClient = async (id: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('clientes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Cliente removido com sucesso!');
      await fetchClients();
    } catch (error: any) {
      console.error('Erro ao remover cliente:', error);
      toast.error('Erro ao remover cliente');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const convertLeadToClient = async (id: string) => {
    try {
      await updateClient(id, { status: 'convertido' });
      toast.success('Lead convertido em cliente!');
    } catch (error) {
      toast.error('Erro ao converter lead');
    }
  };

  const applyFilters = (newFilters: ClientFilters) => {
    setFilters(newFilters);
    fetchClients(newFilters);
  };

  const exportClients = async (format: 'csv' | 'excel' = 'csv') => {
    try {
      // Implementation for export functionality
      toast.success('Funcionalidade de exportação será implementada em breve');
    } catch (error) {
      toast.error('Erro ao exportar clientes');
    }
  };

  useEffect(() => {
    fetchClients();
    fetchStats();
  }, []);

  return {
    clients,
    stats,
    loading,
    filters,
    fetchClients,
    createClient,
    updateClient,
    deleteClient,
    convertLeadToClient,
    applyFilters,
    exportClients,
    refetch: () => {
      fetchClients();
      fetchStats();
    }
  };
};
