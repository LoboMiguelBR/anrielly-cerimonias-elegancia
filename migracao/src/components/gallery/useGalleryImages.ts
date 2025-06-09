
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
        image_url: normalizeImageUrl(img.image_url)
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

    // Verificar se há sessão ativa antes de criar canal realtime
    const setupRealtimeChannel = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.warn('Sem sessão ativa, pulando realtime para gallery');
          return;
        }

        const channel = supabase
          .channel('public:gallery')
          .on('postgres_changes', { 
            event: '*', 
            schema: 'public', 
            table: 'gallery' 
          }, () => {
            console.log('Gallery realtime event received');
            fetchGalleryImages();
          })
          .subscribe((status) => {
            if (status === 'SUBSCRIBED') {
              console.log('Gallery realtime channel subscribed');
            } else if (status === 'CHANNEL_ERROR') {
              console.warn('Gallery realtime channel error');
            }
          });

        return () => {
          supabase.removeChannel(channel);
        };
      } catch (error) {
        console.warn('Erro ao configurar realtime para gallery:', error);
      }
    };

    const cleanup = setupRealtimeChannel();
    
    return () => {
      if (cleanup) {
        cleanup.then(cleanupFn => cleanupFn && cleanupFn());
      }
    };
  }, []);

  return { images, isLoading, error, fetchGalleryImages };
};
