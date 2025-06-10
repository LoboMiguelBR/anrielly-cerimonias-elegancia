
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useCache = () => {
  const [loading, setLoading] = useState(false);

  const getCache = async (key: string) => {
    try {
      setLoading(true);
      const response = await supabase.functions.invoke('cache', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        body: new URLSearchParams({ key }).toString()
      });

      if (response.error) throw response.error;

      const { cached, value } = response.data;
      return cached ? value : null;
    } catch (error: any) {
      console.error('Erro ao buscar cache:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const setCache = async (key: string, value: any, ttl = 3600) => {
    try {
      setLoading(true);
      const response = await supabase.functions.invoke('cache', {
        method: 'POST',
        body: { key, value, ttl }
      });

      if (response.error) throw response.error;

      return response.data.success;
    } catch (error: any) {
      console.error('Erro ao salvar cache:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteCache = async (key: string) => {
    try {
      setLoading(true);
      const response = await supabase.functions.invoke('cache', {
        method: 'DELETE',
        body: { key }
      });

      if (response.error) throw response.error;

      return response.data.success;
    } catch (error: any) {
      console.error('Erro ao deletar cache:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const cleanExpiredCache = async () => {
    try {
      setLoading(true);
      const response = await supabase.functions.invoke('cache', {
        method: 'POST',
        body: {},
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.error) throw response.error;

      return response.data.success;
    } catch (error: any) {
      console.error('Erro ao limpar cache:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    getCache,
    setCache,
    deleteCache,
    cleanExpiredCache
  };
};
