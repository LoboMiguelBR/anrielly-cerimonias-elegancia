
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface WebsiteSection {
  id: string;
  title?: string;
  page_id?: string;
  section_type: 'hero' | 'about' | 'services' | 'gallery' | 'testimonials' | 'contact' | 'custom';
  content: any;
  is_active: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export const useWebsiteSections = (pageId?: string) => {
  const [sections, setSections] = useState<WebsiteSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSections = async () => {
    try {
      setIsLoading(true);
      let query = supabase
        .from('website_sections')
        .select('*')
        .order('order_index', { ascending: true });

      if (pageId) {
        query = query.eq('page_id', pageId);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      // Type assertion para garantir compatibilidade
      const typedData = (data || []).map(section => ({
        ...section,
        section_type: section.section_type as 'hero' | 'about' | 'services' | 'gallery' | 'testimonials' | 'contact' | 'custom'
      }));
      
      setSections(typedData);
    } catch (err: any) {
      console.error('Error fetching sections:', err);
      toast.error('Erro ao carregar seções');
    } finally {
      setIsLoading(false);
    }
  };

  const createSection = async (sectionData: Omit<WebsiteSection, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('website_sections')
        .insert([sectionData])
        .select()
        .single();

      if (error) throw error;
      
      const typedData = {
        ...data,
        section_type: data.section_type as 'hero' | 'about' | 'services' | 'gallery' | 'testimonials' | 'contact' | 'custom'
      };
      
      setSections(prev => [...prev, typedData]);
      toast.success('Seção criada com sucesso!');
      return typedData;
    } catch (err: any) {
      console.error('Error creating section:', err);
      toast.error('Erro ao criar seção');
      throw err;
    }
  };

  const updateSection = async (id: string, updates: Partial<WebsiteSection>) => {
    try {
      const { data, error } = await supabase
        .from('website_sections')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const typedData = {
        ...data,
        section_type: data.section_type as 'hero' | 'about' | 'services' | 'gallery' | 'testimonials' | 'contact' | 'custom'
      };

      setSections(prev => prev.map(section => 
        section.id === id ? { ...section, ...typedData } : section
      ));
      toast.success('Seção atualizada com sucesso!');
      return typedData;
    } catch (err: any) {
      console.error('Error updating section:', err);
      toast.error('Erro ao atualizar seção');
      throw err;
    }
  };

  const deleteSection = async (id: string) => {
    try {
      const { error } = await supabase
        .from('website_sections')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSections(prev => prev.filter(section => section.id !== id));
      toast.success('Seção removida com sucesso!');
    } catch (err: any) {
      console.error('Error deleting section:', err);
      toast.error('Erro ao remover seção');
      throw err;
    }
  };

  const toggleSectionActive = async (id: string, isActive: boolean) => {
    return updateSection(id, { is_active: isActive });
  };

  useEffect(() => {
    fetchSections();
  }, [pageId]);

  return {
    sections,
    isLoading,
    fetchSections,
    createSection,
    updateSection,
    deleteSection,
    toggleSectionActive
  };
};
