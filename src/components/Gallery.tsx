
import { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";

const Gallery = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
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

  const images = [
    "/lovable-uploads/c8bfe776-c594-4d05-bc65-9472d76d5323.png",
    "/lovable-uploads/ea42111a-a240-43c5-84f8-067b63793694.png",
    "/lovable-uploads/e722dd38-54b1-498a-adeb-7a5a126035fd.png",
    "/lovable-uploads/d856da09-1255-4e7d-a9d6-0a2a04edac9d.png",
    "/lovable-uploads/2d2b8e86-59cd-4e39-8d62-d5843123bb08.png",
    "/lovable-uploads/38a84af5-3e22-4ae4-bcea-ef49e9e81209.png",
    "/lovable-uploads/c2283906-77d8-4d1c-a901-5453ea6dd515.png",
    "/lovable-uploads/322b9c8a-c27a-42c2-bbfd-b8fbcfd2c449.png"
  ];

  return (
    <section id="galeria" className="bg-white" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <h2 className="section-title animate-on-scroll">Galeria</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div 
              key={index} 
              className="aspect-square overflow-hidden rounded-lg shadow-md animate-on-scroll"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => setSelectedImage(image)}
            >
              <div className="relative h-full group cursor-pointer">
                <img 
                  src={image} 
                  alt={`Galeria Anrielly Gomes - Imagem ${index + 1}`} 
                  className="w-full h-full object-cover hover-zoom"
                />
                <div className="absolute inset-0 bg-gold/0 group-hover:bg-gold/20 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="sr-only">Ver ampliado</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-4xl p-1 bg-transparent border-none">
            <img 
              src={selectedImage || ''} 
              alt="Imagem ampliada" 
              className="w-full h-auto rounded-lg"
            />
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default Gallery;
