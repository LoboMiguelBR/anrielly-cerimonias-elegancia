
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { LandingPageTemplate } from './useLandingPageData';

export const useLandingPageTemplates = () => {
  const [templates, setTemplates] = useState<LandingPageTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('landing_page_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setTemplates(data || []);
    } catch (err) {
      console.error('Erro ao buscar templates:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  return {
    templates,
    loading,
    error,
    refetch: fetchTemplates
  };
};
