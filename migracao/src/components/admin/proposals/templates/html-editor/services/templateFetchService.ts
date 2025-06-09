
import { supabase } from '@/integrations/supabase/client';
import { HtmlTemplateData } from '../types';
import { toast } from 'sonner';
import { convertToVariablesRecord } from '../utils/converters';

/**
 * Fetch all available HTML templates
 */
export async function fetchHtmlTemplates(): Promise<HtmlTemplateData[]> {
  try {
    console.log('Fetching HTML templates');
    const { data, error } = await supabase
      .from('proposal_template_html')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    console.log(`Fetched ${data.length} HTML templates`);
    
    return data.map(template => ({
      id: template.id,
      name: template.name,
      description: template.description || '',
      htmlContent: template.html_content,
      cssContent: template.css_content || '',
      variables: convertToVariablesRecord(template.variables),
      isDefault: template.is_default,
      createdAt: template.created_at,
      updatedAt: template.updated_at
    }));
  } catch (error: any) {
    console.error('Error fetching HTML templates:', error);
    toast.error('Erro ao carregar templates HTML');
    return [];
  }
}

/**
 * Fetch a specific HTML template by ID
 */
export async function fetchHtmlTemplateById(id: string): Promise<HtmlTemplateData | null> {
  try {
    console.log('Fetching HTML template with ID:', id);
    const { data, error } = await supabase
      .from('proposal_template_html')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      console.error('Error fetching HTML template:', error);
      throw error;
    }
    
    if (!data) {
      console.log('No template found with ID:', id);
      return null;
    }
    
    console.log('Found template:', data.name);
    
    return {
      id: data.id,
      name: data.name,
      description: data.description || '',
      htmlContent: data.html_content,
      cssContent: data.css_content || '',
      variables: convertToVariablesRecord(data.variables),
      isDefault: data.is_default,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  } catch (error: any) {
    console.error(`Error fetching HTML template with ID ${id}:`, error);
    toast.error('Erro ao carregar template HTML');
    return null;
  }
}
