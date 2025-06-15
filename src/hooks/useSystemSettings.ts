
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
    const { data, error } = await supabase
      .from('system_settings')
      .select('*');

    if (error) {
      toast.error('Erro ao carregar configurações: ' + error.message);
      setLoading(false);
      return;
    }
    setSettings(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchSettings(); }, []);

  const upsertSetting = async (key: string, value: any, description?: string) => {
    const { data, error } = await supabase
      .from('system_settings')
      .upsert([{ key, value, description }])
      .select()
      .single();

    if (error) {
      toast.error('Erro ao salvar configuração: ' + error.message);
      throw error;
    }
    await fetchSettings();
    toast.success('Configuração salva!');
    return data;
  };

  return { settings, loading, fetchSettings, upsertSetting };
}
