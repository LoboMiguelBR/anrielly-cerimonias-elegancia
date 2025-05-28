
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Json } from '@/integrations/supabase/types';

export interface ProposalTemplateData {
  id: string;
  name: string;
  description?: string;
  html_content: string;
  css_content?: string;
  variables?: Record<string, any>;
  is_default?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateProposalTemplateData {
  name: string;
  description?: string;
  html_content: string;
  css_content?: string;
  variables?: Record<string, any>;
  is_default?: boolean;
}

export interface UpdateProposalTemplateData {
  name?: string;
  description?: string;
  html_content?: string;
  css_content?: string;
  variables?: Record<string, any>;
  is_default?: boolean;
}

// Função helper para converter Json do Supabase para Record<string, any>
const convertJsonToRecord = (jsonData: Json | null): Record<string, any> => {
  if (!jsonData) return {};
  if (typeof jsonData === 'object' && jsonData !== null && !Array.isArray(jsonData)) {
    return jsonData as Record<string, any>;
  }
  return {};
};

// Fetch all proposal templates
export const fetchProposalTemplates = async (): Promise<ProposalTemplateData[]> => {
  try {
    const { data, error } = await supabase
      .from('proposal_template_html')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    return (data || []).map(template => ({
      id: template.id,
      name: template.name,
      description: template.description || '',
      html_content: template.html_content,
      css_content: template.css_content || '',
      variables: convertJsonToRecord(template.variables),
      is_default: template.is_default || false,
      created_at: template.created_at,
      updated_at: template.updated_at
    }));
  } catch (error: any) {
    console.error('Error fetching proposal templates:', error);
    toast.error('Erro ao carregar templates de proposta');
    return [];
  }
};

// Fetch a specific proposal template
export const fetchProposalTemplateById = async (id: string): Promise<ProposalTemplateData | null> => {
  try {
    const { data, error } = await supabase
      .from('proposal_template_html')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    
    return {
      id: data.id,
      name: data.name,
      description: data.description || '',
      html_content: data.html_content,
      css_content: data.css_content || '',
      variables: convertJsonToRecord(data.variables),
      is_default: data.is_default || false,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  } catch (error: any) {
    console.error('Error fetching proposal template:', error);
    toast.error('Erro ao carregar template de proposta');
    return null;
  }
};

// Create a new proposal template
export const createProposalTemplate = async (templateData: CreateProposalTemplateData): Promise<ProposalTemplateData> => {
  try {
    const { data, error } = await supabase
      .from('proposal_template_html')
      .insert([templateData])
      .select()
      .single();
      
    if (error) throw error;
    
    toast.success('Template de proposta criado com sucesso!');
    
    return {
      id: data.id,
      name: data.name,
      description: data.description || '',
      html_content: data.html_content,
      css_content: data.css_content || '',
      variables: convertJsonToRecord(data.variables),
      is_default: data.is_default || false,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  } catch (error: any) {
    console.error('Error creating proposal template:', error);
    toast.error(`Erro ao criar template: ${error.message}`);
    throw error;
  }
};

// Update an existing proposal template
export const updateProposalTemplate = async (id: string, templateData: UpdateProposalTemplateData): Promise<ProposalTemplateData> => {
  try {
    const { data, error } = await supabase
      .from('proposal_template_html')
      .update(templateData)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    
    toast.success('Template de proposta atualizado com sucesso!');
    
    return {
      id: data.id,
      name: data.name,
      description: data.description || '',
      html_content: data.html_content,
      css_content: data.css_content || '',
      variables: convertJsonToRecord(data.variables),
      is_default: data.is_default || false,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  } catch (error: any) {
    console.error('Error updating proposal template:', error);
    toast.error(`Erro ao atualizar template: ${error.message}`);
    throw error;
  }
};

// Delete a proposal template
export const deleteProposalTemplate = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('proposal_template_html')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    toast.success('Template de proposta excluído com sucesso!');
    return true;
  } catch (error: any) {
    console.error('Error deleting proposal template:', error);
    toast.error(`Erro ao excluir template: ${error.message}`);
    return false;
  }
};

// Get default proposal template
export const getDefaultProposalTemplate = async (): Promise<ProposalTemplateData | null> => {
  try {
    const { data, error } = await supabase
      .from('proposal_template_html')
      .select('*')
      .eq('is_default', true)
      .single();
      
    if (error && error.code !== 'PGRST116') throw error;
    
    // If no default template, get the first one
    if (!data) {
      const { data: firstTemplate, error: firstError } = await supabase
        .from('proposal_template_html')
        .select('*')
        .limit(1)
        .single();
        
      if (firstError && firstError.code !== 'PGRST116') throw firstError;
      
      if (!firstTemplate) return null;
      
      return {
        id: firstTemplate.id,
        name: firstTemplate.name,
        description: firstTemplate.description || '',
        html_content: firstTemplate.html_content,
        css_content: firstTemplate.css_content || '',
        variables: convertJsonToRecord(firstTemplate.variables),
        is_default: firstTemplate.is_default || false,
        created_at: firstTemplate.created_at,
        updated_at: firstTemplate.updated_at
      };
    }
    
    return {
      id: data.id,
      name: data.name,
      description: data.description || '',
      html_content: data.html_content,
      css_content: data.css_content || '',
      variables: convertJsonToRecord(data.variables),
      is_default: data.is_default || false,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  } catch (error: any) {
    console.error('Error fetching default proposal template:', error);
    return null;
  }
};

export const proposalTemplatesApi = {
  fetchProposalTemplates,
  fetchProposalTemplateById,
  createProposalTemplate,
  updateProposalTemplate,
  deleteProposalTemplate,
  getDefaultProposalTemplate
};
