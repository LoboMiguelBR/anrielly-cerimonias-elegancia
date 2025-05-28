
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
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [realtimeConnected, setRealtimeConnected] = useState(false);
  
  const fetchTestimonials = useCallback(async (shouldRandomize: boolean = false) => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('[useTestimonialsData] Buscando depoimentos aprovados do banco...');
      
      // Use the shared API function to fetch approved testimonials
      const data = await fetchApprovedTestimonials();
      
      console.log('[useTestimonialsData] Depoimentos aprovados carregados:', data?.length);
      
      let finalTestimonials: Testimonial[] = [];
      
      if (data && data.length > 0) {
        finalTestimonials = data;
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
        finalTestimonials = staticData;
      }
      
      // Aplicar randomização apenas no carregamento inicial
      if (shouldRandomize && isInitialLoad) {
        console.log('[useTestimonialsData] Aplicando randomização nos depoimentos');
        finalTestimonials = shuffleArray(finalTestimonials);
        setIsInitialLoad(false);
      }
      
      setTestimonials(finalTestimonials);
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
      
      let finalTestimonials = staticData;
      
      // Aplicar randomização apenas no carregamento inicial, mesmo em caso de erro
      if (shouldRandomize && isInitialLoad) {
        console.log('[useTestimonialsData] Aplicando randomização nos depoimentos estáticos de fallback');
        finalTestimonials = shuffleArray(staticData);
        setIsInitialLoad(false);
      }
      
      console.log('[useTestimonialsData] Dados estáticos de fallback:', finalTestimonials);
      setTestimonials(finalTestimonials);
      
      // Apenas mostrar toast de erro para erros críticos, não para problemas de realtime
      if (!error.message?.includes('realtime') && !error.message?.includes('websocket')) {
        toast.error('Erro ao carregar depoimentos', {
          description: error.message
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [isInitialLoad]);

  useEffect(() => {
    console.log('[useTestimonialsData] Inicializando hook');
    fetchTestimonials(true); // Randomizar no carregamento inicial
    
    // Set up realtime subscription with enhanced error handling
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
          fetchTestimonials(false); // Não randomizar em atualizações em tempo real
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
          // Não mostrar toast de erro para problemas de realtime
          // A aplicação continua funcionando normalmente
        } else if (status === 'CLOSED') {
          console.log('[useTestimonialsData] Conexão realtime fechada');
          setRealtimeConnected(false);
        }
      });
    
    // Implementar polling de fallback caso o realtime falhe
    let fallbackInterval: NodeJS.Timeout;
    
    // Aguardar 5 segundos para verificar se o realtime conectou
    const realtimeTimeout = setTimeout(() => {
      if (!realtimeConnected) {
        console.log('[useTestimonialsData] Realtime não conectou, iniciando polling de fallback');
        // Polling a cada 30 segundos se realtime não funcionar
        fallbackInterval = setInterval(() => {
          fetchTestimonials(false);
        }, 30000);
      }
    }, 5000);
    
    return () => {
      console.log('[useTestimonialsData] Limpando inscrição em tempo real');
      supabase.removeChannel(channel);
      clearTimeout(realtimeTimeout);
      if (fallbackInterval) {
        clearInterval(fallbackInterval);
      }
    };
  }, [fetchTestimonials, realtimeConnected]);

  // Função para forçar uma nova randomização (caso necessário)
  const randomizeTestimonials = useCallback(() => {
    if (testimonials.length > 0) {
      console.log('[useTestimonialsData] Forçando nova randomização');
      setTestimonials(shuffleArray(testimonials));
    }
  }, [testimonials]);

  return {
    testimonials,
    isLoading,
    error,
    fetchTestimonials: () => fetchTestimonials(false),
    randomizeTestimonials,
    realtimeConnected
  };
};

export default useTestimonialsData;
