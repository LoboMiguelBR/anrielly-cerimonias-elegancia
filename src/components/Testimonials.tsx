
import { useRef } from 'react';
import TestimonialCarousel from './testimonials/TestimonialCarousel';
import useTestimonialsData from './testimonials/useTestimonialsData';
import getStaticTestimonials from './testimonials/StaticTestimonials';
import { Button } from "@/components/ui/button";

const Testimonials = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { testimonials, isLoading, error, fetchTestimonials } = useTestimonialsData();
  
  // Mapeia os testimonials do formato da API para o formato do componente
  const mappedTestimonials = testimonials.map(testimonial => ({
    id: testimonial.id,
    name: testimonial.name,
    role: testimonial.role,
    quote: testimonial.quote,
    imageUrl: testimonial.image_url
  }));

  // Fallback to static testimonials if none in the database or if there's an error
  const displayTestimonials = mappedTestimonials.length > 0 ? mappedTestimonials : getStaticTestimonials();

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
              <Button 
                onClick={() => fetchTestimonials()}
                className="px-4 py-2 bg-gold/80 text-white rounded-md hover:bg-gold transition-colors"
              >
                Tentar novamente
              </Button>
            </div>
          </div>
        ) : (
          <TestimonialCarousel testimonials={displayTestimonials} />
        )}
      </div>
    </section>
  );
};

export default Testimonials;
