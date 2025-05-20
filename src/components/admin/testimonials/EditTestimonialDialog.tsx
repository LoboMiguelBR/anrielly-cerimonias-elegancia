
import { useState, useEffect } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Testimonial } from '../hooks/useTestimonials';

interface EditTestimonialDialogProps {
  isOpen: boolean;
  isSubmitting: boolean;
  testimonial: Testimonial | null;
  onClose: () => void;
  onSubmit: (testimonial: Testimonial, formData: { name: string; role: string; quote: string }, uploadImage: File | null) => Promise<boolean>;
}

const EditTestimonialDialog = ({ 
  isOpen, 
  isSubmitting, 
  testimonial, 
  onClose, 
  onSubmit 
}: EditTestimonialDialogProps) => {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    quote: '',
  });
  const [uploadImage, setUploadImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');

  // Update form when testimonial changes
  useEffect(() => {
    if (testimonial) {
      setFormData({
        name: testimonial.name,
        role: testimonial.role,
        quote: testimonial.quote,
      });
      setPreviewUrl(testimonial.image_url || '');
    }
  }, [testimonial]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setUploadImage(null);
      return;
    }
    
    setUploadImage(file);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!testimonial) return;
    
    const success = await onSubmit(testimonial, formData, uploadImage);
    if (success) {
      setUploadImage(null);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Depoimento</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4">
          {previewUrl ? (
            <div className="relative mx-auto w-24 h-24">
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="w-full h-full object-cover rounded-full"
              />
              {uploadImage && (
                <button
                  onClick={() => {
                    setUploadImage(null);
                    setPreviewUrl(testimonial?.image_url || '');
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <label htmlFor="edit-avatar" className="flex flex-col items-center justify-center w-24 h-24 border-2 border-gray-300 border-dashed rounded-full cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center">
                  <Upload className="w-6 h-6 mb-1 text-gray-400" />
                  <p className="text-xs text-gray-500">Avatar</p>
                </div>
                <input
                  id="edit-avatar"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="edit-name">Nome</Label>
            <Input
              id="edit-name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="edit-role">Identificação</Label>
            <Input
              id="edit-role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="edit-quote">Depoimento</Label>
            <Textarea
              id="edit-quote"
              name="quote"
              value={formData.quote}
              onChange={handleInputChange}
              rows={4}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditTestimonialDialog;
