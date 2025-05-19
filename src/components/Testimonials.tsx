
import { useState, useEffect, useRef } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const Testimonials = () => {
  const sectionRef = useRef<HTMLElement>(null);
  
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
    
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const testimonials = [
    {
      name: "Mariana e Pedro",
      role: "Casamento em Volta Redonda",
      image: "/lovable-uploads/322b9c8a-c27a-42c2-bbfd-b8fbcfd2c449.png",
      quote: "A Anrielly trouxe magia para nossa cerimônia. Cada palavra foi escolhida com carinho e emocionou a todos os presentes."
    },
    {
      name: "Família Silva",
      role: "Bodas de Prata",
      image: "/lovable-uploads/99442f1a-9c10-4e95-a063-bd0bda0a998c.png",
      quote: "Profissionalismo impecável. A Anrielly conseguiu captar nossa história e transformá-la em uma narrativa emocionante."
    },
    {
      name: "Juliana",
      role: "Festa de 15 anos",
      image: "/lovable-uploads/d856da09-1255-4e7d-a9d6-0a2a04edac9d.png",
      quote: "Minha festa foi perfeita! A condução da cerimônia foi elegante e cheia de significado, exatamente como eu sonhava."
    }
  ];

  return (
    <section id="depoimentos" className="bg-white py-16" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <h2 className="section-title animate-on-scroll">Depoimentos</h2>
        
        <div className="mt-10 px-4 animate-on-scroll">
          <Carousel className="w-full max-w-4xl mx-auto">
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="md:basis-1/1">
                  <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
                    <div className="mb-6">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name} 
                        className="w-20 h-20 rounded-full object-cover border-2 border-gold/30"
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
      </div>
    </section>
  );
};

export default Testimonials;
