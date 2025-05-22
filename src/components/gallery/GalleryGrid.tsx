
import React from 'react';
import { DisplayImage } from './types';
import GalleryImage from './GalleryImage';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';

interface GalleryGridProps {
  isLoading: boolean;
  error: string | null;
  displayImages: DisplayImage[];
  onRetry: () => Promise<void>;
  onImageClick: (url: string, title: string, description: string | null) => void;
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
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={onRetry} variant="outline">
          <RefreshCcw className="mr-2 h-4 w-4" /> Tentar novamente
        </Button>
      </div>
    );
  }

  if (displayImages.length === 0) {
    return <p className="text-center py-12">Nenhuma imagem disponível na galeria.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {displayImages.map((image) => (
        <GalleryImage
          key={image.id}
          image={image}
          onClick={() => onImageClick(image.url, image.title, image.description)}
        />
      ))}
    </div>
  );
};

export default GalleryGrid;
