
import { useRef } from 'react';
import useTestimonialsData from './testimonials/useTestimonialsData';
import EnhancedTestimonialCarousel from './testimonials/EnhancedTestimonialCarousel';
import { Button } from "@/components/ui/button";

const Testimonials = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { testimonials, isLoading, error, fetchTestimonials } = useTestimonialsData();
  
  const mappedTestimonials = testimonials.map(testimonial => ({
    id: testimonial.id,
    name: testimonial.name,
    role: testimonial.role,
    quote: testimonial.quote,
    imageUrl: testimonial.image_url
  }));

  console.log('[Testimonials] Renderizando componente com', mappedTestimonials.length, 'depoimentos');

  return (
    <section id="depoimentos" className="bg-white py-16" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <h2 className="section-title animate-on-scroll text-3xl font-semibold text-center mb-8">
          Depoimentos
        </h2>
        
        {isLoading ? (
          <div className="py-10 text-center" aria-busy="true">
            <div className="animate-pulse">
              <div className="h-32 bg-gray-200 rounded-lg max-w-md mx-auto"></div>
            </div>
          </div>
        ) : error ? (
          <div className="py-10 text-center text-red-500" role="alert">
            <p>{error}</p>
            <div className="mt-4">
              <Button 
                onClick={fetchTestimonials}
                className="px-4 py-2 bg-gold/80 text-white rounded-md hover:bg-gold transition-colors"
                aria-label="Tentar recarregar depoimentos"
              >
                Tentar novamente
              </Button>
            </div>
          </div>
        ) : mappedTestimonials.length > 0 ? (
          <>
            <EnhancedTestimonialCarousel testimonials={mappedTestimonials} />
            <div className="text-center mt-10">
              <p className="text-gray-500 italic">
                Conheça a experiência de nossos clientes
              </p>
            </div>
          </>
        ) : (
          <div className="py-10 text-center text-gray-500">
            Nenhum depoimento encontrado.
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;
