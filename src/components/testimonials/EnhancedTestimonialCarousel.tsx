
import { FC, useState, useEffect, useCallback } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { TestimonialItemProps } from './TestimonialItem';
import EnhancedTestimonialCard from './EnhancedTestimonialCard';
import { cn } from '@/lib/utils';
import { Slider } from "@/components/ui/slider";
import useEmblaCarousel from 'embla-carousel-react';

interface EnhancedTestimonialCarouselProps {
  testimonials: TestimonialItemProps[];
}

const EnhancedTestimonialCarousel: FC<EnhancedTestimonialCarouselProps> = ({ testimonials }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [activeIndex, setActiveIndex] = useState(0);

  const handleSliderChange = (value: number[]) => {
    if (emblaApi) {
      emblaApi.scrollTo(value[0]);
    }
  };

  const handleScroll = useCallback(() => {
    if (!emblaApi) return;
    const currentIndex = emblaApi.selectedScrollSnap();
    setActiveIndex(currentIndex);
  }, [emblaApi]);

  // Set up scroll event listener when emblaApi is available
  useEffect(() => {
    if (!emblaApi) return;
    
    emblaApi.on('select', handleScroll);
    handleScroll(); // Initial call to set the active index
    
    return () => {
      emblaApi.off('select', handleScroll);
    };
  }, [emblaApi, handleScroll]);

  return (
    <div className="mt-10 px-4 animate-on-scroll" aria-label="Carrossel de depoimentos">
      <div className="max-w-4xl mx-auto">
        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {testimonials.map((testimonial, index) => (
                <div 
                  key={testimonial.id} 
                  className={cn(
                    "relative flex-shrink-0 flex-grow-0 w-full transition-all duration-500",
                    activeIndex === index ? "opacity-100" : "opacity-30"
                  )}
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
          
          <div className="absolute -left-4 top-1/2 -translate-y-1/2 z-10">
            <button 
              onClick={() => emblaApi?.scrollPrev()} 
              className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
              aria-label="Depoimento anterior"
            >
              ←
            </button>
          </div>
          
          <div className="absolute -right-4 top-1/2 -translate-y-1/2 z-10">
            <button 
              onClick={() => emblaApi?.scrollNext()} 
              className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
              aria-label="Próximo depoimento"
            >
              →
            </button>
          </div>
        </div>
        
        {/* Progress dots */}
        <div className="flex justify-center mt-6 gap-2">
          {testimonials.map((_, index) => (
            <button
              key={`dot-${index}`}
              onClick={() => emblaApi?.scrollTo(index)}
              className={cn(
                "w-3 h-3 rounded-full transition-all",
                activeIndex === index ? "bg-gold scale-125" : "bg-gray-300"
              )}
              aria-label={`Ir para depoimento ${index + 1}`}
            />
          ))}
        </div>
        
        {/* Slider navigation for larger screens */}
        <div className="hidden md:block mt-8 px-10">
          <Slider
            value={[activeIndex]}
            max={testimonials.length - 1}
            step={1}
            onValueChange={handleSliderChange}
            className="z-0"
          />
        </div>
      </div>
    </div>
  );
};

export default EnhancedTestimonialCarousel;
