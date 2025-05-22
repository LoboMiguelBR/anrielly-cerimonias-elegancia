
import { supabase } from '@/integrations/supabase/client';
import { TemplateSection } from '../types';
import { toast } from 'sonner';
import { convertToSectionType } from '../utils/converters';

/**
 * Fetch template sections
 */
export const fetchTemplateSections = async (): Promise<TemplateSection[]> => {
  try {
    const { data, error } = await supabase
      .from('template_sections')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    return data.map(section => ({
      id: section.id,
      name: section.name,
      description: section.description || '',
      htmlContent: section.html_content,
      sectionType: convertToSectionType(section.section_type),
      createdAt: section.created_at,
      updatedAt: section.updated_at
    }));
  } catch (error: any) {
    console.error('Error fetching template sections:', error);
    toast.error('Erro ao carregar seções de template');
    return [];
  }
};
