
import { useState, useEffect, useRef } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { normalizeImageUrl } from '@/utils/imageUtils';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  image_url: string | null;
}

const Testimonials = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
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
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
      supabase.removeChannel(channel);
    };
  }, []);

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
      
      // Process and normalize image URLs
      const processedTestimonials = (data || []).map(testimonial => {
        if (testimonial.image_url) {
          const normalizedUrl = normalizeImageUrl(testimonial.image_url);
          console.log(`Testimonial ${testimonial.id}: Original URL: ${testimonial.image_url} -> Normalized: ${normalizedUrl}`);
          return { ...testimonial, image_url: normalizedUrl };
        }
        return testimonial;
      });
      
      setTestimonials(processedTestimonials);
      console.log('Fetched testimonials:', processedTestimonials);
    } catch (error: any) {
      console.error('Error fetching testimonials:', error);
      setError(error.message || 'Erro ao carregar depoimentos');
      toast.error('Erro ao carregar depoimentos', {
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fallback to static testimonials if none in the database or if there's an error
  const staticTestimonials = [
    {
      id: '1',
      name: "Mariana e Pedro",
      role: "Casamento em Volta Redonda",
      image_url: "/lovable-uploads/322b9c8a-c27a-42c2-bbfd-b8fbcfd2c449.png",
      quote: "A Anrielly trouxe magia para nossa cerimônia. Cada palavra foi escolhida com carinho e emocionou a todos os presentes."
    },
    {
      id: '2',
      name: "Família Silva",
      role: "Bodas de Prata",
      image_url: "/lovable-uploads/99442f1a-9c10-4e95-a063-bd0bda0a998c.png",
      quote: "Profissionalismo impecável. A Anrielly conseguiu captar nossa história e transformá-la em uma narrativa emocionante."
    },
    {
      id: '3',
      name: "Juliana",
      role: "Festa de 15 anos",
      image_url: "/lovable-uploads/d856da09-1255-4e7d-a9d6-0a2a04edac9d.png",
      quote: "Minha festa foi perfeita! A condução da cerimônia foi elegante e cheia de significado, exatamente como eu sonhava."
    }
  ];

  const displayTestimonials = testimonials.length > 0 ? testimonials : staticTestimonials;

  return (
    <section id="depoimentos" className="bg-white py-16" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <h2 className="section-title animate-on-scroll">Depoimentos</h2>
        
        {isLoading ? (
          <div className="py-10 text-center">Carregando depoimentos...</div>
        ) : error ? (
          <div className="py-10 text-center text-red-500">
            {error}
            <div className="mt-4">
              <button 
                onClick={() => fetchTestimonials()}
                className="px-4 py-2 bg-gold/80 text-white rounded-md hover:bg-gold transition-colors"
              >
                Tentar novamente
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-10 px-4 animate-on-scroll">
            <Carousel className="w-full max-w-4xl mx-auto">
              <CarouselContent>
                {displayTestimonials.map((testimonial, index) => (
                  <CarouselItem key={testimonial.id} className="md:basis-1/1">
                    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
                      <div className="mb-6">
                        <img 
                          src={normalizeImageUrl(testimonial.image_url)} 
                          alt={testimonial.name} 
                          className="w-20 h-20 rounded-full object-cover border-2 border-gold/30"
                          onError={(e) => {
                            // Fallback to placeholder if image fails to load
                            (e.target as HTMLImageElement).src = '/placeholder.svg';
                          }}
                        />
                      </div>
                      <blockquote className="text-center mb-4 font-playfair italic text-gray-700">
                        "{testimonial.quote}"
                      </blockquote>
                      <div className="text-center">
                        <p className="font-semibold">{testimonial.name}</p>
                        <p className="text-sm text-gray-500">{testimonial.role}</p>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-center gap-2 mt-4">
                <CarouselPrevious className="relative static transform-none translate-y-0 mx-4" />
                <CarouselNext className="relative static transform-none translate-y-0 mx-4" />
              </div>
            </Carousel>
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;
