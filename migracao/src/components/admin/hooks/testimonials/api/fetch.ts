
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Testimonial } from '../types';

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

// Fetch only approved testimonials
export const fetchApprovedTestimonials = async (): Promise<Testimonial[]> => {
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('status', 'approved')
      .order('order_index', { ascending: true });
      
    if (error) throw error;
    
    return (data || []) as Testimonial[];
  } catch (error) {
    console.error('Erro ao carregar depoimentos aprovados:', error);
    toast.error('Erro ao carregar depoimentos aprovados');
    return [];
  }
};
