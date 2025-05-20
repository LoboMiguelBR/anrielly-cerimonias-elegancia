
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { getStaticTestimonials } from './StaticTestimonials';

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  image_url: string | null;
}

export const useTestimonialsData = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchTestimonials = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('order_index');

      if (error) {
        throw error;
      }
      
      console.log('[Testimonials] Depoimentos carregados:', data?.length);
      
      if (data && data.length > 0) {
        setTestimonials(data || []);
      } else {
        // Fallback para depoimentos estáticos quando não há dados no banco
        console.log('[Testimonials] Usando depoimentos estáticos de fallback');
        setTestimonials(getStaticTestimonials().map(item => ({
          id: item.id,
          name: item.name,
          role: item.role,
          quote: item.quote,
          image_url: item.imageUrl
        })));
      }
    } catch (error: any) {
      console.error('[Testimonials] Erro ao carregar depoimentos:', error);
      setError(error.message || 'Erro ao carregar depoimentos');
      
      // Fallback para depoimentos estáticos em caso de erro
      console.log('[Testimonials] Usando depoimentos estáticos devido a erro');
      setTestimonials(getStaticTestimonials().map(item => ({
        id: item.id,
        name: item.name,
        role: item.role,
        quote: item.quote,
        image_url: item.imageUrl
      })));
      
      toast.error('Erro ao carregar depoimentos', {
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
    
    // Set up realtime subscription
    const channel = supabase
      .channel('public:testimonials')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'testimonials' 
        },
        () => {
          fetchTestimonials();
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Subscribed to testimonials changes');
        }
        if (status === 'CHANNEL_ERROR') {
          console.error('Failed to subscribe to testimonials changes');
          toast.error('Falha ao monitorar alterações em depoimentos.');
        }
      });
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    testimonials,
    isLoading,
    error,
    fetchTestimonials
  };
};

export default useTestimonialsData;
