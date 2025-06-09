
import { supabase } from '@/integrations/supabase/client';
import { HtmlTemplateData } from '../types';
import { toast } from 'sonner';

/**
 * Save a new HTML template
 */
export async function saveHtmlTemplate(template: Omit<HtmlTemplateData, 'id' | 'createdAt' | 'updatedAt'>): Promise<string | null> {
  try {
    console.log('Saving new HTML template:', template.name);
    
    // Improved logging for debugging
    console.log('Template data being sent to Supabase:', {
      name: template.name,
      description: template.description || '',
      html_content: template.htmlContent.substring(0, 50) + '...',
      css_content: template.cssContent ? template.cssContent.substring(0, 50) + '...' : '',
      variables: template.variables || {},
      is_default: template.isDefault
    });
    
    const { data, error } = await supabase
      .from('proposal_template_html')
      .insert({
        name: template.name,
        description: template.description || '',
        html_content: template.htmlContent,
        css_content: template.cssContent || '',
        variables: template.variables || {},
        is_default: template.isDefault,
      })
      .select('id')
      .single();
      
    if (error) {
      console.error('Error details from Supabase:', error);
      throw error;
    }
    
    console.log('Template saved successfully with ID:', data.id);
    toast.success('Template HTML salvo com sucesso!');
    return data?.id || null;
  } catch (error: any) {
    console.error('Error saving HTML template:', error);
    
    // Improved error reporting
    let errorMessage = 'Erro desconhecido';
    if (error.message) {
      errorMessage = error.message;
    } else if (error.details) {
      errorMessage = error.details;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    
    toast.error(`Erro ao salvar template HTML: ${errorMessage}`);
    throw error; // Re-throw to allow calling code to handle it
  }
}

/**
 * Update an existing HTML template
 */
export async function updateHtmlTemplate(templateId: string, templateData: Partial<HtmlTemplateData>): Promise<boolean> {
  try {
    console.log('Updating HTML template:', templateId);
    const updateData: Record<string, any> = {};
    
    if (templateData.name !== undefined) updateData.name = templateData.name;
    if (templateData.description !== undefined) updateData.description = templateData.description;
    if (templateData.htmlContent !== undefined) updateData.html_content = templateData.htmlContent;
    if (templateData.cssContent !== undefined) updateData.css_content = templateData.cssContent;
    if (templateData.variables !== undefined) updateData.variables = templateData.variables;
    if (templateData.isDefault !== undefined) updateData.is_default = templateData.isDefault;
    updateData.updated_at = new Date().toISOString();
    
    console.log('Update data being sent to Supabase:', updateData);
    
    const { error } = await supabase
      .from('proposal_template_html')
      .update(updateData)
      .eq('id', templateId);
      
    if (error) {
      console.error('Error details from Supabase:', error);
      throw error;
    }
    
    console.log('Template updated successfully');
    toast.success('Template HTML atualizado com sucesso!');
    return true;
  } catch (error: any) {
    console.error('Error updating HTML template:', error);
    
    // Improved error reporting
    let errorMessage = 'Erro desconhecido';
    if (error.message) {
      errorMessage = error.message;
    } else if (error.details) {
      errorMessage = error.details;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    
    toast.error(`Erro ao atualizar template HTML: ${errorMessage}`);
    throw error; // Re-throw to allow calling code to handle it
  }
}

/**
 * Delete a HTML template
 */
export async function deleteHtmlTemplate(templateId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('proposal_template_html')
      .delete()
      .eq('id', templateId);
      
    if (error) throw error;
    
    toast.success('Template HTML excluído com sucesso!');
    return true;
  } catch (error: any) {
    console.error('Error deleting HTML template:', error);
    toast.error(`Erro ao excluir template HTML: ${error.message}`);
    return false;
  }
}
