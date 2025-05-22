import { supabase } from '@/integrations/supabase/client';
import { HtmlTemplateData, TemplateSection, TemplateAsset, TemplateSectionType } from './types';
import { toast } from 'sonner';

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

// Fetch a specific HTML template by ID
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

// Save a new HTML template
export async function saveHtmlTemplate(template: Omit<HtmlTemplateData, 'id' | 'createdAt' | 'updatedAt'>): Promise<string | null> {
  try {
    console.log('Saving new HTML template:', template.name);
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
    
    console.log('Template saved with ID:', data.id);
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
    console.log('Updating HTML template:', templateId);
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
    
    console.log('Template updated successfully');
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

// Get default template
export async function getDefaultHtmlTemplate(): Promise<HtmlTemplateData | null> {
  try {
    console.log('Getting default HTML template');
    const { data, error } = await supabase
      .from('proposal_template_html')
      .select('*')
      .eq('is_default', true)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned - try to get any template
        console.log('No default template found, trying to get any template');
        return getFallbackTemplate();
      }
      throw error;
    }
    
    if (!data) {
      console.log('No default template found');
      return getFallbackTemplate();
    }
    
    console.log('Found default template:', data.name);
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
    return getFallbackTemplate();
  }
}

// Get any template as fallback
async function getFallbackTemplate(): Promise<HtmlTemplateData | null> {
  try {
    const { data } = await supabase
      .from('proposal_template_html')
      .select('*')
      .limit(1);
      
    if (data && data.length > 0) {
      console.log('Using fallback template:', data[0].name);
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
    
    // If there are no templates at all, create a default one
    return createDefaultTemplate();
  } catch (error) {
    console.error('Error getting fallback template:', error);
    return null;
  }
}

// Create a simple default template
async function createDefaultTemplate(): Promise<HtmlTemplateData | null> {
  const defaultTemplate: Omit<HtmlTemplateData, 'id' | 'createdAt' | 'updatedAt'> = {
    name: 'Template Padrão',
    description: 'Template HTML padrão criado automaticamente',
    htmlContent: `
      <div class="proposal">
        <div class="header">
          <h1>{{proposal.client_name}}</h1>
          <p>Proposta para {{proposal.event_type}}</p>
        </div>
        <div class="content">
          <p>Obrigado por considerar nossos serviços para o seu evento!</p>
          <h2>Detalhes do Evento</h2>
          <p><strong>Data:</strong> {{proposal.event_date}}</p>
          <p><strong>Local:</strong> {{proposal.event_location}}</p>
          
          <h2>Serviços Incluídos</h2>
          <ul>
            {{#each proposal.services}}
              <li>{{name}}</li>
            {{/each}}
          </ul>
          
          <h2>Investimento</h2>
          <p><strong>Valor Total:</strong> R$ {{proposal.total_price}}</p>
          <p><strong>Condições de Pagamento:</strong> {{proposal.payment_terms}}</p>
          
          {{#if proposal.notes}}
            <h2>Observações</h2>
            <p>{{proposal.notes}}</p>
          {{/if}}
          
          <div class="footer">
            <p>Proposta válida até {{proposal.validity_date}}</p>
          </div>
        </div>
      </div>
    `,
    cssContent: `
      .proposal {
        font-family: 'Playfair Display', serif;
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
        color: #333;
      }
      
      .header {
        text-align: center;
        margin-bottom: 40px;
      }
      
      h1 {
        font-size: 28px;
        margin-bottom: 10px;
      }
      
      h2 {
        font-size: 22px;
        color: #6C2BD9;
        margin-top: 30px;
      }
      
      ul {
        padding-left: 20px;
      }
      
      .footer {
        margin-top: 50px;
        text-align: center;
        font-size: 14px;
      }
    `,
    variables: {},
    isDefault: true
  };
  
  try {
    console.log('Creating default HTML template');
    const id = await saveHtmlTemplate(defaultTemplate);
    
    if (!id) {
      console.error('Failed to create default template');
      return null;
    }
    
    return {
      ...defaultTemplate,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error creating default template:', error);
    return null;
  }
}

// Export the other functions unchanged
export { fetchTemplateSections, uploadTemplateAsset, fetchTemplateAssets, deleteTemplateAsset };

// Maintain these functions from the original file
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

// Upload an asset for templates
export const uploadTemplateAsset = async (file: File): Promise<TemplateAsset | null> => {
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
};

// Fetch all template assets
export const fetchTemplateAssets = async (): Promise<TemplateAsset[]> => {
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
};

// Delete a template asset
export const deleteTemplateAsset = async (assetId: string, filePath: string): Promise<boolean> => {
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
};
