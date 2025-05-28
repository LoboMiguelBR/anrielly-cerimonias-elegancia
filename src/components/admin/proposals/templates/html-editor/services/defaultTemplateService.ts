
import { supabase } from '@/integrations/supabase/client';
import { HtmlTemplateData } from '../types';
import { convertToVariablesRecord } from '../utils/converters';

/**
 * Get default template
 */
export async function getDefaultHtmlTemplate(): Promise<HtmlTemplateData | null> {
  try {
    const { data, error } = await supabase
      .from('proposal_template_html')
      .select('*')
      .eq('is_default', true)
      .single();
      
    if (error) throw error;
    if (!data) return null;
    
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
    console.error('Error fetching default HTML template:', error);
    
    // If no default template, try to get any template
    const { data } = await supabase
      .from('proposal_template_html')
      .select('*')
      .limit(1);
      
    if (data && data.length > 0) {
      return {
        id: data[0].id,
        name: data[0].name,
        description: data[0].description || '',
        htmlContent: data[0].html_content,
        cssContent: data[0].css_content || '',
        variables: convertToVariablesRecord(data[0].variables),
        isDefault: data[0].is_default,
        createdAt: data[0].created_at,
        updatedAt: data[0].updated_at
      };
    }
    
    return null;
  }
}
