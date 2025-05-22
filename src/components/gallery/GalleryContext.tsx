
import { createContext, useContext, useState, ReactNode } from 'react';
import { useGalleryImages } from './useGalleryImages';
import { DisplayImage } from './types';
import GalleryModal from './GalleryModal';

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

  // Function to open the image modal with the selected image
  const openImageModal = (url: string, title: string, description: string | null) => {
    console.log('Opening modal for image:', { url, title, description });
    setModalImage({ url, title, description });
  };
  
  // Function to close the image modal
  const closeImageModal = () => {
    setModalImage(null);
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
      {/* Render the GalleryModal directly in the provider */}
      <GalleryModal
        isOpen={modalImage !== null}
        onClose={closeImageModal}
        imageUrl={modalImage?.url || null}
        imageTitle={modalImage?.title || ''}
        imageDescription={modalImage?.description}
      />
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
