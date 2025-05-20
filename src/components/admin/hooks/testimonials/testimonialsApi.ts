
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Testimonial } from './types';

// Ensure testimonials bucket exists
export const ensureTestimonialsBucketExists = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.storage.getBucket('testimonials');
    
    if (error && error.message.includes('bucket not found')) {
      const { error: createError } = await supabase.storage.createBucket('testimonials', {
        public: true,
        fileSizeLimit: 10485760, // 10MB
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
      });
      
      if (createError) {
        console.error('Error creating testimonials bucket:', createError);
        toast.error('Erro ao criar bucket de armazenamento para depoimentos');
        return false;
      } 
      
      console.log('Testimonials bucket created successfully');
      return true;
    } else if (error) {
      console.error('Error checking testimonials bucket:', error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Unexpected error checking bucket:', err);
    return false;
  }
};

// Fetch all testimonials
export const fetchAllTestimonials = async (): Promise<Testimonial[]> => {
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('order_index', { ascending: true });
      
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    toast.error('Erro ao carregar depoimentos');
    return [];
  }
};

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
    // Check and create bucket if needed
    if (uploadImage) {
      const bucketExists = await ensureTestimonialsBucketExists();
      if (!bucketExists) {
        throw new Error('Erro ao verificar bucket de armazenamento');
      }
    }
    
    let imageUrl = null;
    
    // Upload image if selected
    if (uploadImage) {
      const fileExt = uploadImage.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('testimonials')
        .upload(fileName, uploadImage);
      
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('testimonials')
        .getPublicUrl(fileName);
      
      imageUrl = publicUrlData.publicUrl;
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
        order_index: testimonials.length
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

// Update existing testimonial
export const updateTestimonial = async (
  testimonial: Testimonial, 
  formData: { name: string; role: string; quote: string }, 
  uploadImage: File | null
): Promise<boolean> => {
  if (!testimonial || !formData.name || !formData.role || !formData.quote) {
    toast.error('Todos os campos de texto são obrigatórios');
    return false;
  }
  
  try {
    let imageUrl = testimonial.image_url;
    
    // Upload new image if selected
    if (uploadImage) {
      // Remove old image if exists
      if (testimonial.image_url) {
        const oldFileName = testimonial.image_url.split('/').pop();
        if (oldFileName) {
          await supabase.storage
            .from('testimonials')
            .remove([oldFileName]);
        }
      }
      
      // Upload new image
      const fileExt = uploadImage.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('testimonials')
        .upload(fileName, uploadImage);
      
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('testimonials')
        .getPublicUrl(fileName);
      
      imageUrl = publicUrlData.publicUrl;
    }
    
    // Update testimonial record
    const { error } = await supabase
      .from('testimonials')
      .update({
        name: formData.name,
        role: formData.role,
        quote: formData.quote,
        image_url: imageUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', testimonial.id);
    
    if (error) throw error;
    
    toast.success('Depoimento atualizado com sucesso!');
    return true;
    
  } catch (error: any) {
    console.error('Error updating testimonial:', error);
    toast.error(`Erro ao atualizar depoimento: ${error.message}`);
    return false;
  }
};

// Delete testimonial
export const deleteTestimonial = async (testimonial: Testimonial): Promise<boolean> => {
  if (!testimonial) return false;
  
  try {
    // Remove image from storage if exists
    if (testimonial.image_url) {
      const fileName = testimonial.image_url.split('/').pop();
      if (fileName) {
        const { error: storageError } = await supabase.storage
          .from('testimonials')
          .remove([fileName]);
        
        if (storageError) {
          console.error('Storage removal error:', storageError);
          // Continue with deletion from database even if storage removal fails
        }
      }
    }
    
    // Delete from testimonials table
    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', testimonial.id);
    
    if (error) throw error;
    
    toast.success('Depoimento removido com sucesso!');
    return true;
    
  } catch (error: any) {
    console.error('Error deleting testimonial:', error);
    toast.error(`Erro ao excluir: ${error.message}`);
    return false;
  }
};
