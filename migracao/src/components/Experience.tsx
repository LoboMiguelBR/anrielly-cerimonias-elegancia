
import { useEffect, useRef } from 'react';

const Experience = () => {
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

  const experiences = [
    {
      title: "+20 anos",
      description: "de experiência em eventos"
    },
    {
      title: "Formação",
      description: "em Direito e Comunicação"
    },
    {
      title: "Especialista",
      description: "em cerimônias afetivas"
    }
  ];

  return (
    <section id="experiencia" className="bg-lavender/30 py-10" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16">
          {experiences.map((item, index) => (
            <div 
              key={index} 
              className="text-center animate-on-scroll"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="mb-2">
                <span className="inline-block bg-white text-gold font-bold text-xl md:text-2xl px-4 py-2 rounded-full border border-gold/30">
                  {item.title}
                </span>
              </div>
              <p className="text-gray-700">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
