
import { useState, useEffect } from 'react';
// @ts-ignore: website_pages e website_sections podem não estar no typegen local
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

/**
 * Hook para obter a landing page do CMS (tabelas website_pages e website_sections)
 * Usa o "any" para contornar restrição do typegen local do Supabase.
 */
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
        
        // Buscar pelo slug especificado
        let { data: page, error: pageError } = await (supabase as any)
          .from('website_pages')
          .select('*')
          .eq('slug', slug)
          .eq('status', 'published')
          .maybeSingle();

        // Se não encontrar e slug for 'home', buscar primeira disponível
        if (!page && slug === 'home') {
          console.log('Página home não encontrada, buscando primeira página disponível...');
          const { data: firstPage, error: firstPageError } = await (supabase as any)
            .from('website_pages')
            .select('*')
            .eq('status', 'published')
            .order('created_at', { ascending: true })
            .limit(1)
            .maybeSingle();

          if (firstPageError) {
            console.error('Erro ao buscar primeira página:', firstPageError);
          } else if (firstPage) {
            console.log('Primeira página encontrada:', firstPage.slug);
            page = firstPage;
          }
        }

        if (pageError && !page) {
          console.error('Erro ao buscar página:', pageError);
          throw pageError;
        }

        if (!page) {
          console.log('Nenhuma página encontrada para slug:', slug);
          setLandingPage(null);
          setLoading(false);
          return;
        }

        // Buscar seções relacionadas à página
        const { data: sections, error: sectionsError } = await (supabase as any)
          .from('website_sections')
          .select('*')
          .eq('page_id', page.id)
          .eq('is_active', true)
          .order('order_index', { ascending: true });

        if (sectionsError) {
          console.error('Erro ao buscar seções:', sectionsError);
          throw sectionsError;
        }

        // Organizar as seções por tipo
        const organizedSections = sections?.reduce((acc: any, section: any) => {
          acc[section.section_type] = section.content;
          return acc;
        }, {}) || {};

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
    // Rebuscar com os patches do "any" novamente
    const fetchLandingPage = async () => {
      try {
        setLoading(true);
        setError(null);

        let { data: page, error: pageError } = await (supabase as any)
          .from('website_pages')
          .select('*')
          .eq('slug', slug)
          .eq('status', 'published')
          .maybeSingle();

        if (!page && slug === 'home') {
          const { data: firstPage, error: firstPageError } = await (supabase as any)
            .from('website_pages')
            .select('*')
            .eq('status', 'published')
            .order('created_at', { ascending: true })
            .limit(1)
            .maybeSingle();

          if (!firstPageError && firstPage) {
            page = firstPage;
          }
        }

        if (pageError && !page) throw pageError;
        if (!page) {
          setLandingPage(null);
          return;
        }

        const { data: sections, error: sectionsError } = await (supabase as any)
          .from('website_sections')
          .select('*')
          .eq('page_id', page.id)
          .eq('is_active', true)
          .order('order_index', { ascending: true });

        if (sectionsError) throw sectionsError;

        const organizedSections = sections?.reduce((acc: any, section: any) => {
          acc[section.section_type] = section.content;
          return acc;
        }, {}) || {};

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
