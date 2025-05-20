
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { GalleryImage } from './types';

export const fetchGalleryImages = async (): Promise<GalleryImage[]> => {
  try {
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('order_index', { ascending: true });
      
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    toast.error('Erro ao carregar imagens da galeria');
    return [];
  }
};

export const deleteGalleryImage = async (imageToDelete: GalleryImage): Promise<boolean> => {
  if (!imageToDelete) return false;
  
  try {
    // Extract the file name from the URL
    const url = new URL(imageToDelete.image_url);
    const filePath = url.pathname.split('/').pop();
    
    // Delete image from storage
    if (filePath) {
      const { error: storageError } = await supabase.storage
        .from('gallery')
        .remove([filePath]);
      
      if (storageError) {
        console.error('Storage removal error:', storageError);
        // Continue with deletion from database even if storage removal fails
      }
    }
    
    // Delete from gallery table
    const { error } = await supabase
      .from('gallery')
      .delete()
      .eq('id', imageToDelete.id);
    
    if (error) throw error;
    
    toast.success('Imagem removida com sucesso!');
    return true;
  } catch (error: any) {
    console.error('Error deleting image:', error);
    toast.error(`Erro ao excluir: ${error.message}`);
    return false;
  }
};

export const updateGalleryImage = async (
  id: string, 
  title: string, 
  description: string | null
): Promise<boolean> => {
  if (!id || !title) {
    toast.error('O título é obrigatório');
    return false;
  }
  
  try {
    const { error } = await supabase
      .from('gallery')
      .update({
        title,
        description: description || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
    
    if (error) throw error;
    
    toast.success('Imagem atualizada com sucesso!');
    return true;
  } catch (error: any) {
    console.error('Error updating image:', error);
    toast.error(`Erro ao atualizar: ${error.message}`);
    return false;
  }
};

export const uploadGalleryImages = async (
  files: File[],
  title: string,
  description: string | null,
  currentCount: number
): Promise<number> => {
  if (files.length === 0 || !title) {
    toast.error('Selecione pelo menos um arquivo e forneça um título');
    return 0;
  }
  
  try {
    let successCount = 0;
    const totalFiles = files.length;
    
    // Process each file sequentially
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${i}.${fileExt}`;
      
      // 1. Upload image to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(fileName, file);
      
      if (uploadError) {
        console.error(`Error uploading file ${i+1}:`, uploadError);
        toast.error(`Erro ao fazer upload do arquivo ${i+1}: ${uploadError.message}`);
        continue;  // Skip to next file on error
      }
      
      // 2. Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('gallery')
        .getPublicUrl(fileName);
      
      const publicUrl = publicUrlData.publicUrl;
      
      // 3. Create record in gallery table
      // For multiple files, add numbering to title if not custom per file
      const itemTitle = totalFiles > 1 
        ? `${title} (${i+1}/${totalFiles})` 
        : title;
        
      const { error: insertError } = await supabase
        .from('gallery')
        .insert({
          title: itemTitle,
          description: description || null,
          image_url: publicUrl,
          order_index: currentCount + i
        });
      
      if (insertError) {
        console.error(`Error creating gallery entry ${i+1}:`, insertError);
        toast.error(`Erro ao registrar imagem ${i+1} no banco de dados: ${insertError.message}`);
        continue;  // Skip to next file on error
      }
      
      successCount++;
    }

    return successCount;
  } catch (error: any) {
    console.error('Error uploading images:', error);
    toast.error(`Erro ao fazer upload: ${error.message}`);
    return 0;
  }
};
