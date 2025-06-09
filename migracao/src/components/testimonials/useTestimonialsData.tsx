
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { getStaticTestimonials } from './StaticTestimonials';
import { fetchApprovedTestimonials } from '@/components/admin/hooks/testimonials/api';
import { shuffleArray } from '@/utils/arrayUtils';

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
  const [realtimeConnected, setRealtimeConnected] = useState(false);
  
  const fetchTestimonials = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('[useTestimonialsData] Buscando depoimentos aprovados do banco...');
      
      const data = await fetchApprovedTestimonials();
      
      console.log('[useTestimonialsData] Depoimentos aprovados carregados:', data?.length);
      
      let finalTestimonials: Testimonial[] = [];
      
      if (data && data.length > 0) {
        finalTestimonials = data;
        console.log('[useTestimonialsData] Usando depoimentos aprovados do banco:', data);
      } else {
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
        finalTestimonials = staticData;
      }
      
      // Aplicar randomização apenas uma vez no carregamento inicial
      const randomizedTestimonials = shuffleArray(finalTestimonials);
      setTestimonials(randomizedTestimonials);
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
      
      const randomizedStaticData = shuffleArray(staticData);
      console.log('[useTestimonialsData] Dados estáticos de fallback:', randomizedStaticData);
      setTestimonials(randomizedStaticData);
      
      // Apenas mostrar toast de erro para erros críticos
      if (!error.message?.includes('realtime') && !error.message?.includes('websocket')) {
        toast.error('Erro ao carregar depoimentos', {
          description: error.message
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, []); // Remover todas as dependências para evitar re-renders

  useEffect(() => {
    console.log('[useTestimonialsData] Inicializando hook');
    fetchTestimonials();
    
    // Set up realtime subscription com tratamento de erro melhorado
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
          // Não randomizar novamente em atualizações realtime
          fetchTestimonials();
        }
      )
      .subscribe((status) => {
        console.log('[useTestimonialsData] Status da conexão realtime:', status);
        
        if (status === 'SUBSCRIBED') {
          console.log('[useTestimonialsData] Realtime conectado com sucesso');
          setRealtimeConnected(true);
        } else if (status === 'CHANNEL_ERROR') {
          console.warn('[useTestimonialsData] Erro na conexão realtime - funcionando sem atualizações automáticas');
          setRealtimeConnected(false);
        } else if (status === 'CLOSED') {
          console.log('[useTestimonialsData] Conexão realtime fechada');
          setRealtimeConnected(false);
        }
      });
    
    return () => {
      console.log('[useTestimonialsData] Limpando inscrição em tempo real');
      supabase.removeChannel(channel);
    };
  }, [fetchTestimonials]);

  // Função para forçar uma nova randomização (removida a dependência problemática)
  const randomizeTestimonials = useCallback(() => {
    setTestimonials(current => shuffleArray([...current]));
  }, []);

  return {
    testimonials,
    isLoading,
    error,
    fetchTestimonials,
    randomizeTestimonials,
    realtimeConnected
  };
};

export default useTestimonialsData;
