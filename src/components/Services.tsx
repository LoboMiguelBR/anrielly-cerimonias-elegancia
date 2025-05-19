
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
      icon: <Heart className="w-10 h-10 text-gold" />,
      title: "Casamentos personalizados",
      description: "Cerimônias únicas que refletem a história e personalidade do casal."
    },
    {
      icon: <Calendar className="w-10 h-10 text-gold" />,
      title: "Festas de 15 anos",
      description: "Momentos especiais conduzidos com elegância e emoção para debutantes."
    },
    {
      icon: <Award className="w-10 h-10 text-gold" />,
      title: "Eventos sociais e corporativos",
      description: "Condução profissional para eventos empresariais e comemorações."
    },
    {
      icon: <Image className="w-10 h-10 text-gold" />,
      title: "Formaturas e apresentações",
      description: "Cerimônias acadêmicas conduzidas com formalidade e brilhantismo."
    }
  ];

  return (
    <section id="servicos" className="bg-white" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <h2 className="section-title animate-on-scroll">Serviços</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow animate-on-scroll border border-gold/10 hover:border-gold/30"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="mb-4 flex justify-center">
                {service.icon}
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
