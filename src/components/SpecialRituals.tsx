
import { useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';

const SpecialRituals = () => {
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

  const rituals = [
    {
      title: "Cerimônia da Vela",
      description: "Um momento especial onde a luz simboliza a união e a presença de entes queridos."
    },
    {
      title: "Bênçãos Personalizadas",
      description: "Palavras especialmente escritas para honrar o momento e as pessoas envolvidas."
    },
    {
      title: "Rituais Simbólicos",
      description: "Diferentes elementos podem ser incorporados para tornar a cerimônia única e memorável."
    }
  ];

  return (
    <section id="rituais" className="bg-pink-light/20 py-16" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <h2 className="section-title animate-on-scroll">Rituais Especiais</h2>
        
        <div className="grid md:grid-cols-3 gap-8 mt-10">
          {rituals.map((ritual, index) => (
            <div 
              key={index}
              className="bg-white p-6 rounded-lg shadow-md border border-gold/10 hover:border-gold/30 hover:shadow-lg transition-all animate-on-scroll flex flex-col items-center text-center"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="mb-4 p-3 bg-lavender rounded-full">
                <Bell className="w-8 h-8 text-gold" />
              </div>
              <h3 className="text-xl font-playfair font-semibold mb-2">{ritual.title}</h3>
              <p className="text-gray-600">{ritual.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SpecialRituals;
