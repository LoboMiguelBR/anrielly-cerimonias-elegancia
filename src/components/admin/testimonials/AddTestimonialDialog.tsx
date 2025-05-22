
import { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface AddTestimonialDialogProps {
  isOpen: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (formData: { name: string; role: string; quote: string; email: string }, uploadImage: File | null) => Promise<boolean>;
}

const AddTestimonialDialog = ({ isOpen, isSubmitting, onClose, onSubmit }: AddTestimonialDialogProps) => {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    quote: '',
    email: '',
  });
  const [uploadImage, setUploadImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');

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
      setPreviewUrl('');
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
    const success = await onSubmit(formData, uploadImage);
    if (success) {
      // Reset form
      setFormData({
        name: '',
        role: '',
        quote: '',
        email: '',
      });
      setUploadImage(null);
      setPreviewUrl('');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Depoimento</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4">
          {previewUrl ? (
            <div className="relative mx-auto w-24 h-24">
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="w-full h-full object-cover rounded-full"
              />
              <button
                onClick={() => {
                  setUploadImage(null);
                  setPreviewUrl('');
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <label htmlFor="upload-avatar" className="flex flex-col items-center justify-center w-24 h-24 border-2 border-gray-300 border-dashed rounded-full cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center">
                  <Upload className="w-6 h-6 mb-1 text-gray-400" />
                  <p className="text-xs text-gray-500">Avatar</p>
                </div>
                <input
                  id="upload-avatar"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Nome da pessoa"
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email da pessoa"
              required
            />
            <p className="text-xs text-gray-500">
              O email não será exibido publicamente, apenas usado para notificações.
            </p>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="role">Identificação</Label>
            <Input
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              placeholder="Ex: Noiva em Volta Redonda, Debutante em Barra Mansa"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="quote">Depoimento</Label>
            <Textarea
              id="quote"
              name="quote"
              value={formData.quote}
              onChange={handleInputChange}
              placeholder="O que a pessoa disse sobre seu trabalho..."
              rows={4}
              required
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
            {isSubmitting ? "Salvando..." : "Adicionar Depoimento"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddTestimonialDialog;
