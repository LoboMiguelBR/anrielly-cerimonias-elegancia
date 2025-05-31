
import { useEffect, useRef } from 'react';

interface DynamicAboutProps {
  title?: string;
  content?: string;
  image?: string;
}

const DynamicAbout = ({
  title = "Sobre a Anrielly",
  content = "Olá! Sou Anrielly Gomes, uma apaixonada Mestre de Cerimônias com mais de 20 anos de trajetória profissional, marcada por sensibilidade, elegância e compromisso com momentos inesquecíveis.",
  image = "/lovable-uploads/99442f1a-9c10-4e95-a063-bd0bda0a998c.png"
}: DynamicAboutProps) => {
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

  return (
    <section id="sobre" className="bg-lavender/20" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <h2 className="section-title animate-on-scroll">{title}</h2>
        
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="animate-on-scroll">
            <div className="relative overflow-hidden rounded-lg shadow-lg">
              <img 
                src={image} 
                alt={title}
                className="w-full h-auto hover-zoom"
              />
              <div className="absolute inset-0 bg-gold/10 hover:bg-transparent transition-all duration-300"></div>
            </div>
          </div>
          
          <div className="animate-on-scroll space-y-4">
            <div 
              className="text-lg leading-relaxed"
              dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br />') }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DynamicAbout;
