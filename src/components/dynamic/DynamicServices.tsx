
import { useEffect, useRef } from 'react';
import { useServices } from '@/hooks/useServices';
import { Calendar, Heart, Award, Image } from 'lucide-react';

interface DynamicServicesProps {
  title?: string;
  items?: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
}

const DynamicServices = ({
  title = "Serviços",
  items
}: DynamicServicesProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const { services: dbServices, isLoading } = useServices();
  
  // Use os serviços do banco de dados por padrão, ou os items passados como props (para landing pages customizadas)
  const servicesToShow = items || dbServices;
  
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

  if (isLoading && !items) {
    return (
      <section id="servicos" className="bg-white" ref={sectionRef}>
        <div className="container mx-auto px-4">
          <h2 className="section-title animate-on-scroll">{title}</h2>
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="servicos" className="bg-white" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <h2 className="section-title animate-on-scroll">{title}</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {servicesToShow.map((service, index) => (
            <div 
              key={'id' in service ? service.id : `service-${index}`} 
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

        {servicesToShow.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>Nenhum serviço disponível no momento.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default DynamicServices;
