
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface CMSLandingPage {
  id: string;
  title: string;
  slug: string;
  status: 'published' | 'draft' | 'archived';
  sections: {
    hero?: any;
    about?: any;
    services?: any;
    contact?: any;
  };
}

export const useCMSLandingPage = (slug?: string) => {
  const [landingPage, setLandingPage] = useState<CMSLandingPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLandingPage = async () => {
      if (!slug) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Buscar a página
        const { data: page, error: pageError } = await supabase
          .from('website_pages')
          .select('*')
          .eq('slug', slug)
          .eq('status', 'published')
          .maybeSingle();

        if (pageError) throw pageError;
        if (!page) {
          setLandingPage(null);
          setLoading(false);
          return;
        }

        // Buscar as seções da página
        const { data: sections, error: sectionsError } = await supabase
          .from('website_sections')
          .select('*')
          .eq('page_id', page.id)
          .eq('is_active', true)
          .order('order_index', { ascending: true });

        if (sectionsError) throw sectionsError;

        // Organizar seções por tipo
        const organizedSections = sections?.reduce((acc, section) => {
          acc[section.section_type] = section.content;
          return acc;
        }, {} as any) || {};

        setLandingPage({
          id: page.id,
          title: page.title,
          slug: page.slug,
          status: page.status as 'published' | 'draft' | 'archived',
          sections: organizedSections
        });

      } catch (err) {
        console.error('Erro ao buscar landing page do CMS:', err);
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    fetchLandingPage();
  }, [slug]);

  return { landingPage, loading, error };
};
