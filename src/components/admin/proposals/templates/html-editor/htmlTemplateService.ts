
import { supabase } from '@/integrations/supabase/client';
import { HtmlTemplateData } from './types';
import { v4 as uuidv4 } from 'uuid';
import { ProposalData } from '@/components/admin/hooks/proposal';
import { processVariables } from './variableUtils';

// Fetch all HTML templates
export const fetchHtmlTemplates = async (): Promise<HtmlTemplateData[]> => {
  try {
    const { data, error } = await supabase
      .from('html_templates')
      .select('*')
      .order('name', { ascending: true });
      
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching HTML templates:', error);
    return [];
  }
};

// Fetch a specific HTML template by ID
export const fetchHtmlTemplateById = async (id: string): Promise<HtmlTemplateData | null> => {
  try {
    const { data, error } = await supabase
      .from('html_templates')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    
    return data || null;
  } catch (error) {
    console.error('Error fetching HTML template by ID:', error);
    return null;
  }
};

// Get the default HTML template, used when no template is specified
export const getDefaultHtmlTemplate = async (): Promise<HtmlTemplateData | null> => {
  try {
    const { data, error } = await supabase
      .from('html_templates')
      .select('*')
      .eq('is_default', true)
      .single();
      
    if (error) {
      // If no default template exists, get the first template
      const { data: firstTemplate, error: secondError } = await supabase
        .from('html_templates')
        .select('*')
        .limit(1)
        .single();
        
      if (secondError) return null;
      return firstTemplate;
    }
    
    return data || null;
  } catch (error) {
    console.error('Error fetching default HTML template:', error);
    return null;
  }
};

// Save a new or update an existing HTML template
export const saveHtmlTemplate = async (template: Partial<HtmlTemplateData>): Promise<string | null> => {
  try {
    if (template.id) {
      // Update existing template
      const { error } = await supabase
        .from('html_templates')
        .update({
          name: template.name,
          description: template.description,
          htmlContent: template.htmlContent,
          cssContent: template.cssContent,
          is_default: template.is_default || false,
          updated_at: new Date().toISOString(),
        })
        .eq('id', template.id);
        
      if (error) throw error;
      
      return template.id;
    } else {
      // Create new template
      const newId = uuidv4();
      const { error } = await supabase
        .from('html_templates')
        .insert([
          {
            id: newId,
            name: template.name,
            description: template.description,
            htmlContent: template.htmlContent,
            cssContent: template.cssContent,
            is_default: template.is_default || false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        ]);
        
      if (error) throw error;
      
      return newId;
    }
  } catch (error) {
    console.error('Error saving HTML template:', error);
    return null;
  }
};

// Delete an HTML template
export const deleteHtmlTemplate = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('html_templates')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error deleting HTML template:', error);
    return false;
  }
};

// Get a preview of the HTML template with proposal data
export const getTemplatePreview = (
  htmlTemplate: HtmlTemplateData, 
  proposalData: ProposalData
): string => {
  try {
    return processVariables(htmlTemplate.htmlContent, proposalData);
  } catch (error) {
    console.error('Error generating template preview:', error);
    return htmlTemplate.htmlContent;
  }
};
