
import { useEffect, useRef } from 'react';
import { Check } from 'lucide-react';

const Differentials = () => {
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

  const differentials = [
    {
      title: "Roteiro personalizado",
      description: "Cada cerimônia é única e desenvolvida de acordo com sua história e desejos."
    },
    {
      title: "Oratória refinada",
      description: "Comunicação clara e elegante para conduzir seu evento com fluidez."
    },
    {
      title: "Postura elegante e carismática",
      description: "Presença marcante e acolhedora que encanta a todos os presentes."
    },
    {
      title: "Rituais simbólicos",
      description: "Opções de rituais como a Cerimônia da Vela, que tornam o momento ainda mais especial."
    }
  ];

  return (
    <section id="diferenciais" className="bg-pink-light/30" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <h2 className="section-title animate-on-scroll">Diferenciais</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="animate-on-scroll">
            <div className="relative rounded-lg overflow-hidden shadow-lg">
              <img 
                src="/lovable-uploads/5c2761cc-ac8b-403d-9dba-85a4f27b4b6e.png" 
                alt="Anrielly Gomes conduzindo cerimônia" 
                className="w-full h-auto hover-zoom"
              />
              <div className="absolute inset-0 bg-pink-pastel/10 hover:bg-transparent transition-all duration-300"></div>
            </div>
          </div>
          
          <div>
            <ul className="space-y-4">
              {differentials.map((item, index) => (
                <li 
                  key={index} 
                  className="flex items-start animate-on-scroll"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="mr-3 mt-1">
                    <Check className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-playfair text-lg font-semibold">{item.title}</h3>
                    <p className="text-gray-700">{item.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Differentials;
