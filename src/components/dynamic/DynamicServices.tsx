
import { useEffect, useRef } from 'react';
import { Calendar, Heart, Award, Image } from 'lucide-react';

interface ServiceItem {
  title: string;
  description: string;
  icon: string;
}

interface DynamicServicesProps {
  title?: string;
  items?: ServiceItem[];
}

const DynamicServices = ({
  title = "Serviços",
  items = [
    {
      title: "Casamentos personalizados",
      description: "Cerimônias únicas que refletem a história e personalidade do casal.",
      icon: "Heart"
    },
    {
      title: "Festas de 15 anos",
      description: "Momentos especiais conduzidos com elegância e emoção para debutantes.",
      icon: "Calendar"
    },
    {
      title: "Eventos sociais e corporativos",
      description: "Condução profissional para eventos empresariais e comemorações.",
      icon: "Award"
    },
    {
      title: "Formaturas e apresentações",
      description: "Cerimônias acadêmicas conduzidas com formalidade e brilhantismo.",
      icon: "Image"
    }
  ]
}: DynamicServicesProps) => {
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
        <h2 className="section-title animate-on-scroll">{title}</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((service, index) => (
            <div 
              key={index} 
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

export default DynamicServices;
