
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export interface GalleryImage {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  order_index: number | null;
  created_at: string;
  updated_at: string;
}

export const useGallery = () => {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchGalleryImages();
    
    // Ensure bucket exists when component mounts
    const ensureBucketExists = async () => {
      try {
        const { data, error } = await supabase.storage.getBucket('gallery');
        
        if (error && error.message.includes('bucket not found')) {
          const { error: createError } = await supabase.storage.createBucket('gallery', {
            public: true,
            fileSizeLimit: 10485760, // 10MB
            allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
          });
          
          if (createError) {
            console.error('Error creating gallery bucket:', createError);
            toast.error('Erro ao criar bucket de armazenamento');
          } else {
            console.log('Gallery bucket created successfully');
          }
        } else if (error) {
          console.error('Error checking gallery bucket:', error);
        }
      } catch (err) {
        console.error('Unexpected error checking bucket:', err);
      }
    };
    
    ensureBucketExists();
    
    const channel = supabase
      .channel('public:gallery')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'gallery' 
        },
        () => {
          fetchGalleryImages();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchGalleryImages = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('order_index', { ascending: true });
        
      if (error) throw error;
      
      setGalleryImages(data || []);
    } catch (error) {
      console.error('Error fetching gallery images:', error);
      toast.error('Erro ao carregar imagens da galeria');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteImage = async (imageToDelete: GalleryImage) => {
    if (!imageToDelete) return;
    
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

  const updateImage = async (id: string, title: string, description: string | null) => {
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

  const uploadImages = async (
    files: File[],
    title: string,
    description: string | null
  ): Promise<number> => {
    if (files.length === 0 || !title) {
      toast.error('Selecione pelo menos um arquivo e forneça um título');
      return 0;
    }
    
    try {
      // First check if bucket exists
      const { data: bucketData, error: bucketError } = await supabase.storage.getBucket('gallery');
      
      if (bucketError && bucketError.message.includes('bucket not found')) {
        const { error: createError } = await supabase.storage.createBucket('gallery', {
          public: true,
          fileSizeLimit: 10485760,
          allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
        });
        
        if (createError) {
          throw new Error(`Erro ao criar bucket de armazenamento: ${createError.message}`);
        }
      } else if (bucketError) {
        throw new Error(`Erro ao verificar bucket de armazenamento: ${bucketError.message}`);
      }
      
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
            order_index: galleryImages.length + i
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

  return {
    galleryImages,
    isLoading,
    fetchGalleryImages,
    deleteImage,
    updateImage,
    uploadImages,
  };
};
