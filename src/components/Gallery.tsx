
import React, { useRef } from 'react';

const Gallery: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  const galleryImages = [
    {
      id: "1",
      url: "/lovable-uploads/99442f1a-9c10-4e95-a063-bd0bda0a998c.png",
      title: "Cerimônia de Casamento",
      alt: "Anrielly conduzindo cerimônia de casamento"
    },
    {
      id: "2", 
      url: "/lovable-uploads/5c2761cc-ac8b-403d-9dba-85a4f27b4b6e.png",
      title: "Evento Especial",
      alt: "Anrielly em evento especial"
    },
    {
      id: "3",
      url: "/lovable-uploads/51ec6ddc-43be-45c4-9c33-1f407dba1411.png",
      title: "Momento Especial",
      alt: "Momento especial de cerimônia"
    }
  ];

  return (
    <section id="galeria" className="bg-white py-16" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <h2 className="section-title animate-on-scroll text-3xl font-semibold text-center mb-8">
          Galeria
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((image, index) => (
            <div 
              key={image.id}
              className="relative overflow-hidden rounded-lg shadow-lg group animate-on-scroll hover-zoom"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <img
                src={image.url}
                alt={image.alt}
                className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="font-semibold">{image.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {galleryImages.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>Em breve, mais imagens da nossa galeria.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;
