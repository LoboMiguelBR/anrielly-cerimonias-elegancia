
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface CMSSection {
  id: string;
  section_type: string;
  title?: string;
  content: any;
  html_template?: string;
  variables?: Record<string, any>;
  is_active: boolean;
  order_index: number;
}

export interface CMSLandingPageWithHtml {
  id: string;
  title: string;
  slug: string;
  status: 'published' | 'draft' | 'archived';
  sections: Record<string, CMSSection>;
}

interface CacheEntry {
  data: CMSLandingPageWithHtml | null;
  timestamp: number;
  expires: number;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos
const cache = new Map<string, CacheEntry>();

export const useCMSLandingPageWithHtml = (slug: string = 'home') => {
  const [landingPage, setLandingPage] = useState<CMSLandingPageWithHtml | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const getCachedData = useCallback((key: string): CMSLandingPageWithHtml | null => {
    const cached = cache.get(key);
    if (cached && Date.now() < cached.expires) {
      console.log('📦 Dados do CMS servidos do cache:', key);
      return cached.data;
    }
    return null;
  }, []);

  const setCachedData = useCallback((key: string, data: CMSLandingPageWithHtml | null) => {
    cache.set(key, {
      data,
      timestamp: Date.now(),
      expires: Date.now() + CACHE_DURATION
    });
  }, []);

  const fetchLandingPage = useCallback(async (useCache = true) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Buscando página CMS com HTML para slug:', slug);
      
      // Verificar cache primeiro
      if (useCache) {
        const cachedData = getCachedData(slug);
        if (cachedData) {
          setLandingPage(cachedData);
          setLoading(false);
          return cachedData;
        }
      }

      // Buscar página
      let { data: page, error: pageError } = await supabase
        .from('website_pages')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .maybeSingle();

      // Fallback para primeira página disponível se slug for 'home'
      if (!page && slug === 'home') {
        console.log('📄 Página home não encontrada, buscando primeira página disponível...');
        const { data: firstPage, error: firstPageError } = await supabase
          .from('website_pages')
          .select('*')
          .eq('status', 'published')
          .order('created_at', { ascending: true })
          .limit(1)
          .maybeSingle();
        
        if (firstPageError) {
          console.error('❌ Erro ao buscar primeira página:', firstPageError);
        } else if (firstPage) {
          console.log('✅ Primeira página encontrada:', firstPage.slug);
          page = firstPage;
        }
      }

      if (pageError && !page) {
        console.error('❌ Erro ao buscar página:', pageError);
        throw pageError;
      }

      if (!page) {
        console.log('⚠️ Nenhuma página encontrada para slug:', slug);
        setCachedData(slug, null);
        setLandingPage(null);
        setLoading(false);
        return null;
      }

      console.log('📄 Página encontrada:', {
        id: page.id,
        title: page.title,
        slug: page.slug,
        status: page.status
      });

      // Buscar seções ativas da página
      const { data: sections, error: sectionsError } = await supabase
        .from('website_sections')
        .select('*')
        .eq('page_id', page.id)
        .eq('is_active', true)
        .order('order_index', { ascending: true });

      if (sectionsError) {
        console.error('❌ Erro ao buscar seções:', sectionsError);
        throw sectionsError;
      }

      console.log('📋 Seções encontradas:', sections?.map(s => ({
        type: s.section_type,
        active: s.is_active,
        order: s.order_index
      })));

      // Organizar seções por tipo - extrair HTML personalizado do content se existir
      const organizedSections = sections?.reduce((acc, section) => {
        const content = section.content as any;
        
        acc[section.section_type] = {
          id: section.id,
          section_type: section.section_type,
          title: section.title,
          content: section.content,
          html_template: content?.html_template || undefined,
          variables: content?.variables || {},
          is_active: section.is_active,
          order_index: section.order_index
        };
        return acc;
      }, {} as Record<string, CMSSection>) || {};

      console.log('✅ Seções organizadas:', Object.keys(organizedSections));

      const result: CMSLandingPageWithHtml = {
        id: page.id,
        title: page.title,
        slug: page.slug,
        status: page.status as 'published' | 'draft' | 'archived',
        sections: organizedSections
      };

      // Armazenar no cache
      setCachedData(slug, result);
      setLandingPage(result);
      setLastUpdated(new Date());

      return result;

    } catch (err) {
      console.error('💥 Erro ao buscar landing page do CMS:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      setLandingPage(null);
      toast.error('Erro ao carregar dados do CMS');
    } finally {
      setLoading(false);
    }
  }, [slug, getCachedData, setCachedData]);

  const refetch = useCallback(() => {
    console.log('🔄 Forçando atualização dos dados CMS...');
    cache.delete(slug); // Limpar cache
    return fetchLandingPage(false);
  }, [slug, fetchLandingPage]);

  const invalidateCache = useCallback(() => {
    console.log('🗑️ Invalidando cache do CMS...');
    cache.clear();
  }, []);

  // Setup inicial e realtime
  useEffect(() => {
    fetchLandingPage();

    // Setup realtime para mudanças nas páginas
    const pagesChannel = supabase
      .channel('website_pages_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'website_pages',
        filter: `slug=eq.${slug}`
      }, (payload) => {
        console.log('🔄 Página atualizada em tempo real:', payload);
        refetch();
      })
      .subscribe();

    // Setup realtime para mudanças nas seções
    const sectionsChannel = supabase
      .channel('website_sections_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'website_sections'
      }, (payload) => {
        console.log('🔄 Seção atualizada em tempo real:', payload);
        refetch();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(pagesChannel);
      supabase.removeChannel(sectionsChannel);
    };
  }, [slug, fetchLandingPage, refetch]);

  return { 
    landingPage, 
    loading, 
    error, 
    refetch, 
    invalidateCache,
    lastUpdated,
    isFromCache: Boolean(getCachedData(slug))
  };
};
