import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { GalleryImage } from './types';
import { normalizeImageUrl } from '@/utils/imageUtils';

export const useGalleryImages = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Proteção contra execução duplicada em ambientes de dev (React.StrictMode)
  const isInitialized = useRef(false);

  const fetchGalleryImages = async () => {
    console.log('[useGalleryImages] Executando fetchGalleryImages...');
    console.log('[useGalleryImages] supabase client:', supabase);

    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('order_index');

      if (error) throw error;

      if (data && data.length > 0) {
        console.log('[useGalleryImages] Imagens carregadas:', data.length);

        const validatedImages = data.map((img) => {
          const normalizedUrl = img.image_url
            ? normalizeImageUrl(img.image_url)
            : '/placeholder.svg';
          return { ...img, image_url: normalizedUrl };
        });

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
    if (isInitialized.current) {
      console.log('[useGalleryImages] Já inicializado, pulando...');
      return;
    }
    isInitialized.current = true;

    console.log('[useGalleryImages] Inicializando fetch com segurança...');

    const timeout = setTimeout(() => {
      fetchGalleryImages();
    }, 100);  // Pequeno atraso para garantir que supabase client está pronto.

    const channel = supabase
      .channel('public:gallery')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'gallery' },
        () => {
          console.log('[useGalleryImages] Alteração detectada na galeria, recarregando...');
          fetchGalleryImages();
        }
      )
      .subscribe((status) => {
        console.log(`[useGalleryImages] Estado da subscrição: ${status}`);
        if (status === 'SUBSCRIBED') {
          console.log('[useGalleryImages] Subscrito para alterações na galeria');
        }
      });

    return () => {
      clearTimeout(timeout);
      console.log('[useGalleryImages] Limpando subscrição de realtime...');
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    images,
    isLoading,
    error,
    fetchGalleryImages,
  };
};
