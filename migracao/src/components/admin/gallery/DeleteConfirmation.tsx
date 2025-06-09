
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { GalleryImage } from '../hooks/useGallery';

interface DeleteConfirmationProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  image: GalleryImage | null;
  isDeleting?: boolean;
}

const DeleteConfirmation = ({ 
  open, 
  onClose, 
  onConfirm, 
  image,
  isDeleting = false
}: DeleteConfirmationProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirmar Exclusão</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p>Tem certeza que deseja excluir esta imagem? Esta ação não pode ser desfeita.</p>
          
          {image && (
            <div className="mt-4 flex items-center gap-4">
              <img 
                src={image.image_url} 
                alt={image.title} 
                className="w-20 h-20 object-cover rounded-md"
              />
              <div>
                <p className="font-medium">{image.title}</p>
                {image.description && (
                  <p className="text-sm text-gray-500">{image.description}</p>
                )}
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancelar
          </Button>
          <Button 
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "Excluindo..." : "Excluir Imagem"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmation;
