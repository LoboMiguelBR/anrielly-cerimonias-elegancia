import { supabase } from '@/integrations/supabase/client';
import { HtmlTemplateData, TemplateSection, TemplateAsset, TemplateSectionType } from './types';
import { toast } from 'sonner';
import { ProposalData } from '@/components/admin/hooks/proposal';
import { replaceVariablesInTemplate } from './variableUtils';

// Helper function to convert database JSON to the expected Record<string, string[]> format
const convertToVariablesRecord = (dbVariables: any): Record<string, string[]> => {
  if (!dbVariables) return {};
  
  // If it's already an object with the right structure
  if (typeof dbVariables === 'object' && !Array.isArray(dbVariables)) {
    const result: Record<string, string[]> = {};
    
    // Convert each key to ensure values are string arrays
    Object.entries(dbVariables).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        result[key] = value.map(item => String(item));
      } else {
        // If value is not an array, create a single-item array
        result[key] = [String(value)];
      }
    });
    
    return result;
  }
  
  // Fallback to empty object if structure is incorrect
  return {};
};

// Convert string to TemplateSectionType enum
const convertToSectionType = (type: string): TemplateSectionType => {
  const enumValues = Object.values(TemplateSectionType);
  if (enumValues.includes(type as TemplateSectionType)) {
    return type as TemplateSectionType;
  }
  return TemplateSectionType.CUSTOM; // Default to CUSTOM if not found
};

// Fetch all available HTML templates
export async function fetchHtmlTemplates(): Promise<HtmlTemplateData[]> {
  try {
    const { data, error } = await supabase
      .from('proposal_template_html')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
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

// Fetch a specific HTML template by ID
export async function fetchHtmlTemplateById(id: string): Promise<HtmlTemplateData | null> {
  try {
    const { data, error } = await supabase
      .from('proposal_template_html')
      .select('*')
      .eq('id', id)
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
    console.error(`Error fetching HTML template with ID ${id}:`, error);
    toast.error('Erro ao carregar template HTML');
    return null;
  }
}

// Save a new HTML template
export async function saveHtmlTemplate(template: Omit<HtmlTemplateData, 'id' | 'createdAt' | 'updatedAt'>): Promise<string | null> {
  try {
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
      
    if (error) throw error;
    
    toast.success('Template HTML salvo com sucesso!');
    return data?.id || null;
  } catch (error: any) {
    console.error('Error saving HTML template:', error);
    toast.error(`Erro ao salvar template HTML: ${error.message}`);
    return null;
  }
}

// Update an existing HTML template
export async function updateHtmlTemplate(templateId: string, templateData: Partial<HtmlTemplateData>): Promise<boolean> {
  try {
    const updateData: Record<string, any> = {};
    
    if (templateData.name !== undefined) updateData.name = templateData.name;
    if (templateData.description !== undefined) updateData.description = templateData.description;
    if (templateData.htmlContent !== undefined) updateData.html_content = templateData.htmlContent;
    if (templateData.cssContent !== undefined) updateData.css_content = templateData.cssContent;
    if (templateData.variables !== undefined) updateData.variables = templateData.variables;
    if (templateData.isDefault !== undefined) updateData.is_default = templateData.isDefault;
    updateData.updated_at = new Date().toISOString();
    
    const { error } = await supabase
      .from('proposal_template_html')
      .update(updateData)
      .eq('id', templateId);
      
    if (error) throw error;
    
    toast.success('Template HTML atualizado com sucesso!');
    return true;
  } catch (error: any) {
    console.error('Error updating HTML template:', error);
    toast.error(`Erro ao atualizar template HTML: ${error.message}`);
    return false;
  }
}

// Delete a HTML template
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

// Fetch template sections
export async function fetchTemplateSections(): Promise<TemplateSection[]> {
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
}

// Upload an asset for templates
export async function uploadTemplateAsset(file: File): Promise<TemplateAsset | null> {
  try {
    const filePath = `templates/${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
    
    // Upload file to storage
    const { error: uploadError, data: uploadData } = await supabase.storage
      .from('proposal-assets')
      .upload(filePath, file);
      
    if (uploadError) throw uploadError;
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from('proposal-assets')
      .getPublicUrl(filePath);
    
    const publicUrl = urlData.publicUrl;
    
    // Save asset metadata to database
    const { data, error } = await supabase
      .from('proposal_assets')
      .insert({
        file_name: file.name,
        file_path: filePath,
        file_size: file.size,
        file_type: file.type
      })
      .select('*')
      .single();
      
    if (error) throw error;
    
    return {
      id: data.id,
      fileName: data.file_name,
      filePath: data.file_path,
      fileSize: data.file_size,
      fileType: data.file_type,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      url: publicUrl
    };
  } catch (error: any) {
    console.error('Error uploading template asset:', error);
    toast.error(`Erro ao fazer upload de arquivo: ${error.message}`);
    return null;
  }
}

// Fetch all template assets
export async function fetchTemplateAssets(): Promise<TemplateAsset[]> {
  try {
    const { data, error } = await supabase
      .from('proposal_assets')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    return Promise.all(data.map(async asset => {
      const { data: urlData } = supabase.storage
        .from('proposal-assets')
        .getPublicUrl(asset.file_path);
      
      return {
        id: asset.id,
        fileName: asset.file_name,
        filePath: asset.file_path,
        fileSize: asset.file_size,
        fileType: asset.file_type,
        createdAt: asset.created_at,
        updatedAt: asset.updated_at,
        url: urlData.publicUrl
      };
    }));
  } catch (error: any) {
    console.error('Error fetching template assets:', error);
    toast.error('Erro ao carregar arquivos de template');
    return [];
  }
}

// Delete a template asset
export async function deleteTemplateAsset(assetId: string, filePath: string): Promise<boolean> {
  try {
    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('proposal-assets')
      .remove([filePath]);
      
    if (storageError) throw storageError;
    
    // Delete metadata from database
    const { error: dbError } = await supabase
      .from('proposal_assets')
      .delete()
      .eq('id', assetId);
      
    if (dbError) throw dbError;
    
    toast.success('Arquivo excluído com sucesso!');
    return true;
  } catch (error: any) {
    console.error('Error deleting template asset:', error);
    toast.error(`Erro ao excluir arquivo: ${error.message}`);
    return false;
  }
}

// Get default template
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

// Get a preview of the HTML template with proposal data (async version)
export async function getTemplatePreview(
  htmlTemplate: HtmlTemplateData, 
  proposalData: ProposalData
): Promise<string> {
  try {
    return await replaceVariablesInTemplate(htmlTemplate.htmlContent, proposalData);
  } catch (error) {
    console.error('Error generating template preview:', error);
    return htmlTemplate.htmlContent;
  }
}

// Synchronous version for backward compatibility (without dynamic variables)
export function getTemplatePreviewSync(
  htmlTemplate: HtmlTemplateData, 
  proposalData: ProposalData
): string {
  try {
    // Simple synchronous variable replacement without dynamic content
    let processedContent = htmlTemplate.htmlContent;

    // Static variables only
    processedContent = processedContent.replace(/\{\{client_name\}\}/g, proposalData.client_name || '');
    processedContent = processedContent.replace(/\{\{client_email\}\}/g, proposalData.client_email || '');
    processedContent = processedContent.replace(/\{\{client_phone\}\}/g, proposalData.client_phone || '');
    processedContent = processedContent.replace(/\{\{event_type\}\}/g, proposalData.event_type || '');
    processedContent = processedContent.replace(/\{\{event_date\}\}/g, 
      proposalData.event_date ? new Date(proposalData.event_date).toLocaleDateString('pt-BR') : ''
    );
    processedContent = processedContent.replace(/\{\{event_location\}\}/g, proposalData.event_location || '');
    processedContent = processedContent.replace(/\{\{total_price\}\}/g, 
      new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(proposalData.total_price || 0)
    );
    processedContent = processedContent.replace(/\{\{payment_terms\}\}/g, proposalData.payment_terms || '');
    processedContent = processedContent.replace(/\{\{validity_date\}\}/g, 
      proposalData.validity_date ? new Date(proposalData.validity_date).toLocaleDateString('pt-BR') : ''
    );
    processedContent = processedContent.replace(/\{\{notes\}\}/g, proposalData.notes || '');
    processedContent = processedContent.replace(/\{\{current_date\}\}/g, 
      new Date().toLocaleDateString('pt-BR')
    );

    // Services list
    const servicesHtml = proposalData.services
      .filter(service => service.included)
      .map(service => `
        <div class="service-item">
          <h4>${service.name}</h4>
          ${service.description ? `<p>${service.description}</p>` : ''}
        </div>
      `).join('');
    
    processedContent = processedContent.replace(/\{\{services\}\}/g, servicesHtml);

    return processedContent;
  } catch (error) {
    console.error('Error generating synchronous template preview:', error);
    return htmlTemplate.htmlContent;
  }
}
