
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface WebsitePage {
  id: string;
  title: string;
  slug: string;
  content?: string;
  meta_description?: string;
  meta_keywords?: string;
  status: 'published' | 'draft' | 'archived';
  page_type: 'home' | 'about' | 'services' | 'contact' | 'custom';
  is_published?: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export const useWebsitePages = () => {
  const [pages, setPages] = useState<WebsitePage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPages = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('website_pages')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      
      // Type assertion para garantir compatibilidade
      const typedData = (data || []).map(page => ({
        ...page,
        status: page.status as 'published' | 'draft' | 'archived',
        page_type: page.page_type as 'home' | 'about' | 'services' | 'contact' | 'custom'
      }));
      
      setPages(typedData);
    } catch (err: any) {
      console.error('Error fetching pages:', err);
      toast.error('Erro ao carregar páginas');
    } finally {
      setIsLoading(false);
    }
  };

  const createPage = async (pageData: Omit<WebsitePage, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('website_pages')
        .insert([pageData])
        .select()
        .single();

      if (error) throw error;
      
      const typedData = {
        ...data,
        status: data.status as 'published' | 'draft' | 'archived',
        page_type: data.page_type as 'home' | 'about' | 'services' | 'contact' | 'custom'
      };
      
      setPages(prev => [...prev, typedData]);
      toast.success('Página criada com sucesso!');
      return typedData;
    } catch (err: any) {
      console.error('Error creating page:', err);
      toast.error('Erro ao criar página');
      throw err;
    }
  };

  const updatePage = async (id: string, updates: Partial<WebsitePage>) => {
    try {
      const { data, error } = await supabase
        .from('website_pages')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const typedData = {
        ...data,
        status: data.status as 'published' | 'draft' | 'archived',
        page_type: data.page_type as 'home' | 'about' | 'services' | 'contact' | 'custom'
      };

      setPages(prev => prev.map(page => 
        page.id === id ? { ...page, ...typedData } : page
      ));
      toast.success('Página atualizada com sucesso!');
      return typedData;
    } catch (err: any) {
      console.error('Error updating page:', err);
      toast.error('Erro ao atualizar página');
      throw err;
    }
  };

  const deletePage = async (id: string) => {
    try {
      const { error } = await supabase
        .from('website_pages')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPages(prev => prev.filter(page => page.id !== id));
      toast.success('Página removida com sucesso!');
    } catch (err: any) {
      console.error('Error deleting page:', err);
      toast.error('Erro ao remover página');
      throw err;
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  return {
    pages,
    isLoading,
    fetchPages,
    createPage,
    updatePage,
    deletePage
  };
};
