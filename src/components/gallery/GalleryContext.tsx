
import { createContext, useContext, useState, ReactNode } from 'react';
import { useGalleryImages } from './useGalleryImages';
import { DisplayImage } from './types';

interface GalleryContextType {
  displayImages: DisplayImage[];
  isLoading: boolean;
  error: string | null;
  fetchGalleryImages: () => Promise<void>;
}

const GalleryContext = createContext<GalleryContextType | undefined>(undefined);

export const GalleryProvider = ({ children }: { children: ReactNode }) => {
  const { images, isLoading, error, fetchGalleryImages } = useGalleryImages();

  const displayImages = images.map(img => ({
    id: img.id,
    url: img.image_url,
    title: img.title,
    description: img.description
  }));

  return (
    <GalleryContext.Provider value={{
      displayImages,
      isLoading,
      error,
      fetchGalleryImages
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
