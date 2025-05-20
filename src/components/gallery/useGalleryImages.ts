
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { GalleryImage } from './types';

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
        console.log('Gallery images fetched successfully:', data.length, 'images');
        
        // Fix image URLs to avoid the 'v1/object/public/v1/object/public' pattern
        const validatedImages = data.map(img => {
          if (!img.image_url) {
            console.warn('Image without URL found:', img.id);
            return img;
          }
          
          let fixedUrl = img.image_url;
          
          // Fix duplicate URLs
          if (img.image_url.includes('/v1/object/public/v1/object/public/')) {
            fixedUrl = img.image_url.replace('/v1/object/public/v1/object/public/', '/v1/object/public/');
            console.log('Fixed duplicate path in URL:', fixedUrl);
          }
          
          // If the URL is from Supabase Storage, regenerate the public URL
          if (fixedUrl.includes('storage.googleapis.com') || fixedUrl.includes('supabase.co/storage')) {
            try {
              // Extract bucket and file path
              const url = new URL(fixedUrl);
              const pathParts = url.pathname.split('/');
              // Find bucket and file name
              const bucketIndex = pathParts.findIndex(part => part === 'object' || part === 'storage');
              
              if (bucketIndex !== -1 && pathParts.length > bucketIndex + 2) {
                const bucket = pathParts[bucketIndex + 1];
                const filePath = pathParts.slice(bucketIndex + 2).join('/');
                
                console.log(`Regenerating URL for bucket: ${bucket}, path: ${filePath}`);
                
                const { data: publicUrlData } = supabase.storage
                  .from(bucket)
                  .getPublicUrl(filePath);
                
                if (publicUrlData?.publicUrl) {
                  console.log(`Regenerated URL: ${publicUrlData.publicUrl}`);
                  return { ...img, image_url: publicUrlData.publicUrl };
                }
              }
            } catch (urlError) {
              console.error('Error fixing image URL:', urlError);
            }
          }
          
          return { ...img, image_url: fixedUrl };
        });
        
        setImages(validatedImages);
      } else {
        console.log('No gallery images found in the database, using fallback static images');
        setImages([]);
      }
    } catch (error: any) {
      console.error('Error fetching gallery images:', error);
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
          fetchGalleryImages();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    images,
    isLoading,
    error,
    fetchGalleryImages,
    staticImages: [
      "/lovable-uploads/c8bfe776-c594-4d05-bc65-9472d76d5323.png",
      "/lovable-uploads/ea42111a-a240-43c5-84f8-067b63793694.png",
      "/lovable-uploads/e722dd38-54b1-498a-adeb-7a5a126035fd.png",
      "/lovable-uploads/d856da09-1255-4e7d-a9d6-0a2a04edac9d.png",
      "/lovable-uploads/2d2b8e86-59cd-4e39-8d62-d5843123bb08.png",
      "/lovable-uploads/38a84af5-3e22-4ae4-bcea-ef49e9e81209.png",
      "/lovable-uploads/c2283906-77d8-4d1c-a901-5453ea6dd515.png",
      "/lovable-uploads/322b9c8a-c27a-42c2-bbfd-b8fbcfd2c449.png"
    ]
  };
};
