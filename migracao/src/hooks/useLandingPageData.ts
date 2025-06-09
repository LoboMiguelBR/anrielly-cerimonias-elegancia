
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface LandingPageTemplate {
  id: string;
  tenant_id: string;
  slug: string;
  name: string;
  sections: any;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useLandingPageData = (slug?: string) => {
  const [template, setTemplate] = useState<LandingPageTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTemplate = async () => {
      if (!slug) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('landing_page_templates')
          .select('*')
          .eq('slug', slug)
          .eq('is_active', true)
          .maybeSingle();

        if (error) throw error;

        setTemplate(data);
      } catch (err) {
        console.error('Erro ao buscar template:', err);
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();
  }, [slug]);

  return { template, loading, error };
};
