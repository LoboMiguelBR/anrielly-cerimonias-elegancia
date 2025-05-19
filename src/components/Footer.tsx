
import { Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <img 
              src="/lovable-uploads/a1e9c8bb-3ef0-4768-8b5e-9fac87c9d598.png" 
              alt="Anrielly Gomes - Mestre de Cerimônia" 
              className="h-16"
            />
          </div>
          
          <div className="text-center md:text-right">
            <div className="flex justify-center md:justify-end mb-4">
              <a 
                href="https://instagram.com/anrielly" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-white hover:text-gold transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-6 h-6" />
              </a>
            </div>
            
            <p className="text-gray-400 italic mb-2">
              "Celebrando com amor em Volta Redonda e região"
            </p>
            
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Anrielly Gomes - Mestre de Cerimônia. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
