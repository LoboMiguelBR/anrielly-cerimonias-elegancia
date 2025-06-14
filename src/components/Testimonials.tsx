
import { useRef } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useTestimonialsData } from '@/components/testimonials/useTestimonialsData';

const Testimonials = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { testimonials, isLoading } = useTestimonialsData();

  // Fallback para depoimentos estáticos se não houver depoimentos aprovados
  const staticTestimonials = [
    {
      id: "1",
      name: "Maria Silva",
      role: "Noiva",
      quote: "Anrielly tornou nosso casamento ainda mais especial. Sua condução foi perfeita e emocionante.",
      image_url: "/placeholder.svg"
    },
    {
      id: "2",
      name: "João Santos",
      role: "Formando",
      quote: "A cerimônia de formatura foi conduzida com muita elegância e profissionalismo. Recomendo!",
      image_url: "/placeholder.svg"
    },
    {
      id: "3",
      name: "Ana Costa",
      role: "Aniversariante",
      quote: "Minha festa de 50 anos ficou inesquecível com a condução da Anrielly. Simplesmente maravilhosa!",
      image_url: "/placeholder.svg"
    }
  ];

  // Usar depoimentos do banco ou fallback para estáticos
  const displayTestimonials = testimonials.length > 0 ? testimonials : staticTestimonials;

  if (isLoading) {
    return (
      <section id="depoimentos" className="bg-white py-16" ref={sectionRef}>
        <div className="container mx-auto px-4">
          <h2 className="section-title animate-on-scroll text-3xl font-semibold text-center mb-8">
            Depoimentos
          </h2>
          <div className="max-w-2xl mx-auto">
            <div className="animate-pulse flex flex-col items-center text-center space-y-2 px-2">
              <div className="w-16 h-16 bg-gray-300 rounded-full mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-24 mb-1"></div>
              <div className="h-3 bg-gray-300 rounded w-16 mb-2"></div>
              <div className="h-20 bg-gray-300 rounded w-64"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="depoimentos" className="bg-white py-16" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <h2 className="section-title animate-on-scroll text-3xl font-semibold text-center mb-8">
          Depoimentos
        </h2>
        
        {displayTestimonials.length > 0 ? (
          <Carousel className="max-w-2xl mx-auto">
            <CarouselContent>
              {displayTestimonials.map((testimonial) => (
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
        ) : (
          <div className="py-10 text-center text-gray-500">
            <p className="mb-4">Em breve, depoimentos dos nossos clientes.</p>
          </div>
        )}
        
        <div className="text-center mt-10">
          <p className="text-gray-500 italic">
            Conheça a experiência de nossos clientes
          </p>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
