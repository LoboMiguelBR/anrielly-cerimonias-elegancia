
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
  
  // Priorizar items do CMS, senão usar serviços do banco
  const servicesToShow = items && items.length > 0 ? items : dbServices;
  
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

  // Se estiver usando dados do banco e ainda carregando
  if (!items && isLoading) {
    return (
      <section id="servicos" className="bg-white py-20" ref={sectionRef}>
        <div className="container mx-auto px-4">
          <h2 className="section-title animate-on-scroll">{title}</h2>
          <div className="flex justify-center items-center h-32">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold mx-auto mb-2"></div>
              <p className="text-gray-500 text-sm">Carregando serviços...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  console.log('DynamicServices:', {
    title,
    itemsFromCMS: items?.length || 0,
    itemsFromDB: dbServices?.length || 0,
    servicesToShow: servicesToShow?.length || 0
  });

  return (
    <section id="servicos" className="bg-white py-20" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <h2 className="section-title animate-on-scroll">{title}</h2>
        
        {servicesToShow && servicesToShow.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {servicesToShow.map((service, index) => {
              const serviceKey = (service as any).id ? String((service as any).id) : `service-${index}`;
              
              return (
                <div 
                  key={serviceKey}
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
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>Nenhum serviço disponível no momento.</p>
            <p className="text-sm mt-2">
              {items ? 'Configure os serviços no CMS.' : 'Configure os serviços na aba Serviços do painel admin.'}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default DynamicServices;
