
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import GalleryImage from './GalleryImage';
import { DisplayImage } from './types';

interface GalleryGridProps {
  isLoading: boolean;
  error: string | null;
  displayImages: DisplayImage[];
  onRetry: () => void;
  onImageClick: (url: string, title: string, description: string | null) => void;
}

const GalleryGrid: React.FC<GalleryGridProps> = ({
  isLoading,
  error,
  displayImages,
  onRetry,
  onImageClick
}) => {

  console.log('[GalleryGrid] isLoading:', isLoading, 'error:', error, 'displayImages:', displayImages);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" aria-busy="true">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={`skeleton-${i}`} className="aspect-square">
            <Skeleton className="h-full w-full" />
          </div>
        ))}
      </div>
    );
  }

  // Always render the grid, even if there's an error or no images
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {displayImages.length > 0 ? (
        displayImages.map((image, index) => (
          <GalleryImage
            key={image.id}
            url={image.url}
            title={image.title}
            description={image.description}
            index={index}
            onClick={() => onImageClick(image.url, image.title, image.description)}
          />
        ))
      ) : (
        // Display placeholder items when no images
        Array.from({ length: 4 }, (_, i) => (
          <div 
            key={`empty-${i}`} 
            className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center"
          >
            <p className="text-gray-400 text-sm">Imagem indisponível</p>
          </div>
        ))
      )}

      {/* Show error message if there is one, but don't prevent grid display */}
      {error && (
        <div className="col-span-full py-4 text-center text-red-500" role="alert">
          <p>{error}</p>
          <div className="mt-4">
            <button 
              onClick={onRetry}
              className="px-4 py-2 bg-gold/80 text-white rounded-md hover:bg-gold transition-colors"
              aria-label="Tentar recarregar galeria"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryGrid;
