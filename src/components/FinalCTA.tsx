
import { useEffect, useRef } from 'react';

const FinalCTA = () => {
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

  return (
    <section id="cta-final" className="bg-pink-light/30 py-16" ref={sectionRef}>
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-playfair font-semibold mb-6 animate-on-scroll">
          Vamos celebrar seu momento com emoção e significado?
        </h2>
        <p className="text-xl text-gray-700 mb-10 max-w-2xl mx-auto animate-on-scroll">
          Clique abaixo e fale comigo agora mesmo.
        </p>
        
        <div className="flex flex-col md:flex-row gap-4 justify-center animate-on-scroll">
          <a 
            href="#contato" 
            className="btn btn-primary py-3 px-8 text-lg"
          >
            Solicitar Orçamento
          </a>
          <a 
            href="https://wa.me/5524992689947" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="bg-[#25D366] text-white py-3 px-8 rounded-full hover:bg-[#128C7E] transition-colors text-lg"
          >
            WhatsApp
          </a>
          <a 
            href="https://instagram.com/anrielly" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] text-white py-3 px-8 rounded-full hover:opacity-90 transition-opacity text-lg"
          >
            Instagram
          </a>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
