import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { GalleryImage } from './types';
import { normalizeImageUrl } from '@/utils/imageUtils';

export const useGalleryImages = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGalleryImages = async () => {
    console.log('[useGalleryImages] Executando fetchGalleryImages...');
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('order_index');

      if (error) throw error;

      if (data?.length) {
        console.log('[useGalleryImages] Imagens carregadas:', data.length);
        const validatedImages = data.map((img) => ({
          ...img,
          image_url: img.image_url ? normalizeImageUrl(img.image_url) : '/placeholder.svg',
        }));
        setImages(validatedImages);
      } else {
        console.log('[useGalleryImages] Nenhuma imagem encontrada.');
        setImages([]);
      }
    } catch (error: any) {
      console.error('[useGalleryImages] Erro ao carregar imagens:', error);
      setError(error.message || 'Erro ao carregar imagens.');
      toast.error('Erro ao carregar imagens', { description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('[useGalleryImages] Inicializando fetch e subscrição...');
    fetchGalleryImages();

    const channel = supabase
      .channel('public:gallery')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'gallery' },
        () => {
          console.log('[useGalleryImages] Alteração detectada, recarregando...');
          fetchGalleryImages();
        }
      )
      .subscribe((status) => {
        console.log(`[useGalleryImages] Subscrição status: ${status}`);
      });

    return () => {
      console.log('[useGalleryImages] Limpando subscrição de realtime...');
      supabase.removeChannel(channel);
    };
  }, []); // Executa apenas na montagem

  return {
    images,
    isLoading,
    error,
    fetchGalleryImages,
  };
};
