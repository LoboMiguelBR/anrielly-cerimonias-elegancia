
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Upload, X } from 'lucide-react';

interface TestimonialSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TestimonialSubmissionModal = ({ isOpen, onClose }: TestimonialSubmissionModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    quote: ''
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
    if (!formData.name || !formData.quote) {
      toast.error('Por favor, preencha os campos obrigatórios');
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl = null;
      
      // Upload image if selected
      if (uploadImage) {
        // Check if bucket exists
        const { data: buckets } = await supabase.storage.listBuckets();
        const testimonialsBucketExists = buckets?.some(bucket => bucket.name === 'testimonials');
        
        if (!testimonialsBucketExists) {
          // Create bucket if it doesn't exist
          const { error: createBucketError } = await supabase.storage.createBucket('testimonials', {
            public: true
          });
          
          if (createBucketError) {
            console.error('Erro ao criar bucket:', createBucketError);
            throw createBucketError;
          }
        }
        
        const fileExt = uploadImage.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('testimonials')
          .upload(fileName, uploadImage, {
            cacheControl: '3600',
            upsert: false,
            contentType: uploadImage.type // Adicionado: Garante que o tipo de conteúdo seja corretamente definido
          });
        
        if (uploadError) throw uploadError;
        
        // Get public URL
        const { data: publicUrlData } = supabase.storage
          .from('testimonials')
          .getPublicUrl(fileName);
        
        imageUrl = publicUrlData.publicUrl;
      }
      
      // Get current testimonials to determine order_index
      const { data: testimonials } = await supabase
        .from('testimonials')
        .select('order_index')
        .order('order_index', { ascending: false })
        .limit(1);
      
      const lastOrderIndex = testimonials && testimonials.length > 0 ? testimonials[0].order_index || 0 : 0;
      
      // Create testimonial record with pending status
      const { error: insertError } = await supabase
        .from('testimonials')
        .insert({
          name: formData.name,
          role: formData.role || '',
          quote: formData.quote,
          image_url: imageUrl,
          order_index: lastOrderIndex + 1,
          status: 'pending' // Default status for new testimonials
        });
      
      if (insertError) throw insertError;
      
      toast.success('Depoimento enviado com sucesso!', {
        description: 'Seu depoimento será exibido após análise e aprovação.'
      });
      
      // Reset form
      setFormData({
        name: '',
        role: '',
        quote: ''
      });
      setUploadImage(null);
      setPreviewUrl('');
      
      // Close modal
      onClose();
    } catch (error: any) {
      console.error('Erro ao enviar depoimento:', error);
      toast.error('Erro ao enviar depoimento', {
        description: error.message
      });
    } finally {
      setIsSubmitting(false);
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
            <Label htmlFor="name">Nome *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Seu nome"
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="role">Identificação <span className="text-gray-400 text-xs">(opcional)</span></Label>
            <Input
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              placeholder="Ex: Noiva em Volta Redonda, Debutante em Barra Mansa"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="quote">Seu Depoimento *</Label>
            <Textarea
              id="quote"
              name="quote"
              value={formData.quote}
              onChange={handleInputChange}
              placeholder="Compartilhe sua experiência..."
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
            {isSubmitting ? "Enviando..." : "Enviar Depoimento"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TestimonialSubmissionModal;
