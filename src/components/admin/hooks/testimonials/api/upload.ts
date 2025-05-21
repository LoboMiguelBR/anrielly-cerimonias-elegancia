
import { supabase } from '@/integrations/supabase/client';
import { uploadTestimonialImage, deleteTestimonialImage } from './utils';
import { fetchAllTestimonials } from './fetch';
import { toast } from 'sonner';
import { Testimonial } from '../types';

// Add a new testimonial
export const addTestimonial = async (
  formData: { name: string; role: string; quote: string }, 
  uploadImage: File | null
): Promise<boolean> => {
  if (!formData.name || !formData.role || !formData.quote) {
    toast.error('Todos os campos de texto são obrigatórios');
    return false;
  }
  
  try {
    let imageUrl = null;
    
    // Upload image if selected
    if (uploadImage) {
      imageUrl = await uploadTestimonialImage(uploadImage);
    }
    
    // Get current testimonials to determine order_index
    const testimonials = await fetchAllTestimonials();
    
    // Create testimonial record
    const { error: insertError } = await supabase
      .from('testimonials')
      .insert({
        name: formData.name,
        role: formData.role,
        quote: formData.quote,
        image_url: imageUrl,
        order_index: testimonials.length,
        status: 'pending' // Default for admin-added testimonials
      });
    
    if (insertError) throw insertError;
    
    toast.success('Depoimento adicionado com sucesso!');
    return true;
    
  } catch (error: any) {
    console.error('Error adding testimonial:', error);
    toast.error(`Erro ao adicionar depoimento: ${error.message}`);
    return false;
  }
};
