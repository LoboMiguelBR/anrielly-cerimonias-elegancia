
import { useRef, useState } from 'react';
import useTestimonialsData from './testimonials/useTestimonialsData';
import { Button } from "@/components/ui/button";
import { TestimonialSubmissionModal } from './testimonials';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";

const TestimonialSkeleton = () => (
  <div className="flex flex-col items-center py-8 px-4 animate-pulse">
    <Skeleton className="w-16 h-16 rounded-full mb-3" />
    <Skeleton className="w-32 h-4 mb-2" />
    <Skeleton className="w-20 h-4 mb-2" />
    <Skeleton className="w-60 h-4" />
  </div>
);

const Testimonials = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { testimonials, isLoading, error, fetchTestimonials } = useTestimonialsData();
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);

  // Responsividade: controle de quantos slides por tela
  const getSlidesToShow = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1024) return 3;
      if (window.innerWidth >= 640) return 2;
    }
    return 1;
  };

  const slidesToShow = getSlidesToShow();

  return (
    <section id="depoimentos" className="bg-white py-16" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <h2 className="section-title animate-on-scroll text-3xl font-semibold text-center mb-8">
          Depoimentos
        </h2>
        
        {isLoading ? (
          <div className="py-10" aria-busy="true">
            <Carousel className="max-w-2xl mx-auto">
              <CarouselContent>
                {[...Array(slidesToShow)].map((_, idx) => (
                  <CarouselItem key={idx}>
                    <TestimonialSkeleton />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
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
        ) : testimonials.length > 0 ? (
          <>
            <Carousel className="max-w-2xl mx-auto">
              <CarouselContent>
                {testimonials.map((testimonial, index) => (
                  <CarouselItem key={testimonial.id} className="py-6">
                    <div className="flex flex-col items-center text-center space-y-2 px-2">
                      <img
                        src={testimonial.image_url ?? "/placeholder.svg"}
                        alt={testimonial.name}
                        loading="lazy"
                        className="w-16 h-16 rounded-full object-cover border-2 border-gold mb-2"
                        width={64}
                        height={64}
                      />
                      <span className="font-bold text-gold mb-1">{testimonial.name}</span>
                      <span className="text-sm text-gray-500 mb-2">{testimonial.role}</span>
                      <p className="italic text-gray-700 max-w-xs">{testimonial.quote}</p>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
            <div className="text-center mt-10">
              <p className="text-gray-500 italic mb-4">
                Conheça a experiência de nossos clientes
              </p>
              <Button 
                onClick={() => setShowSubmissionModal(true)}
                className="bg-gold hover:bg-gold/80 text-white transition-colors"
              >
                Envie seu Depoimento
              </Button>
            </div>
          </>
        ) : (
          <div className="py-10 text-center text-gray-500">
            <p className="mb-4">Nenhum depoimento encontrado.</p>
            <Button 
              onClick={() => setShowSubmissionModal(true)}
              className="bg-gold hover:bg-gold/80 text-white transition-colors"
            >
              Seja o primeiro a enviar um depoimento
            </Button>
          </div>
        )}
        
        <TestimonialSubmissionModal 
          isOpen={showSubmissionModal}
          onClose={() => setShowSubmissionModal(false)}
        />
      </div>
    </section>
  );
};

export default Testimonials;
