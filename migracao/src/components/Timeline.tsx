
import { useEffect, useRef } from 'react';
import { ArrowRight, Calendar } from 'lucide-react';

const Timeline = () => {
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

  const timelineSteps = [
    {
      title: "Antes do Evento",
      description: "Reunião, alinhamento de expectativas e criação de roteiro personalizado.",
      icon: <Calendar className="w-6 h-6" />
    },
    {
      title: "Durante o Evento",
      description: "Condução com carisma, gestão de tempo e resolução de imprevistos.",
      icon: <Calendar className="w-6 h-6" />
    },
    {
      title: "Depois do Evento",
      description: "Feedback e registros afetivos para eternizar o momento especial.",
      icon: <Calendar className="w-6 h-6" />
    }
  ];

  return (
    <section id="como-funciona" className="bg-white py-16" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <h2 className="section-title animate-on-scroll">Como Funciona o Atendimento</h2>
        
        <div className="mt-12 relative">
          {/* Line connecting the timeline */}
          <div className="absolute top-6 left-8 md:left-1/2 w-1 md:w-[80%] md:h-1 bg-gold/30 h-[80%] md:transform md:-translate-x-1/2"></div>
          
          <div className="flex flex-col md:flex-row gap-8 md:gap-0 md:justify-between">
            {timelineSteps.map((step, index) => (
              <div 
                key={index} 
                className="relative flex flex-row md:flex-col items-start md:items-center text-left md:text-center animate-on-scroll w-full md:w-1/3 px-4"
                style={{ animationDelay: `${index * 300}ms` }}
              >
                <div className="mr-4 md:mr-0 md:mb-4 z-10 bg-white rounded-full p-3 border-2 border-gold/40 text-gold">
                  {step.icon}
                </div>
                <div>
                  <h3 className="text-xl font-playfair font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                {index < timelineSteps.length - 1 && (
                  <ArrowRight className="hidden md:block absolute top-6 right-0 md:-right-4 w-8 h-8 text-gold/50" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Timeline;
