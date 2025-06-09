
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface GalleryImage {
  id: string;
  title: string;
  description?: string;
  image_url: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export const useGalleryAdmin = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchImages = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setImages(data || []);
    } catch (error: any) {
      console.error('Erro ao buscar imagens:', error);
      toast.error('Erro ao carregar galeria: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const uploadImage = async (file: File, title: string, description?: string) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `gallery/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('gallery')
        .getPublicUrl(filePath);

      const maxOrderIndex = Math.max(...images.map(img => img.order_index), 0);

      const { data, error } = await supabase
        .from('gallery')
        .insert([{
          title,
          description,
          image_url: publicUrl,
          order_index: maxOrderIndex + 1
        }])
        .select()
        .single();

      if (error) throw error;

      setImages(prev => [...prev, data]);
      toast.success('Imagem adicionada com sucesso!');
      return data;
    } catch (error: any) {
      console.error('Erro ao fazer upload:', error);
      toast.error('Erro ao fazer upload: ' + error.message);
      throw error;
    }
  };

  const updateImage = async (id: string, updates: Partial<GalleryImage>) => {
    try {
      const { data, error } = await supabase
        .from('gallery')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setImages(prev => 
        prev.map(img => img.id === id ? data : img)
      );
      toast.success('Imagem atualizada com sucesso!');
      return data;
    } catch (error: any) {
      console.error('Erro ao atualizar imagem:', error);
      toast.error('Erro ao atualizar imagem: ' + error.message);
      throw error;
    }
  };

  const deleteImage = async (id: string) => {
    try {
      const image = images.find(img => img.id === id);
      if (!image) return;

      // Extrair o caminho do arquivo da URL
      const urlParts = image.image_url.split('/');
      const filePath = `gallery/${urlParts[urlParts.length - 1]}`;

      // Deletar arquivo do storage
      const { error: storageError } = await supabase.storage
        .from('gallery')
        .remove([filePath]);

      if (storageError) {
        console.warn('Erro ao deletar arquivo do storage:', storageError);
      }

      // Deletar registro do banco
      const { error } = await supabase
        .from('gallery')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setImages(prev => prev.filter(img => img.id !== id));
      toast.success('Imagem removida com sucesso!');
    } catch (error: any) {
      console.error('Erro ao remover imagem:', error);
      toast.error('Erro ao remover imagem: ' + error.message);
      throw error;
    }
  };

  const updateOrder = async (imageId: string, newOrderIndex: number) => {
    try {
      const { error } = await supabase
        .from('gallery')
        .update({ order_index: newOrderIndex })
        .eq('id', imageId);

      if (error) throw error;

      setImages(prev => 
        prev.map(img => 
          img.id === imageId ? { ...img, order_index: newOrderIndex } : img
        ).sort((a, b) => a.order_index - b.order_index)
      );
    } catch (error: any) {
      console.error('Erro ao atualizar ordem:', error);
      toast.error('Erro ao atualizar ordem: ' + error.message);
      throw error;
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return {
    images,
    isLoading,
    uploadImage,
    updateImage,
    deleteImage,
    updateOrder,
    refetch: fetchImages
  };
};
