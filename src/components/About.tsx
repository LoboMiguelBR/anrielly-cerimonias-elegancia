
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
          
          <div className="animate-on-scroll">
            <p className="text-lg mb-6 leading-relaxed">
              Sou Anrielly Gomes, apaixonada por transformar cerimônias em momentos únicos. Com mais de 20 anos de experiência e uma trajetória em oratória e eventos, levo emoção e leveza a cada celebração.
            </p>
            <p className="text-lg mb-6 leading-relaxed">
              Minha missão é conduzir seu momento especial com profissionalismo e sensibilidade, criando memórias inesquecíveis para você e seus convidados.
            </p>
            <p className="text-lg font-medium italic text-gray-700">
              "Cada cerimônia é única como a história de cada casal."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
