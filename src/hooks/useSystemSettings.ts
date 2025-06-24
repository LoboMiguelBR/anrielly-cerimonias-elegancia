
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface SystemSetting {
  id: string;
  key: string;
  value: any;
  description?: string;
  created_at: string;
  updated_at: string;
}

export const useSystemSettings = () => {
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      // Verificar se o usuário está autenticado
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Erro na sessão:', sessionError);
        toast.error('Erro de autenticação. Faça login novamente.');
        setLoading(false);
        return;
      }

      if (!session) {
        console.warn('Usuário não autenticado');
        toast.error('Você precisa estar logado para acessar as configurações.');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .order('key', { ascending: true });

      if (error) {
        console.error('Erro ao carregar configurações:', error);
        if (error.message.includes('auth')) {
          toast.error('Erro de autenticação: ' + error.message);
        } else {
          toast.error('Erro ao carregar configurações: ' + error.message);
        }
        setLoading(false);
        return;
      }
      
      setSettings(data || []);
    } catch (error: any) {
      console.error('Erro inesperado:', error);
      toast.error('Erro inesperado ao carregar configurações');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchSettings(); 
  }, []);

  const upsertSetting = async (key: string, value: any, description?: string) => {
    try {
      // Verificar autenticação antes de tentar salvar
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Você precisa estar logado para salvar configurações');
      }

      const { data, error } = await supabase
        .from('system_settings')
        .upsert([{ key, value, description }])
        .select()
        .single();

      if (error) {
        console.error('Erro ao salvar configuração:', error);
        throw new Error('Erro ao salvar configuração: ' + error.message);
      }
      
      await fetchSettings();
      toast.success('Configuração salva com sucesso!');
      return data;
    } catch (error: any) {
      console.error('Erro ao salvar configuração:', error);
      throw error;
    }
  };

  return { settings, loading, fetchSettings, upsertSetting };
};
