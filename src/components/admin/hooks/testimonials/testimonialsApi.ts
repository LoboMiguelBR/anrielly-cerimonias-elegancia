
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Testimonial, TestimonialFormData } from './types';
import { uploadTestimonialImage, deleteTestimonialImage } from './api/utils';

export const testimonialsApi = {
  // Get all testimonials
  async getTestimonials(): Promise<Testimonial[]> {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('order_index', { ascending: true });
        
      if (error) throw error;
      
      return (data || []).map(item => ({
        ...item,
        status: item.status as 'pending' | 'approved' | 'rejected'
      })) as Testimonial[];
    } catch (error) {
      console.error('Erro ao carregar depoimentos:', error);
      toast.error('Erro ao carregar depoimentos');
      return [];
    }
  },

  // Create new testimonial
  async createTestimonial(formData: TestimonialFormData): Promise<Testimonial> {
    if (!formData.name || !formData.quote || !formData.email) {
      throw new Error('Nome, email e depoimento são obrigatórios');
    }
    
    try {
      // Get current testimonials to determine order_index
      const { data: testimonials } = await supabase
        .from('testimonials')
        .select('order_index')
        .order('order_index', { ascending: false })
        .limit(1);
      
      const lastOrderIndex = testimonials && testimonials.length > 0 ? testimonials[0].order_index || 0 : 0;
      
      // Create testimonial record
      const { data, error } = await supabase
        .from('testimonials')
        .insert({
          name: formData.name,
          email: formData.email,
          role: formData.role || '',
          quote: formData.quote,
          image_url: formData.image_url || null,
          order_index: lastOrderIndex + 1,
          status: formData.status || 'pending'
        })
        .select()
        .single();
      
      if (error) throw error;
      
      return data as Testimonial;
    } catch (error: any) {
      console.error('Erro ao criar depoimento:', error);
      throw new Error(`Erro ao criar depoimento: ${error.message}`);
    }
  },

  // Update testimonial
  async updateTestimonial(id: string, formData: Partial<TestimonialFormData>): Promise<Testimonial> {
    if (!id) {
      throw new Error('ID é obrigatório para atualização');
    }
    
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .update({
          ...formData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      return data as Testimonial;
    } catch (error: any) {
      console.error('Erro ao atualizar depoimento:', error);
      throw new Error(`Erro ao atualizar depoimento: ${error.message}`);
    }
  },

  // Delete testimonial
  async deleteTestimonial(id: string): Promise<void> {
    if (!id) {
      throw new Error('ID é obrigatório para exclusão');
    }
    
    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error: any) {
      console.error('Erro ao excluir depoimento:', error);
      throw new Error(`Erro ao excluir depoimento: ${error.message}`);
    }
  }
};
