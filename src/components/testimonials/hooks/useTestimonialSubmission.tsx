
import { useState } from 'react';
import { uploadTestimonialImage, submitTestimonial } from '@/components/admin/hooks/testimonials/api/upload';

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
    setIsSubmitting(true);

    try {
      let imageUrl = null;
      
      // Upload image if selected
      if (uploadImage) {
        imageUrl = await uploadTestimonialImage(uploadImage);
      }
      
      // Submit testimonial
      const success = await submitTestimonial(formData, imageUrl);
      
      if (success) {
        resetForm();
      }
      
      return success;
      
    } catch (error: any) {
      console.error('Erro ao enviar depoimento:', error);
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
