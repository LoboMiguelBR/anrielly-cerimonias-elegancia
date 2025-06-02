
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface WebsiteTheme {
  id: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  title_font: string;
  body_font: string;
  created_at: string;
  updated_at: string;
}

export const useWebsiteTheme = () => {
  const [theme, setTheme] = useState<WebsiteTheme | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTheme = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('website_theme_settings')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      setTheme(data);
    } catch (err: any) {
      console.error('Error fetching theme:', err);
      toast.error('Erro ao carregar configurações de tema');
    } finally {
      setIsLoading(false);
    }
  };

  const updateTheme = async (updates: Partial<Omit<WebsiteTheme, 'id' | 'created_at' | 'updated_at'>>) => {
    try {
      if (!theme) {
        // Criar novo tema se não existir
        const { data, error } = await supabase
          .from('website_theme_settings')
          .insert([updates])
          .select()
          .single();

        if (error) throw error;
        setTheme(data);
      } else {
        // Atualizar tema existente
        const { data, error } = await supabase
          .from('website_theme_settings')
          .update(updates)
          .eq('id', theme.id)
          .select()
          .single();

        if (error) throw error;
        setTheme(data);
      }
      
      toast.success('Tema atualizado com sucesso!');
    } catch (err: any) {
      console.error('Error updating theme:', err);
      toast.error('Erro ao atualizar tema');
      throw err;
    }
  };

  useEffect(() => {
    fetchTheme();
  }, []);

  return {
    theme,
    isLoading,
    fetchTheme,
    updateTheme
  };
};
