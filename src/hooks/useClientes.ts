
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

function parseCliente(raw: any): Cliente {
  return {
    id: raw.id,
    name: raw.name,
    email: raw.email,
    phone: raw.phone,
    event_type: raw.event_type,
    event_date: raw.event_date ?? undefined,
    event_location: raw.event_location ?? undefined,
    message: raw.message ?? undefined,
    status: raw.status ?? undefined,
    tags: Array.isArray(raw.tags) ? raw.tags : (typeof raw.tags === 'string' ? JSON.parse(raw.tags) : []),
    historical_interactions: Array.isArray(raw.historical_interactions)
      ? raw.historical_interactions
      : (typeof raw.historical_interactions === 'string'
        ? JSON.parse(raw.historical_interactions)
        : []),
    created_at: raw.created_at,
    updated_at: raw.updated_at,
  };
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
    setClientes((data || []).map(parseCliente));
    setLoading(false);
  }, []);

  useEffect(() => { fetchClientes(); }, [fetchClientes]);

  const addCliente = async (input: Partial<Cliente>) => {
    if (!input.name || !input.email || !input.phone || !input.event_type) {
      toast.error('Preencha todos os campos obrigatórios: nome, email, telefone, tipo do evento');
      throw new Error("Campos obrigatórios ausentes");
    }

    const insertObj = {
      name: input.name,
      email: input.email,
      phone: input.phone,
      event_type: input.event_type,
      event_date: input.event_date,
      event_location: input.event_location,
      message: input.message,
      status: input.status,
      tags: input.tags ?? [],
      historical_interactions: input.historical_interactions ?? [],
    };

    const { data, error } = await supabase
      .from('clientes')
      .insert([insertObj])
      .select();

    if (error) {
      toast.error('Erro ao adicionar cliente: ' + error.message);
      throw error;
    }
    setClientes(prev => [...(data || []).map(parseCliente), ...prev]);
    toast.success('Cliente cadastrado com sucesso!');
    return data ? parseCliente(data[0]) : null;
  };

  const updateCliente = async (id: string, updates: Partial<Cliente>) => {
    const updateObj = {
      ...updates,
      tags: updates.tags ?? [],
      historical_interactions: updates.historical_interactions ?? [],
    };

    const { data, error } = await supabase
      .from('clientes')
      .update(updateObj)
      .eq('id', id)
      .select();

    if (error) {
      toast.error('Erro ao atualizar cliente: ' + error.message);
      throw error;
    }
    setClientes(prev =>
      prev.map(cli => cli.id === id ? parseCliente((data && data[0]) ?? cli) : cli)
    );
    toast.success('Cliente atualizado!');
    return data ? parseCliente(data[0]) : null;
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
