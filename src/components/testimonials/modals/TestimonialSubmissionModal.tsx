
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import AvatarUpload from './AvatarUpload';
import TestimonialForm from './TestimonialForm';
import useTestimonialSubmission from '../hooks/useTestimonialSubmission';

interface TestimonialSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TestimonialSubmissionModal = ({ isOpen, onClose }: TestimonialSubmissionModalProps) => {
  const { 
    formData, 
    isSubmitting, 
    previewUrl, 
    handleInputChange, 
    handleImageChange, 
    clearImage, 
    handleSubmit 
  } = useTestimonialSubmission();

  const onSubmit = async () => {
    const success = await handleSubmit();
    if (success) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Envie seu Depoimento</DialogTitle>
        </DialogHeader>
        
        <div className="text-center text-sm text-gray-500 bg-gray-50 p-3 rounded-md mb-4">
          Seu depoimento será exibido após análise e aprovação.
        </div>
        
        <div className="grid gap-4">
          <AvatarUpload 
            previewUrl={previewUrl} 
            onImageChange={handleImageChange}
            onClearImage={clearImage}
          />

          <TestimonialForm 
            formData={formData}
            onChange={handleInputChange}
          />
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button 
            onClick={onSubmit} 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Enviando..." : "Enviar Depoimento"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TestimonialSubmissionModal;
