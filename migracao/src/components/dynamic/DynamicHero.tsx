
import { useState, useEffect } from 'react';

interface DynamicHeroProps {
  title?: string;
  subtitle?: string;
  backgroundImage?: string;
  ctaPrimary?: string;
  ctaSecondary?: string;
  whatsappLink?: string;
}

const DynamicHero = ({
  title = "Anrielly Gomes",
  subtitle = "Cerimônias com emoção, elegância e significado.",
  backgroundImage = "/lovable-uploads/51ec6ddc-43be-45c4-9c33-1f407dba1411.png",
  ctaPrimary = "Solicitar Orçamento",
  ctaSecondary = "Fale no WhatsApp",
  whatsappLink = "https://wa.me/5524992689947"
}: DynamicHeroProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section 
      id="hero" 
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="absolute inset-0 bg-white/50 backdrop-blur-sm"></div>
      
      <div className={`container mx-auto px-4 relative z-10 text-center transition-all duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0 translate-y-10'}`}>
        <h1 className="font-playfair text-4xl md:text-6xl font-bold mb-6 text-gray-800">
          {title}
        </h1>
        <p className="font-playfair text-xl md:text-2xl mb-8 italic text-gray-700">
          {subtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="#contato" 
            className="btn btn-primary"
          >
            {ctaPrimary}
          </a>
          <a 
            href={whatsappLink}
            target="_blank" 
            rel="noopener noreferrer" 
            className="bg-[#25D366] text-white px-6 py-3 rounded-full hover:bg-[#128C7E] transition-colors inline-flex items-center justify-center"
          >
            {ctaSecondary}
          </a>
        </div>
      </div>
    </section>
  );
};

export default DynamicHero;
