import { supabase } from '@/integrations/supabase/client';
import { HtmlTemplateData, TemplateSection, TemplateAsset, TemplateSectionType } from './types';
import { toast } from 'sonner';
import { ProposalData } from '@/components/admin/hooks/proposal';
import { convertToVariablesRecord, convertToSectionType } from './utils/converters';

// Re-export all the services from the separate files
export * from './services/templateFetchService';
export * from './services/templateManagementService';
export * from './services/defaultTemplateService';
export * from './services/templatePreviewService';

// Keep the remaining functions that are specific to sections and assets
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
