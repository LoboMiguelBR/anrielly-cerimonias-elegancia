
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
      
      if (data && data.length > 0) {
        console.log('[useGalleryImages] Imagens da galeria carregadas com sucesso:', data.length, 'imagens');
        
        // Use the centralized normalizeImageUrl function
        const validatedImages = data.map(img => {
          if (!img.image_url) {
            console.warn('[useGalleryImages] Imagem sem URL encontrada:', img.id);
            return { ...img, image_url: '/placeholder.svg' };
          }
          
          const normalizedUrl = normalizeImageUrl(img.image_url);
          console.log(`[useGalleryImages] Imagem ${img.id}: URL original: ${img.image_url} -> Normalizada: ${normalizedUrl}`);
          
          return { ...img, image_url: normalizedUrl };
        });
        
        setImages(validatedImages);
      } else {
        console.log('[useGalleryImages] Nenhuma imagem encontrada no banco de dados');
        setImages([]);
        setError('Nenhuma imagem encontrada. Por favor, adicione imagens à galeria.');
      }
    } catch (error: any) {
      console.error('[useGalleryImages] Erro ao carregar imagens da galeria:', error);
      setError(error.message || 'Erro ao carregar imagens da galeria');
      toast.error('Não foi possível carregar a galeria de imagens', {
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleryImages();
    
    // Set up realtime subscription
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
          console.log('[useGalleryImages] Mudanças detectadas na galeria, recarregando...');
          fetchGalleryImages();
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('[useGalleryImages] Inscrição para mudanças na galeria ativa');
        }
      });
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    images,
    isLoading,
    error,
    fetchGalleryImages
  };
};
