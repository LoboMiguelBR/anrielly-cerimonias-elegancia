
import { FC, useState, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { TestimonialItemProps } from './TestimonialItem';
import EnhancedTestimonialCard from './EnhancedTestimonialCard';
import { cn } from '@/lib/utils';
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface EnhancedTestimonialCarouselProps {
  testimonials: TestimonialItemProps[];
}

const EnhancedTestimonialCarousel: FC<EnhancedTestimonialCarouselProps> = ({ testimonials }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [activeIndex, setActiveIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  
  // Track when component is mounted
  useEffect(() => {
    setMounted(true);
    console.log('[EnhancedTestimonialCarousel] Componente montado com', testimonials.length, 'depoimentos');
    return () => {
      console.log('[EnhancedTestimonialCarousel] Componente desmontado');
      setMounted(false);
    };
  }, []);

  // Update active index when slide changes
  useEffect(() => {
    if (!emblaApi) return;
    
    const handleSelect = () => {
      const currentIndex = emblaApi.selectedScrollSnap();
      console.log('[EnhancedTestimonialCarousel] Slide alterou para', currentIndex);
      setActiveIndex(currentIndex);
    };
    
    emblaApi.on('select', handleSelect);
    handleSelect(); // Set initial active index
    
    return () => {
      emblaApi.off('select', handleSelect);
    };
  }, [emblaApi]);

  // Log when testimonials data changes
  useEffect(() => {
    console.log('[EnhancedTestimonialCarousel] Dados atualizados:', testimonials.length, 'depoimentos');
  }, [testimonials]);

  const handleNextSlide = () => {
    if (emblaApi) emblaApi.scrollNext();
  };

  const handlePrevSlide = () => {
    if (emblaApi) emblaApi.scrollPrev();
  };

  const goToSlide = (index: number) => {
    if (emblaApi) emblaApi.scrollTo(index);
  };

  if (testimonials.length === 0) {
    console.log('[EnhancedTestimonialCarousel] Sem depoimentos para mostrar');
    return <div className="text-center py-8">Nenhum depoimento disponível.</div>;
  }

  return (
    <div className="relative max-w-4xl mx-auto px-4 md:px-8" aria-label="Carrossel de depoimentos">
      <div className="overflow-hidden rounded-lg" ref={emblaRef}>
        <div className="flex">
          {testimonials.map((testimonial, index) => (
            <div 
              key={testimonial.id} 
              className="flex-shrink-0 flex-grow-0 w-full px-2 md:px-4 py-6"
              style={{ minWidth: '100%' }}
            >
              <EnhancedTestimonialCard 
                id={testimonial.id}
                name={testimonial.name}
                role={testimonial.role}
                quote={testimonial.quote}
                imageUrl={testimonial.imageUrl}
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* Navigation buttons */}
      <Button 
        variant="outline" 
        size="icon"
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white shadow-md hover:bg-gray-50"
        onClick={handlePrevSlide}
        aria-label="Depoimento anterior"
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>
      
      <Button 
        variant="outline"
        size="icon" 
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white shadow-md hover:bg-gray-50"
        onClick={handleNextSlide}
        aria-label="Próximo depoimento"
      >
        <ArrowRight className="h-4 w-4" />
      </Button>
      
      {/* Indicator dots */}
      <div className="flex justify-center mt-6 gap-2">
        {testimonials.map((_, index) => (
          <button
            key={`dot-${index}`}
            onClick={() => goToSlide(index)}
            className={cn(
              "w-3 h-3 rounded-full transition-all",
              activeIndex === index ? "bg-gold scale-125" : "bg-gray-300"
            )}
            aria-label={`Ir para depoimento ${index + 1}`}
            aria-current={activeIndex === index}
          />
        ))}
      </div>
    </div>
  );
};

export default EnhancedTestimonialCarousel;
