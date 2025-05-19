
import { useState, useEffect } from 'react';

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section 
      id="hero" 
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
      style={{
        backgroundImage: 'url(/lovable-uploads/51ec6ddc-43be-45c4-9c33-1f407dba1411.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="absolute inset-0 bg-white/50 backdrop-blur-sm"></div>
      
      <div className={`container mx-auto px-4 relative z-10 text-center transition-all duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0 translate-y-10'}`}>
        <h1 className="font-playfair text-4xl md:text-6xl font-bold mb-6 text-gray-800">
          Anrielly Gomes
        </h1>
        <p className="font-playfair text-xl md:text-2xl mb-8 italic text-gray-700">
          Cerimônias com emoção, elegância e significado.
        </p>
        <a 
          href="#contato" 
          className="btn btn-primary"
        >
          Solicitar Orçamento
        </a>
      </div>
    </section>
  );
};

export default Hero;
