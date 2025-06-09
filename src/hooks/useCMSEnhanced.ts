
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  CMSPage, 
  PageStatus, 
  PageType, 
  CMSSection, 
  SectionType,
  CMSTemplate,
  PageAnalytics,
  SEOConfig,
  ThemeConfig
} from '@/types/cms';

export interface CMSStats {
  total_pages: number;
  published_pages: number;
  draft_pages: number;
  total_views: number;
  monthly_views: number;
  average_time_on_page: number;
  conversion_rate: number;
}

export interface CMSFilters {
  status?: PageStatus[];
  page_type?: PageType[];
  date_range?: {
    start: string;
    end: string;
  };
  search_query?: string;
}

export const useCMSEnhanced = () => {
  const [pages, setPages] = useState<CMSPage[]>([]);
  const [templates, setTemplates] = useState<CMSTemplate[]>([]);
  const [stats, setStats] = useState<CMSStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<CMSFilters>({});

  const fetchPages = async (currentFilters?: CMSFilters) => {
    try {
      setLoading(true);
      let query = supabase
        .from('website_pages')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply filters
      const activeFilters = currentFilters || filters;
      
      if (activeFilters.status?.length) {
        query = query.in('status', activeFilters.status);
      }
      
      if (activeFilters.page_type?.length) {
        query = query.in('page_type', activeFilters.page_type);
      }
      
      if (activeFilters.search_query) {
        query = query.or(`title.ilike.%${activeFilters.search_query}%,slug.ilike.%${activeFilters.search_query}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Transform to enhanced format
      const enhancedPages: CMSPage[] = (data || []).map(page => ({
        id: page.id,
        tenant_id: 'anrielly_gomes',
        title: page.title,
        slug: page.slug,
        description: page.meta_description || '',
        content: page.content || '',
        excerpt: page.meta_description,
        page_type: (page.page_type as PageType) || 'custom',
        status: (page.status as PageStatus) || 'draft',
        seo: {
          meta_title: page.title,
          meta_description: page.meta_description || '',
          meta_keywords: page.meta_keywords ? page.meta_keywords.split(',') : [],
          og_title: page.title,
          og_description: page.meta_description || '',
          robots: 'index,follow',
          canonical_url: `/${page.slug}`,
        },
        template: 'default',
        sections: [],
        theme_config: getDefaultThemeConfig(),
        published_at: page.is_published ? page.created_at : undefined,
        version: 1,
        view_count: 0,
        created_by: 'admin',
        updated_by: 'admin',
        created_at: page.created_at,
        updated_at: page.updated_at
      }));

      setPages(enhancedPages);
    } catch (error: any) {
      console.error('Erro ao buscar páginas:', error);
      toast.error('Erro ao carregar páginas');
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      // Mock templates - will be expanded
      const mockTemplates: CMSTemplate[] = [
        {
          id: 'landing-classic',
          name: 'Landing Page Clássica',
          description: 'Template clássico para página inicial',
          preview_image: '/template-previews/landing-classic.jpg',
          category: 'Landing Page',
          page_type: 'landing',
          sections: [
            {
              section_type: 'hero',
              title: 'Hero Section',
              default_content: {
                heading: 'Bem-vindo',
                subheading: 'Sua descrição aqui',
                cta: {
                  text: 'Saiba Mais',
                  link: '#about',
                  style: 'primary',
                  size: 'lg',
                  target: '_self'
                }
              },
              default_settings: {
                layout: 'centered',
                columns: 1,
                spacing: 'large',
                alignment: 'center',
                background: {
                  type: 'gradient',
                  gradient: {
                    direction: '45deg',
                    stops: [
                      { color: '#8B5CF6', position: 0 },
                      { color: '#EC4899', position: 100 }
                    ]
                  }
                },
                text_color: '#FFFFFF',
                padding: '6rem 2rem',
                margin: '0',
                animation: 'fadeIn',
                parallax: false,
                sticky: false,
                responsive: {
                  mobile: { visible: true, padding: '4rem 1rem' },
                  tablet: { visible: true, padding: '5rem 2rem' },
                  desktop: { visible: true, padding: '6rem 2rem' }
                }
              },
              customizable_fields: ['heading', 'subheading', 'cta.text', 'cta.link'],
              order_index: 0
            }
          ],
          theme_config: getDefaultThemeConfig(),
          active: true,
          premium: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      
      setTemplates(mockTemplates);
    } catch (error: any) {
      console.error('Erro ao buscar templates:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const { data: pagesData } = await supabase
        .from('website_pages')
        .select('status, created_at, is_published');

      if (pagesData) {
        const now = new Date();
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        
        const stats: CMSStats = {
          total_pages: pagesData.length,
          published_pages: pagesData.filter(p => p.is_published).length,
          draft_pages: pagesData.filter(p => p.status === 'draft').length,
          total_views: Math.floor(Math.random() * 10000) + 1000, // Mock data
          monthly_views: Math.floor(Math.random() * 2000) + 500,
          average_time_on_page: Math.random() * 3 + 2, // 2-5 minutes
          conversion_rate: Math.random() * 10 + 5, // 5-15%
        };
        
        setStats(stats);
      }
    } catch (error: any) {
      console.error('Erro ao buscar estatísticas do CMS:', error);
    }
  };

  const getDefaultThemeConfig = (): ThemeConfig => ({
    primary_color: '#8B5CF6',
    secondary_color: '#EC4899',
    accent_color: '#F59E0B',
    text_color: '#1F2937',
    background_color: '#FFFFFF',
    font_family: 'Inter',
    heading_font: 'Playfair Display',
    font_sizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem'
    },
    spacing_unit: 8,
    border_radius: '0.5rem',
    breakpoints: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px'
    },
    custom_css: ''
  });

  const createPage = async (pageData: Partial<CMSPage>) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('website_pages')
        .insert([{
          title: pageData.title || '',
          slug: pageData.slug || '',
          content: pageData.content || '',
          page_type: pageData.page_type || 'custom',
          status: pageData.status || 'draft',
          meta_description: pageData.description,
          meta_keywords: pageData.seo?.meta_keywords?.join(','),
          is_published: pageData.status === 'published',
          order_index: 0
        }])
        .select()
        .single();

      if (error) throw error;

      toast.success('Página criada com sucesso!');
      await fetchPages();
      return data;
    } catch (error: any) {
      console.error('Erro ao criar página:', error);
      toast.error('Erro ao criar página');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updatePage = async (id: string, updates: Partial<CMSPage>) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('website_pages')
        .update({
          title: updates.title,
          slug: updates.slug,
          content: updates.content,
          page_type: updates.page_type,
          status: updates.status,
          meta_description: updates.description,
          meta_keywords: updates.seo?.meta_keywords?.join(','),
          is_published: updates.status === 'published',
        })
        .eq('id', id);

      if (error) throw error;

      toast.success('Página atualizada com sucesso!');
      await fetchPages();
    } catch (error: any) {
      console.error('Erro ao atualizar página:', error);
      toast.error('Erro ao atualizar página');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deletePage = async (id: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('website_pages')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Página removida com sucesso!');
      await fetchPages();
    } catch (error: any) {
      console.error('Erro ao remover página:', error);
      toast.error('Erro ao remover página');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const publishPage = async (id: string) => {
    try {
      await updatePage(id, { 
        status: 'published',
        published_at: new Date().toISOString()
      });
      toast.success('Página publicada com sucesso!');
    } catch (error) {
      toast.error('Erro ao publicar página');
    }
  };

  const duplicatePage = async (id: string) => {
    try {
      const pageToDuplicate = pages.find(p => p.id === id);
      if (!pageToDuplicate) {
        throw new Error('Página não encontrada');
      }

      const duplicatedPage = {
        ...pageToDuplicate,
        title: `${pageToDuplicate.title} (Cópia)`,
        slug: `${pageToDuplicate.slug}-copy`,
        status: 'draft' as PageStatus
      };

      delete (duplicatedPage as any).id;
      await createPage(duplicatedPage);
    } catch (error) {
      toast.error('Erro ao duplicar página');
    }
  };

  const getPageAnalytics = async (pageId: string): Promise<PageAnalytics> => {
    // Mock analytics data
    return {
      page_id: pageId,
      period_start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      period_end: new Date().toISOString(),
      total_views: Math.floor(Math.random() * 1000) + 100,
      unique_visitors: Math.floor(Math.random() * 500) + 50,
      bounce_rate: Math.random() * 50 + 25,
      average_time_on_page: Math.random() * 300 + 60, // seconds
      traffic_sources: [
        { source: 'Orgânico', visitors: Math.floor(Math.random() * 100) + 20, percentage: 45 },
        { source: 'Direto', visitors: Math.floor(Math.random() * 80) + 15, percentage: 30 },
        { source: 'Social Media', visitors: Math.floor(Math.random() * 60) + 10, percentage: 25 }
      ],
      device_breakdown: {
        desktop: Math.floor(Math.random() * 40) + 30,
        mobile: Math.floor(Math.random() * 50) + 40,
        tablet: Math.floor(Math.random() * 20) + 10
      },
      form_submissions: Math.floor(Math.random() * 20) + 5,
      cta_clicks: Math.floor(Math.random() * 50) + 15,
      conversion_rate: Math.random() * 10 + 2,
      updated_at: new Date().toISOString()
    };
  };

  const applyFilters = (newFilters: CMSFilters) => {
    setFilters(newFilters);
    fetchPages(newFilters);
  };

  const exportPages = async (format: 'json' | 'xml' | 'csv' = 'json') => {
    try {
      toast.success('Funcionalidade de exportação será implementada em breve');
    } catch (error) {
      toast.error('Erro ao exportar páginas');
    }
  };

  useEffect(() => {
    fetchPages();
    fetchTemplates();
    fetchStats();
  }, []);

  return {
    pages,
    templates,
    stats,
    loading,
    filters,
    fetchPages,
    fetchTemplates,
    createPage,
    updatePage,
    deletePage,
    publishPage,
    duplicatePage,
    getPageAnalytics,
    applyFilters,
    exportPages,
    refetch: () => {
      fetchPages();
      fetchStats();
    }
  };
};
