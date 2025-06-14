
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface CMSHomeSection {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  content_html?: string;
  bg_color?: string;
  cta_label?: string;
  cta_link?: string;
  order_index: number;
  active: boolean;
  background_image?: string; // <-- NOVO: imagem de fundo para a seção!
  created_at: string;
  updated_at: string;
}

export const useCMSHomeSections = () => {
  const [sections, setSections] = useState<CMSHomeSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSections = async (includeInactive = false) => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('cms_home_sections')
        .select('*')
        .order('order_index', { ascending: true });

      if (!includeInactive) {
        query = query.eq('active', true);
      }

      const { data, error } = await query;

      if (error) throw error;

      setSections(data || []);
    } catch (err) {
      console.error('Error fetching CMS home sections:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const updateSection = async (id: string, updates: Partial<CMSHomeSection>) => {
    try {
      const { error } = await supabase
        .from('cms_home_sections')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      toast.success('Seção atualizada com sucesso!');
      await fetchSections(true); // Recarregar todas as seções
    } catch (err) {
      console.error('Error updating section:', err);
      toast.error('Erro ao atualizar seção');
      throw err;
    }
  };

  const createSection = async (sectionData: Omit<CMSHomeSection, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { error } = await supabase
        .from('cms_home_sections')
        .insert([sectionData]);

      if (error) throw error;

      toast.success('Seção criada com sucesso!');
      await fetchSections(true);
    } catch (err) {
      console.error('Error creating section:', err);
      toast.error('Erro ao criar seção');
      throw err;
    }
  };

  const deleteSection = async (id: string) => {
    try {
      const { error } = await supabase
        .from('cms_home_sections')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Seção excluída com sucesso!');
      await fetchSections(true);
    } catch (err) {
      console.error('Error deleting section:', err);
      toast.error('Erro ao excluir seção');
      throw err;
    }
  };

  const reorderSections = async (reorderedSections: CMSHomeSection[]) => {
    try {
      const updates = reorderedSections.map((section, index) => 
        supabase
          .from('cms_home_sections')
          .update({ order_index: index + 1 })
          .eq('id', section.id)
      );

      await Promise.all(updates);
      toast.success('Ordem das seções atualizada!');
      await fetchSections(true);
    } catch (err) {
      console.error('Error reordering sections:', err);
      toast.error('Erro ao reordenar seções');
      throw err;
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  return {
    sections,
    loading,
    error,
    fetchSections,
    updateSection,
    createSection,
    deleteSection,
    reorderSections
  };
};
