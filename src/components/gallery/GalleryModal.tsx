
import React from 'react';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
  imageTitle: string;
}

const GalleryModal: React.FC<GalleryModalProps> = ({ 
  isOpen, 
  onClose, 
  imageUrl, 
  imageTitle 
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-1 bg-transparent border-none">
        <DialogTitle className="sr-only">
          <VisuallyHidden>{imageTitle || 'Imagem ampliada'}</VisuallyHidden>
        </DialogTitle>
        <img 
          src={imageUrl || ''} 
          alt={imageTitle || 'Imagem ampliada'} 
          className="w-full h-auto rounded-lg"
          onError={(e) => {
            console.error(`Failed to load enlarged image: ${imageUrl}`);
            (e.target as HTMLImageElement).src = '/placeholder.svg';
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default GalleryModal;
