
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Database } from '@/integrations/supabase/types';

// Use the types from Supabase Database
type ClientRow = Database['public']['Tables']['clientes']['Row'];
type ClientInsert = Database['public']['Tables']['clientes']['Insert'];
type ClientUpdate = Database['public']['Tables']['clientes']['Update'];

export interface Client extends ClientRow {}

export interface ClientTag {
  id: string;
  name: string;
  color: string;
  description?: string;
  created_at: string;
}

export interface ClientInteraction {
  id: string;
  client_id: string;
  interaction_type: 'call' | 'email' | 'meeting' | 'whatsapp' | 'note';
  subject?: string;
  description?: string;
  scheduled_date?: string;
  completed_at?: string;
  status: 'pending' | 'completed' | 'cancelled';
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClients(data || []);
    } catch (err: any) {
      console.error('Error fetching clients:', err);
      setError(err.message);
      toast.error('Erro ao carregar clientes');
    } finally {
      setIsLoading(false);
    }
  };

  const addClient = async (clientData: ClientInsert) => {
    try {
      const { data, error } = await supabase
        .from('clientes')
        .insert([clientData])
        .select()
        .single();

      if (error) throw error;
      
      setClients(prev => [data, ...prev]);
      toast.success('Cliente adicionado com sucesso!');
      return data;
    } catch (err: any) {
      console.error('Error adding client:', err);
      toast.error('Erro ao adicionar cliente');
      throw err;
    }
  };

  const updateClient = async (id: string, updates: ClientUpdate) => {
    try {
      const { data, error } = await supabase
        .from('clientes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setClients(prev => prev.map(client => 
        client.id === id ? { ...client, ...data } : client
      ));
      toast.success('Cliente atualizado com sucesso!');
      return data;
    } catch (err: any) {
      console.error('Error updating client:', err);
      toast.error('Erro ao atualizar cliente');
      throw err;
    }
  };

  const deleteClient = async (id: string) => {
    try {
      const { error } = await supabase
        .from('clientes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setClients(prev => prev.filter(client => client.id !== id));
      toast.success('Cliente removido com sucesso!');
    } catch (err: any) {
      console.error('Error deleting client:', err);
      toast.error('Erro ao remover cliente');
      throw err;
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return {
    clients,
    isLoading,
    error,
    fetchClients,
    addClient,
    updateClient,
    deleteClient,
    refetch: fetchClients
  };
};
