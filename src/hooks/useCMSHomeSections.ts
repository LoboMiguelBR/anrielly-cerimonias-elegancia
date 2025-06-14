
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
  background_image?: string;
  created_at: string;
  updated_at: string;
}

export const useCMSHomeSections = () => {
  const [sections, setSections] = useState<CMSHomeSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timedOut, setTimedOut] = useState(false);

  const fetchSections = async (includeInactive = false) => {
    try {
      setLoading(true);
      setError(null);
      setTimedOut(false);

      let query = supabase
        .from('cms_home_sections')
        .select('*')
        .order('order_index', { ascending: true });

      if (!includeInactive) {
        query = query.eq('active', true);
      }

      // Faz uma Promise.race para controlar timeout manual (10s)
      const timeoutPromise = new Promise<null>((_, reject) =>
        setTimeout(() => reject(new Error('Timeout ao carregar as seções')), 10000)
      );

      const { data, error } = await Promise.race([
        query, // supabase query
        timeoutPromise,
      ]) as any;

      if (error) throw error;

      if (!data) throw new Error("Sem dados carregados (possível timeout)");

      // LOG EXTRA para debugar dados duplicados/índices
      const orderIndexes = data.map((s: CMSHomeSection) => s.order_index);
      const duplicates = orderIndexes.filter((val, idx, arr) => arr.indexOf(val) !== idx);
      if (duplicates.length > 0) {
        // Não impede o usuário, mas mostra no console
        console.warn("CMSHomeSections - order_index duplicado detectado!", duplicates, data);
      }

      setSections(data || []);
    } catch (err) {
      if (String((err as Error)?.message || '').toLowerCase().includes('timeout')) {
        setTimedOut(true);
        setError("A carga das seções excedeu o tempo limite. Verifique sua conexão ou tente novamente.");
      } else {
        console.error('Error fetching CMS home sections:', err);
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      }
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
      await fetchSections(true);
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

  // Adiciona logs para diagnóstico do loading
  useEffect(() => {
    fetchSections();
    // debug log
    console.log("[CMS] useCMSHomeSections hook inicializado");
    // eslint-disable-next-line
  }, []);

  return {
    sections,
    loading,
    error,
    timedOut,
    fetchSections,
    updateSection,
    createSection,
    deleteSection,
    reorderSections
  };
};
