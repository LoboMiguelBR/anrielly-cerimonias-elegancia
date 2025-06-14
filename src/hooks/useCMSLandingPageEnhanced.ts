
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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

interface CacheEntry {
  data: CMSLandingPage | null;
  timestamp: number;
  expires: number;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos
const cache = new Map<string, CacheEntry>();

export const useCMSLandingPageEnhanced = (slug: string = 'home') => {
  const [landingPage, setLandingPage] = useState<CMSLandingPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const getCachedData = useCallback((key: string): CMSLandingPage | null => {
    const cached = cache.get(key);
    if (cached && Date.now() < cached.expires) {
      console.log('📦 Dados do CMS servidos do cache:', key);
      return cached.data;
    }
    return null;
  }, []);

  const setCachedData = useCallback((key: string, data: CMSLandingPage | null) => {
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
      
      console.log('🔍 Buscando página CMS para slug:', slug);
      
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
      let { data: page, error: pageError } = await (supabase as any)
        .from('website_pages')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .maybeSingle();

      // Fallback para primeira página disponível se slug for 'home'
      if (!page && slug === 'home') {
        console.log('📄 Página home não encontrada, buscando primeira página disponível...');
        const { data: firstPage, error: firstPageError } = await (supabase as any)
          .from('website_pages')
          .select('*')
          .eq('status', 'published')
          .order('created_at', { ascending: true })
          .limit(1)
          .maybeSingle();
        
        if (firstPageError) {
          console.error('❌ Erro ao buscar primeira página:', firstPageError);
        } else if (firstPage) {
          console.log('✅ Primeira página encontrada:', (firstPage as any).slug);
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

      // Cast page as any to safely access expected CMS fields
      const pageObj = page as any;

      console.log('📄 Página encontrada:', {
        id: pageObj.id,
        title: pageObj.title,
        slug: pageObj.slug,
        status: pageObj.status
      });

      // Buscar seções ativas da página
      const { data: sections, error: sectionsError } = await (supabase as any)
        .from('website_sections')
        .select('*')
        .eq('page_id', pageObj.id)
        .eq('is_active', true)
        .order('order_index', { ascending: true });

      if (sectionsError) {
        console.error('❌ Erro ao buscar seções:', sectionsError);
        throw sectionsError;
      }

      // Cast section as any to access CMS-specific fields
      console.log('📋 Seções encontradas:', (sections || []).map((s: any) => ({
        type: s.section_type,
        active: s.is_active,
        order: s.order_index
      })));

      // Organizar seções por tipo
      const organizedSections = (sections || []).reduce((acc: any, section: any) => {
        acc[section.section_type] = section.content;
        return acc;
      }, {}) || {};

      console.log('✅ Seções organizadas:', Object.keys(organizedSections));

      const result: CMSLandingPage = {
        id: pageObj.id,
        title: pageObj.title,
        slug: pageObj.slug,
        status: pageObj.status as 'published' | 'draft' | 'archived',
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
    const pagesChannel = (supabase as any)
      .channel('website_pages_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'website_pages',
        filter: `slug=eq.${slug}`
      }, (payload: any) => {
        console.log('🔄 Página atualizada em tempo real:', payload);
        refetch();
      })
      .subscribe();

    // Setup realtime para mudanças nas seções
    const sectionsChannel = (supabase as any)
      .channel('website_sections_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'website_sections'
      }, (payload: any) => {
        console.log('🔄 Seção atualizada em tempo real:', payload);
        refetch();
      })
      .subscribe();

    return () => {
      (supabase as any).removeChannel(pagesChannel);
      (supabase as any).removeChannel(sectionsChannel);
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
