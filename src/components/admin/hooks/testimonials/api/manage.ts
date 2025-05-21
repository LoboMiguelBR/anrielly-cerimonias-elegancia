
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Testimonial } from '../types';
import { uploadTestimonialImage, deleteTestimonialImage } from './utils';

// Add new testimonial (this was missing and causing the error)
export const addTestimonial = async (
  formData: { name: string; role: string; quote: string }, 
  uploadImage: File | null
): Promise<boolean> => {
  if (!formData.name || !formData.quote) {
    toast.error('Nome e depoimento são obrigatórios');
    return false;
  }
  
  try {
    // Upload image if selected
    let imageUrl = null;
    if (uploadImage) {
      imageUrl = await uploadTestimonialImage(uploadImage);
    }
    
    // Get current testimonials to determine order_index
    const { data: testimonials } = await supabase
      .from('testimonials')
      .select('order_index')
      .order('order_index', { ascending: false })
      .limit(1);
    
    const lastOrderIndex = testimonials && testimonials.length > 0 ? testimonials[0].order_index || 0 : 0;
    
    // Create testimonial record
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
        await deleteTestimonialImage(testimonial.image_url);
      }
      
      // Upload new image
      imageUrl = await uploadTestimonialImage(uploadImage);
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
      await deleteTestimonialImage(testimonial.image_url);
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
