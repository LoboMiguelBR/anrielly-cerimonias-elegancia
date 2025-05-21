
import { supabase } from '@/integrations/supabase/client';
import { ProposalTemplateData } from './types';
import { toast } from 'sonner';

// Default template that will be used if no custom template exists
export const defaultTemplate: ProposalTemplateData = {
  id: 'default',
  name: 'Padrão',
  colors: {
    primary: '#8A2BE2', // Purple
    secondary: '#F2AE30', // Gold
    accent: '#E57373',
    text: '#333333',
    background: '#FFFFFF'
  },
  fonts: {
    heading: 'Playfair Display, serif',
    body: 'Inter, sans-serif'
  },
  showQrCode: true,
  showTestimonials: true,
  showDifferentials: true,
  showAboutSection: true,
};

// Fetch all available templates
export async function fetchTemplates(): Promise<ProposalTemplateData[]> {
  try {
    const { data, error } = await supabase
      .from('proposal_templates')
      .select('*');
      
    if (error) throw error;
    
    // Map the database structure to our type
    const templates = data.map((template) => {
      try {
        const content = typeof template.content === 'string' 
          ? JSON.parse(template.content) 
          : template.content;
          
        return {
          id: template.id,
          name: template.name,
          ...content,
          created_at: template.created_at,
          updated_at: template.updated_at
        };
      } catch (e) {
        console.error('Failed to parse template content:', e);
        return null;
      }
    }).filter(Boolean) as ProposalTemplateData[];
    
    // Always include the default template
    return [defaultTemplate, ...templates];
  } catch (error: any) {
    console.error('Error fetching templates:', error);
    toast.error('Erro ao carregar templates');
    return [defaultTemplate];
  }
}

// Save a template to the database
export async function saveTemplate(template: Omit<ProposalTemplateData, 'id' | 'created_at' | 'updated_at'>): Promise<string | null> {
  try {
    const { name, ...contentData } = template;
    
    // Convert the contentData to a JSON string for storage
    const contentJson = JSON.stringify(contentData);
    
    const { data, error } = await supabase
      .from('proposal_templates')
      .insert({
        name: name,
        content: contentJson,
      })
      .select('id')
      .single();
      
    if (error) throw error;
    
    toast.success('Template salvo com sucesso!');
    return data?.id || null;
  } catch (error: any) {
    console.error('Error saving template:', error);
    toast.error(`Erro ao salvar template: ${error.message}`);
    return null;
  }
}

// Update an existing template
export async function updateTemplate(
  templateId: string, 
  template: Omit<ProposalTemplateData, 'id' | 'created_at' | 'updated_at'>
): Promise<boolean> {
  try {
    const { name, ...contentData } = template;
    
    // Convert the contentData to a JSON string for storage
    const contentJson = JSON.stringify(contentData);
    
    const { error } = await supabase
      .from('proposal_templates')
      .update({
        name: name,
        content: contentJson,
        updated_at: new Date().toISOString()
      })
      .eq('id', templateId);
      
    if (error) throw error;
    
    toast.success('Template atualizado com sucesso!');
    return true;
  } catch (error: any) {
    console.error('Error updating template:', error);
    toast.error(`Erro ao atualizar template: ${error.message}`);
    return false;
  }
}

// Delete a template
export async function deleteTemplate(templateId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('proposal_templates')
      .delete()
      .eq('id', templateId);
      
    if (error) throw error;
    
    toast.success('Template excluído com sucesso!');
    return true;
  } catch (error: any) {
    console.error('Error deleting template:', error);
    toast.error(`Erro ao excluir template: ${error.message}`);
    return false;
  }
}
