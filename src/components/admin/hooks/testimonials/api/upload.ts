
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Uploads an image to the testimonials storage bucket
 */
export const uploadTestimonialImage = async (file: File): Promise<string | null> => {
  if (!file) return null;

  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    
    // Upload file with public access
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('testimonials')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type // Ensure correct content type for public access
      });
    
    if (uploadError) throw uploadError;
    
    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('testimonials')
      .getPublicUrl(fileName);
    
    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('Error uploading testimonial image:', error);
    throw error;
  }
};

/**
 * Submit a new testimonial
 */
export const submitTestimonial = async (
  formData: { name: string; role: string; quote: string }, 
  imageUrl: string | null
): Promise<boolean> => {
  if (!formData.name || !formData.quote) {
    toast.error('Por favor, preencha os campos obrigatórios');
    return false;
  }

  try {
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
    
    return true;
    
  } catch (error: any) {
    console.error('Erro ao enviar depoimento:', error);
    toast.error('Erro ao enviar depoimento', {
      description: error.message
    });
    return false;
  }
};
