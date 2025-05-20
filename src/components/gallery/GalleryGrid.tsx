
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import GalleryImage from './GalleryImage';
import { GalleryImage as GalleryImageType } from './types';

interface DisplayImage {
  id: string;
  url: string;
  title: string;
  description: string | null;
}

interface GalleryGridProps {
  isLoading: boolean;
  error: string | null;
  displayImages: DisplayImage[];
  onRetry: () => void;
  onImageClick: (url: string, title: string) => void;
}

const GalleryGrid: React.FC<GalleryGridProps> = ({
  isLoading,
  error,
  displayImages,
  onRetry,
  onImageClick
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={`skeleton-${i}`} className="aspect-square">
            <Skeleton className="h-full w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-10 text-center text-red-500">
        {error}
        <div className="mt-4">
          <button 
            onClick={onRetry}
            className="px-4 py-2 bg-gold/80 text-white rounded-md hover:bg-gold transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {displayImages.map((image, index) => (
        <GalleryImage
          key={image.id}
          url={image.url}
          title={image.title}
          description={image.description}
          index={index}
          onClick={() => onImageClick(image.url, image.title)}
        />
      ))}
    </div>
  );
};

export default GalleryGrid;
