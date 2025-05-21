
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface TestimonialFormData {
  name: string;
  role: string;
  quote: string;
}

export const useTestimonialSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<TestimonialFormData>({
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

  const clearImage = () => {
    setUploadImage(null);
    setPreviewUrl('');
  };

  const resetForm = () => {
    setFormData({
      name: '',
      role: '',
      quote: ''
    });
    setUploadImage(null);
    setPreviewUrl('');
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.quote) {
      toast.error('Por favor, preencha os campos obrigatórios');
      return false;
    }

    setIsSubmitting(true);

    try {
      let imageUrl = null;
      
      // Upload image if selected
      if (uploadImage) {
        const fileExt = uploadImage.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('testimonials')
          .upload(fileName, uploadImage, {
            cacheControl: '3600',
            upsert: false,
            contentType: uploadImage.type
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
      
      resetForm();
      return true;
      
    } catch (error: any) {
      console.error('Erro ao enviar depoimento:', error);
      toast.error('Erro ao enviar depoimento', {
        description: error.message
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    isSubmitting,
    previewUrl,
    uploadImage,
    handleInputChange,
    handleImageChange,
    clearImage,
    handleSubmit,
    resetForm
  };
};

export default useTestimonialSubmission;
