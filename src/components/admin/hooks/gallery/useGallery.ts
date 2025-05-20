
import { useState, useEffect } from 'react';
import { GalleryImage } from './types';
import { 
  fetchGalleryImages, 
  deleteGalleryImage, 
  updateGalleryImage, 
  uploadGalleryImages 
} from './galleryApi';
import { supabase } from '@/integrations/supabase/client';

export const useGallery = () => {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAndSetGalleryImages = async () => {
    setIsLoading(true);
    const images = await fetchGalleryImages();
    setGalleryImages(images);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchAndSetGalleryImages();
    
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
          fetchAndSetGalleryImages();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleDeleteImage = async (imageToDelete: GalleryImage) => {
    return await deleteGalleryImage(imageToDelete);
  };

  const handleUpdateImage = async (id: string, title: string, description: string | null) => {
    return await updateGalleryImage(id, title, description);
  };

  const handleUploadImages = async (
    files: File[],
    title: string,
    description: string | null
  ): Promise<number> => {
    return await uploadGalleryImages(files, title, description, galleryImages.length);
  };

  return {
    galleryImages,
    isLoading,
    fetchGalleryImages: fetchAndSetGalleryImages,
    deleteImage: handleDeleteImage,
    updateImage: handleUpdateImage,
    uploadImages: handleUploadImages,
  };
};
