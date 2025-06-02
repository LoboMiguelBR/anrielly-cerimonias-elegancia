
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface AppSetting {
  id: string;
  category: string;
  key: string;
  value: any;
  description?: string;
  created_at: string;
  updated_at: string;
}

export const useAppSettings = () => {
  const [settings, setSettings] = useState<AppSetting[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('app_settings')
        .select('*')
        .order('category', { ascending: true });

      if (error) throw error;
      setSettings(data || []);
    } catch (err: any) {
      console.error('Error fetching settings:', err);
      toast.error('Erro ao carregar configurações');
    } finally {
      setIsLoading(false);
    }
  };

  const updateSetting = async (category: string, key: string, value: any) => {
    try {
      const { data, error } = await supabase
        .from('app_settings')
        .upsert({
          category,
          key,
          value,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      setSettings(prev => {
        const index = prev.findIndex(s => s.category === category && s.key === key);
        if (index >= 0) {
          const updated = [...prev];
          updated[index] = data;
          return updated;
        } else {
          return [...prev, data];
        }
      });

      toast.success('Configuração atualizada com sucesso!');
      return data;
    } catch (err: any) {
      console.error('Error updating setting:', err);
      toast.error('Erro ao atualizar configuração');
      throw err;
    }
  };

  const getSetting = (category: string, key: string) => {
    const setting = settings.find(s => s.category === category && s.key === key);
    return setting?.value;
  };

  const getSettingsByCategory = (category: string) => {
    return settings.filter(s => s.category === category);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    isLoading,
    fetchSettings,
    updateSetting,
    getSetting,
    getSettingsByCategory
  };
};
