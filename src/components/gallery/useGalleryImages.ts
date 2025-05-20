import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { GalleryImage } from './types';
import { normalizeImageUrl } from '@/utils/imageUtils';

export const useGalleryImages = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGalleryImages = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('order_index');

      if (error) throw error;

      const validatedImages = (data || []).map((img) => ({
        ...img,
        image_url: img.image_url ? normalizeImageUrl(img.image_url) : '/placeholder.svg'
      }));

      setImages(validatedImages);
    } catch (error: any) {
      setError(error.message || 'Erro ao carregar imagens.');
      toast.error('Erro ao carregar imagens', { description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleryImages();

    const channel = supabase
      .channel('public:gallery')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'gallery' }, fetchGalleryImages)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { images, isLoading, error, fetchGalleryImages };
};
