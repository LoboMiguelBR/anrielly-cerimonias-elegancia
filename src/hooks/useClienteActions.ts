
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Cliente } from './useClientes';

export const useClienteActions = () => {
  const [loading, setLoading] = useState(false);

  const createCliente = async (clienteData: Omit<Cliente, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('clientes')
        .insert([clienteData]);

      if (error) throw error;

      toast.success('Cliente criado com sucesso!');
      return true;
    } catch (err) {
      console.error('Erro ao criar cliente:', err);
      toast.error('Erro ao criar cliente');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateCliente = async (id: string, data: Partial<Cliente>) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('clientes')
        .update(data)
        .eq('id', id);

      if (error) throw error;

      toast.success('Cliente atualizado com sucesso!');
      return true;
    } catch (err) {
      console.error('Erro ao atualizar cliente:', err);
      toast.error('Erro ao atualizar cliente');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteCliente = async (id: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('clientes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Cliente deletado com sucesso!');
      return true;
    } catch (err) {
      console.error('Erro ao deletar cliente:', err);
      toast.error('Erro ao deletar cliente');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    createCliente,
    updateCliente,
    deleteCliente,
    loading
  };
};
