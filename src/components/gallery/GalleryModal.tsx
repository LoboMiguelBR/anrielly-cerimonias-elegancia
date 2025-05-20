
import React from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
  imageTitle: string;
  imageDescription?: string | null;
}

const GalleryModal: React.FC<GalleryModalProps> = ({ 
  isOpen, 
  onClose, 
  imageUrl, 
  imageTitle,
  imageDescription 
}) => {
  // Fix URL if it contains duplicate paths
  const fixImageUrl = (url: string | null): string => {
    if (!url) return '';
    
    if (url.includes('/v1/object/public/v1/object/public/')) {
      return url.replace('/v1/object/public/v1/object/public/', '/v1/object/public/');
    }
    return url;
  };
  
  const processedUrl = fixImageUrl(imageUrl);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-1 bg-transparent border-none">
        <DialogTitle className="sr-only">
          <VisuallyHidden>{imageTitle || 'Imagem ampliada'}</VisuallyHidden>
        </DialogTitle>
        <DialogDescription className="sr-only">
          {imageDescription || 'Visualização ampliada da imagem'}
        </DialogDescription>
        <div className="relative">
          <img 
            src={processedUrl} 
            alt={imageTitle || 'Imagem ampliada'} 
            className="w-full h-auto rounded-lg"
            onError={(e) => {
              console.error(`Failed to load enlarged image: ${processedUrl}`);
              (e.target as HTMLImageElement).src = '/placeholder.svg';
            }}
          />
          {imageDescription && (
            <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-4 rounded-b-lg">
              <p className="text-sm md:text-base">{imageDescription}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GalleryModal;
