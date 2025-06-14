
import { useEffect, useRef } from 'react';
import { Calendar, Heart, Award, Image } from 'lucide-react';

const Services = () => {
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

  const services = [
    {
      id: "1",
      title: "Casamentos",
      description: "Celebrações matrimoniais únicas e emocionantes, conduzidas com carinho e profissionalismo.",
      icon: "Heart"
    },
    {
      id: "2", 
      title: "Formaturas",
      description: "Cerimônias de formatura solenes e marcantes para celebrar conquistas acadêmicas.",
      icon: "Award"
    },
    {
      id: "3",
      title: "Aniversários",
      description: "Comemorações especiais de aniversário com roteiro personalizado e momentos únicos.",
      icon: "Calendar"
    },
    {
      id: "4",
      title: "Eventos Corporativos",
      description: "Conduções profissionais para eventos empresariais, lançamentos e premiações.",
      icon: "Image"
    }
  ];

  const getIcon = (iconName: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      Heart: <Heart className="w-10 h-10 text-gold" />,
      Calendar: <Calendar className="w-10 h-10 text-gold" />,
      Award: <Award className="w-10 h-10 text-gold" />,
      Image: <Image className="w-10 h-10 text-gold" />
    };
    return iconMap[iconName] || <Heart className="w-10 h-10 text-gold" />;
  };

  return (
    <section id="servicos" className="bg-white" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <h2 className="section-title animate-on-scroll">Serviços</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div 
              key={service.id} 
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow animate-on-scroll border border-gold/10 hover:border-gold/30"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="mb-4 flex justify-center">
                {getIcon(service.icon)}
              </div>
              <h3 className="text-xl font-playfair font-semibold text-center mb-3">
                {service.title}
              </h3>
              <p className="text-center text-gray-600">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
