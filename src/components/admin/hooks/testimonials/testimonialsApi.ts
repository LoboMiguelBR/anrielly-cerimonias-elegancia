
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Testimonial } from './types';

// Verificar se o bucket existe sem tentar criá-lo
export const ensureTestimonialsBucketExists = async (): Promise<boolean> => {
  try {
    // Utilizamos a função correta para listar buckets e verificar se o bucket 'testimonials' existe
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error('Erro ao verificar buckets:', error);
      return false;
    }
    
    const testimonialsBucketExists = buckets.some(bucket => bucket.name === 'testimonials');
    
    if (!testimonialsBucketExists) {
      console.warn('O bucket "testimonials" não existe');
    }
    
    return testimonialsBucketExists;
  } catch (err) {
    console.error('Erro inesperado ao verificar bucket:', err);
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
    
    // Cast the status field to the correct type
    return (data || []).map(item => ({
      ...item,
      status: item.status as 'pending' | 'approved' | 'rejected'
    })) as Testimonial[];
  } catch (error) {
    console.error('Erro ao carregar depoimentos:', error);
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
    // Check bucket but don't try to create it
    if (uploadImage) {
      const bucketExists = await ensureTestimonialsBucketExists();
      if (!bucketExists) {
        console.warn('Testimonials bucket may not exist or user lacks permission to check');
      }
    }
    
    let imageUrl = null;
    
    // Upload image if selected
    if (uploadImage) {
      const fileExt = uploadImage.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('testimonials')
        .upload(fileName, uploadImage, {
          cacheControl: '3600',
          upsert: false
        });
      
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
        .upload(fileName, uploadImage, {
          cacheControl: '3600',
          upsert: false
        });
      
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

// Update testimonial status
export const updateTestimonialStatus = async (
  testimonial: Testimonial, 
  newStatus: 'pending' | 'approved' | 'rejected'
): Promise<boolean> => {
  if (!testimonial) return false;
  
  try {
    const { error } = await supabase
      .from('testimonials')
      .update({
        status: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', testimonial.id);
    
    if (error) throw error;
    
    const statusMessages = {
      pending: 'Depoimento marcado como pendente',
      approved: 'Depoimento aprovado com sucesso',
      rejected: 'Depoimento rejeitado'
    };
    
    toast.success(statusMessages[newStatus]);
    return true;
    
  } catch (error: any) {
    console.error('Error updating testimonial status:', error);
    toast.error(`Erro ao atualizar status do depoimento: ${error.message}`);
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
