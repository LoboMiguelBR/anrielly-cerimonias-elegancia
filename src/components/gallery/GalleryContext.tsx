
import { createContext, useContext, useState, ReactNode } from 'react';
import { useGalleryImages } from './useGalleryImages';
import { DisplayImage } from './types';

interface GalleryContextType {
  selectedImage: string | null;
  selectedImageTitle: string;
  selectedImageDescription: string | null;
  setSelectedImage: (url: string | null, title: string, description: string | null) => void;
  displayImages: DisplayImage[];
  isLoading: boolean;
  error: string | null;
  fetchGalleryImages: () => Promise<void>;
}

const GalleryContext = createContext<GalleryContextType | undefined>(undefined);

export const GalleryProvider = ({ children }: { children: ReactNode }) => {
  const [selectedImage, setSelectedImageState] = useState<string | null>(null);
  const [selectedImageTitle, setSelectedImageTitle] = useState<string>('');
  const [selectedImageDescription, setSelectedImageDescription] = useState<string | null>(null);
  
  const { images, isLoading, error, fetchGalleryImages, staticImages } = useGalleryImages();

  // Convert database images or use static fallback
  const displayImages = images.length > 0 
    ? images.map(img => ({ 
        id: img.id, 
        url: img.image_url, 
        title: img.title, 
        description: img.description 
      }))
    : staticImages.map((url, i) => ({ 
        id: `static-${i}`, 
        url, 
        title: `Imagem ${i+1}`, 
        description: null 
      }));

  const setSelectedImage = (url: string | null, title: string, description: string | null) => {
    setSelectedImageState(url);
    setSelectedImageTitle(title);
    setSelectedImageDescription(description);
  };

  return (
    <GalleryContext.Provider
      value={{
        selectedImage,
        selectedImageTitle,
        selectedImageDescription,
        setSelectedImage,
        displayImages,
        isLoading,
        error,
        fetchGalleryImages,
      }}
    >
      {children}
    </GalleryContext.Provider>
  );
};

export const useGalleryContext = (): GalleryContextType => {
  const context = useContext(GalleryContext);
  if (context === undefined) {
    throw new Error('useGalleryContext must be used within a GalleryProvider');
  }
  return context;
};
