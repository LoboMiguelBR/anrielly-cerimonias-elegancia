
import { MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const ServiceArea = () => {
  return (
    <section id="area-atuacao" className="bg-white py-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center animate-on-scroll">
          <div className="mb-4 text-gold">
            <MapPin className="w-8 h-8" />
          </div>
          <h3 className="text-xl md:text-2xl font-playfair text-center mb-2">Área de Atuação</h3>
          <p className="text-gray-700 text-center">
            Atendimento em Volta Redonda e Região Sul Fluminense
          </p>
          
          {/* Link para área administrativa */}
          <div className="mt-16 text-center text-sm text-gray-400">
            <Link to="/admin" className="hover:text-gold transition-colors">
              Área Administrativa
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceArea;
