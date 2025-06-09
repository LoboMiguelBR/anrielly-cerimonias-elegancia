
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Testimonial } from '../hooks/useTestimonials';

interface DeleteTestimonialDialogProps {
  isOpen: boolean;
  testimonial: Testimonial | null;
  onClose: () => void;
  onConfirm: () => Promise<boolean>;
}

const DeleteTestimonialDialog = ({ 
  isOpen, 
  testimonial, 
  onClose, 
  onConfirm 
}: DeleteTestimonialDialogProps) => {
  const handleDelete = async () => {
    const success = await onConfirm();
    if (success) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirmar Exclusão</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p>Tem certeza que deseja excluir este depoimento? Esta ação não pode ser desfeita.</p>
          
          {testimonial && (
            <div className="mt-4 flex items-center gap-4">
              {testimonial.image_url ? (
                <img 
                  src={testimonial.image_url} 
                  alt={testimonial.name} 
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500 font-bold">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
              )}
              <div>
                <p className="font-medium">{testimonial.name}</p>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button 
            variant="destructive"
            onClick={handleDelete}
          >
            Excluir Depoimento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteTestimonialDialog;
