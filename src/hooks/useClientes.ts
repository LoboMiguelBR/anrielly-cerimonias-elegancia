
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Cliente {
  id: string;
  name: string;
  email: string;
  phone: string;
  event_type: string;
  event_date?: string;
  event_location?: string;
  message?: string;
  status?: string;
  tags?: string[];
  historical_interactions?: any[];
  created_at: string;
  updated_at: string;
}

export const useClientes = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClientes = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Erro ao carregar clientes: ' + error.message);
      setLoading(false);
      return;
    }
    setClientes(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchClientes(); }, [fetchClientes]);

  const addCliente = async (data: Partial<Cliente>) => {
    const { data: created, error } = await supabase
      .from('clientes')
      .insert([data])
      .select()
      .single();

    if (error) {
      toast.error('Erro ao adicionar cliente: ' + error.message);
      throw error;
    }
    setClientes(prev => [created, ...prev]);
    toast.success('Cliente cadastrado com sucesso!');
    return created;
  };

  const updateCliente = async (id: string, updates: Partial<Cliente>) => {
    const { data: updated, error } = await supabase
      .from('clientes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      toast.error('Erro ao atualizar cliente: ' + error.message);
      throw error;
    }
    setClientes(prev => prev.map(cli => cli.id === id ? updated : cli));
    toast.success('Cliente atualizado!');
    return updated;
  };

  const deleteCliente = async (id: string) => {
    const { error } = await supabase
      .from('clientes')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Erro ao deletar cliente: ' + error.message);
      throw error;
    }
    setClientes(prev => prev.filter(cli => cli.id !== id));
    toast.success('Cliente removido!');
  };

  return {
    clientes,
    loading,
    fetchClientes,
    addCliente,
    updateCliente,
    deleteCliente,
  }
};
