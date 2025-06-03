
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
    [key: string]: any;
  };
}

export const useCMSLandingPage = (slug: string = 'home') => {
  const [landingPage, setLandingPage] = useState<CMSLandingPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLandingPage = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Buscando página CMS para slug:', slug);
        
        // Buscar a página
        const { data: page, error: pageError } = await supabase
          .from('website_pages')
          .select('*')
          .eq('slug', slug)
          .eq('status', 'published')
          .maybeSingle();

        if (pageError) {
          console.error('Erro ao buscar página:', pageError);
          throw pageError;
        }

        if (!page) {
          console.log('Página não encontrada para slug:', slug);
          setLandingPage(null);
          setLoading(false);
          return;
        }

        console.log('Página encontrada:', page);

        // Buscar as seções da página
        const { data: sections, error: sectionsError } = await supabase
          .from('website_sections')
          .select('*')
          .eq('page_id', page.id)
          .eq('is_active', true)
          .order('order_index', { ascending: true });

        if (sectionsError) {
          console.error('Erro ao buscar seções:', sectionsError);
          throw sectionsError;
        }

        console.log('Seções encontradas:', sections);

        // Organizar seções por tipo
        const organizedSections = sections?.reduce((acc, section) => {
          acc[section.section_type] = section.content;
          return acc;
        }, {} as any) || {};

        console.log('Seções organizadas:', organizedSections);

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
        setLandingPage(null);
      } finally {
        setLoading(false);
      }
    };

    fetchLandingPage();
  }, [slug]);

  const refetch = () => {
    setLoading(true);
    setError(null);
    // Reexecutar o useEffect
    const fetchLandingPage = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data: page, error: pageError } = await supabase
          .from('website_pages')
          .select('*')
          .eq('slug', slug)
          .eq('status', 'published')
          .maybeSingle();

        if (pageError) throw pageError;
        if (!page) {
          setLandingPage(null);
          return;
        }

        const { data: sections, error: sectionsError } = await supabase
          .from('website_sections')
          .select('*')
          .eq('page_id', page.id)
          .eq('is_active', true)
          .order('order_index', { ascending: true });

        if (sectionsError) throw sectionsError;

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
        setLandingPage(null);
      } finally {
        setLoading(false);
      }
    };

    fetchLandingPage();
  };

  return { landingPage, loading, error, refetch };
};
