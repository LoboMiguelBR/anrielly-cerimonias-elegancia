
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GalleryImage } from '../hooks/useGallery';

interface ImageEditProps {
  open: boolean;
  onClose: () => void;
  onSave: (id: string, title: string, description: string | null) => Promise<boolean>;
  image: GalleryImage | null;
}

const ImageEdit = ({ open, onClose, onSave, image }: ImageEditProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [imageTitle, setImageTitle] = useState('');
  const [imageDescription, setImageDescription] = useState('');

  // Update form when image changes
  useState(() => {
    if (image) {
      setImageTitle(image.title);
      setImageDescription(image.description || '');
    }
  });

  const handleSave = async () => {
    if (!image || !imageTitle) {
      return;
    }
    
    setIsLoading(true);
    
    const success = await onSave(
      image.id, 
      imageTitle, 
      imageDescription || null
    );
    
    if (success) {
      handleClose();
    }
    
    setIsLoading(false);
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Imagem</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4">
          {image && (
            <div className="mx-auto">
              <img 
                src={image.image_url} 
                alt={image.title} 
                className="w-40 h-40 object-cover rounded-md"
              />
            </div>
          )}
          
          <div className="grid gap-2">
            <Label htmlFor="edit-title">Título da Imagem</Label>
            <Input
              id="edit-title"
              value={imageTitle}
              onChange={(e) => setImageTitle(e.target.value)}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="edit-description">Descrição (opcional)</Label>
            <Textarea
              id="edit-description"
              value={imageDescription}
              onChange={(e) => setImageDescription(e.target.value)}
              rows={3}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isLoading}
          >
            {isLoading ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImageEdit;
