
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { LandingPageTemplate } from './useLandingPageData';

export const useLandingPageActions = () => {
  const [loading, setLoading] = useState(false);

  const createTemplate = async (data: Partial<LandingPageTemplate>) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('landing_page_templates')
        .insert([{
          name: data.name,
          slug: data.slug,
          sections: data.sections || {},
          is_active: data.is_active || false,
          tenant_id: data.tenant_id || 'anrielly_gomes'
        }]);

      if (error) throw error;

      toast.success('Template criado com sucesso!');
      return true;
    } catch (err) {
      console.error('Erro ao criar template:', err);
      toast.error('Erro ao criar template');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateTemplate = async (id: string, data: Partial<LandingPageTemplate>) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('landing_page_templates')
        .update({
          name: data.name,
          slug: data.slug,
          sections: data.sections,
          is_active: data.is_active
        })
        .eq('id', id);

      if (error) throw error;

      toast.success('Template atualizado com sucesso!');
      return true;
    } catch (err) {
      console.error('Erro ao atualizar template:', err);
      toast.error('Erro ao atualizar template');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteTemplate = async (id: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('landing_page_templates')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Template deletado com sucesso!');
      return true;
    } catch (err) {
      console.error('Erro ao deletar template:', err);
      toast.error('Erro ao deletar template');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const duplicateTemplate = async (id: string) => {
    try {
      setLoading(true);
      
      // Buscar template original
      const { data: original, error: fetchError } = await supabase
        .from('landing_page_templates')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      // Criar cópia
      const { error: insertError } = await supabase
        .from('landing_page_templates')
        .insert([{
          name: `${original.name} (Cópia)`,
          slug: `${original.slug}-copy-${Date.now()}`,
          sections: original.sections,
          is_active: false,
          tenant_id: original.tenant_id
        }]);

      if (insertError) throw insertError;

      toast.success('Template duplicado com sucesso!');
      return true;
    } catch (err) {
      console.error('Erro ao duplicar template:', err);
      toast.error('Erro ao duplicar template');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    createTemplate,
    updateTemplate,
    deleteTemplate,
    duplicateTemplate,
    loading
  };
};
