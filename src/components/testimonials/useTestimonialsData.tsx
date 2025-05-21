
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
  status: 'pending' | 'approved' | 'rejected';
}

export const useTestimonialsData = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchTestimonials = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('[useTestimonialsData] Buscando depoimentos aprovados do banco...');
      
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('status', 'approved')
        .order('order_index');

      if (error) {
        throw error;
      }
      
      console.log('[useTestimonialsData] Depoimentos aprovados carregados:', data?.length);
      
      if (data && data.length > 0) {
        // Cast the status field to the correct type
        const typedData = data.map(item => ({
          ...item,
          status: item.status as 'pending' | 'approved' | 'rejected'
        })) as Testimonial[];
        
        setTestimonials(typedData);
        console.log('[useTestimonialsData] Usando depoimentos aprovados do banco:', data);
      } else {
        // Fallback para depoimentos estáticos quando não há dados aprovados no banco
        console.log('[useTestimonialsData] Usando depoimentos estáticos de fallback');
        const staticData = getStaticTestimonials().map(item => ({
          id: item.id,
          name: item.name,
          role: item.role,
          quote: item.quote,
          image_url: item.imageUrl,
          status: 'approved' as const
        }));
        console.log('[useTestimonialsData] Dados estáticos:', staticData);
        setTestimonials(staticData);
      }
    } catch (error: any) {
      console.error('[useTestimonialsData] Erro ao carregar depoimentos:', error);
      setError(error.message || 'Erro ao carregar depoimentos');
      
      // Fallback para depoimentos estáticos em caso de erro
      console.log('[useTestimonialsData] Usando depoimentos estáticos devido a erro');
      const staticData = getStaticTestimonials().map(item => ({
        id: item.id,
        name: item.name,
        role: item.role,
        quote: item.quote,
        image_url: item.imageUrl,
        status: 'approved' as const
      }));
      console.log('[useTestimonialsData] Dados estáticos de fallback:', staticData);
      setTestimonials(staticData);
      
      toast.error('Erro ao carregar depoimentos', {
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('[useTestimonialsData] Inicializando hook');
    fetchTestimonials();
    
    // Set up realtime subscription with better error handling
    const channel = supabase
      .channel('public:testimonials')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'testimonials' 
        },
        (payload) => {
          console.log('[useTestimonialsData] Recebeu alteração em tempo real:', payload);
          fetchTestimonials();
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('[useTestimonialsData] Inscrito com sucesso para alterações em tempo real');
        }
        if (status === 'CHANNEL_ERROR') {
          console.error('[useTestimonialsData] Falha ao monitorar alterações em tempo real');
          toast.error('Falha ao monitorar alterações em depoimentos.');
        }
      });
    
    return () => {
      console.log('[useTestimonialsData] Limpando inscrição em tempo real');
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
