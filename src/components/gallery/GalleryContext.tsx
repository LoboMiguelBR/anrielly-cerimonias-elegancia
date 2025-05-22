
import { createContext, useContext, useState, ReactNode } from 'react';
import { useGalleryImages } from './useGalleryImages';
import { DisplayImage } from './types';

interface GalleryContextType {
  displayImages: DisplayImage[];
  isLoading: boolean;
  error: string | null;
  fetchGalleryImages: () => Promise<void>;
  openImageModal: (url: string, title: string, description: string | null) => void;
}

const GalleryContext = createContext<GalleryContextType | undefined>(undefined);

export const GalleryProvider = ({ children }: { children: ReactNode }) => {
  const { images, isLoading, error, fetchGalleryImages } = useGalleryImages();
  const [modalImage, setModalImage] = useState<{
    url: string;
    title: string;
    description: string | null;
  } | null>(null);

  const displayImages = images.map(img => ({
    id: img.id,
    url: img.image_url,
    title: img.title,
    description: img.description
  }));

  const openImageModal = (url: string, title: string, description: string | null) => {
    setModalImage({ url, title, description });
    // Note: You would typically open a modal here
    console.log('Opening modal for image:', { url, title, description });
  };

  return (
    <GalleryContext.Provider value={{
      displayImages,
      isLoading,
      error,
      fetchGalleryImages,
      openImageModal
    }}>
      {children}
    </GalleryContext.Provider>
  );
};

export const useGalleryContext = (): GalleryContextType => {
  const context = useContext(GalleryContext);
  if (!context) {
    throw new Error('useGalleryContext must be used within a GalleryProvider');
  }
  return context;
};
