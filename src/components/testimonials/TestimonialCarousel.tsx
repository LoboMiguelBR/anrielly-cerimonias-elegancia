import { FC } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import TestimonialItem, { TestimonialItemProps } from './TestimonialItem';

interface TestimonialCarouselProps {
  testimonials: TestimonialItemProps[];
}

const TestimonialCarousel: FC<TestimonialCarouselProps> = ({ testimonials }) => {
  return (
    <div className="mt-10 px-4 animate-on-scroll" aria-label="Carrossel de depoimentos">
      <Carousel className="w-full max-w-4xl mx-auto">
        <CarouselContent>
          {testimonials.map((testimonial) => (
            <CarouselItem key={testimonial.id} className="md:basis-1/1">
              <TestimonialItem 
                id={testimonial.id}
                name={testimonial.name}
                role={testimonial.role}
                quote={testimonial.quote}
                imageUrl={testimonial.imageUrl}
              />
            </CarouselItem>
          ))}
        </CarouselContent>

        <div className="flex justify-center gap-2 mt-4">
          <CarouselPrevious 
            className="relative static transform-none translate-y-0 mx-4"
            aria-label="Depoimento anterior"
          />
          <CarouselNext 
            className="relative static transform-none translate-y-0 mx-4"
            aria-label="Próximo depoimento"
          />
        </div>
      </Carousel>
    </div>
  );
};

export default TestimonialCarousel;
