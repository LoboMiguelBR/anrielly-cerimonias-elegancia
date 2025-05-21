
import { useEffect, useRef } from 'react';

const About = () => {
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
        <h2 className="section-title animate-on-scroll">Sobre a Anrielly</h2>
        
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="animate-on-scroll">
            <div className="relative overflow-hidden rounded-lg shadow-lg">
              <img 
                src="/lovable-uploads/99442f1a-9c10-4e95-a063-bd0bda0a998c.png" 
                alt="Anrielly Gomes" 
                className="w-full h-auto hover-zoom"
              />
              <div className="absolute inset-0 bg-gold/10 hover:bg-transparent transition-all duration-300"></div>
            </div>
          </div>
          
          <div className="animate-on-scroll space-y-4">
            <p className="text-lg leading-relaxed">
              <span className="font-semibold">Olá!</span> Sou Anrielly Gomes, uma apaixonada Mestre de Cerimônias com mais de 20 anos de trajetória profissional, marcada por sensibilidade, elegância e compromisso com momentos inesquecíveis.
            </p>
            
            <p className="text-lg leading-relaxed">
              Ao longo da minha jornada, atuei na advocacia e no empreendedorismo, mas foi no universo da comunicação e celebração que encontrei meu verdadeiro propósito: transformar eventos em experiências únicas, emocionantes e memoráveis.
            </p>
            
            <p className="text-lg leading-relaxed">
              Com formação em oratória, cerimonial e condução de eventos, atuo com empatia, carisma e atenção minuciosa aos detalhes. Cada cerimônia que conduzo é planejada com amor, escuta ativa e um roteiro personalizado, sempre respeitando a essência de cada história.
            </p>
            
            <p className="text-lg leading-relaxed font-medium italic text-gray-700">
              "A minha missão é dar vida a momentos que tocam o coração — conduzindo cada etapa com segurança, leveza e profissionalismo, para que você possa apenas viver e sentir cada instante."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
