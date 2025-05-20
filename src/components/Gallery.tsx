
import React, { useRef } from 'react';
import { useGalleryContext } from './gallery/GalleryContext';
import GalleryCarousel from './gallery/GalleryCarousel';
import { Button } from "@/components/ui/button";

const Gallery: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { displayImages, isLoading, error, fetchGalleryImages } = useGalleryContext();

  return (
    <section id="galeria" className="bg-white py-16" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <h2 className="section-title animate-on-scroll text-3xl font-semibold text-center mb-8">
          Galeria
        </h2>

        {isLoading ? (
          <div className="py-10 text-center" aria-busy="true">
            Carregando imagens...
          </div>
        ) : error ? (
          <div className="py-10 text-center text-red-500" role="alert">
            <p>{error}</p>
            <div className="mt-4">
              <Button 
                onClick={fetchGalleryImages}
                className="px-4 py-2 bg-gold/80 text-white rounded-md hover:bg-gold transition-colors"
                aria-label="Tentar recarregar galeria"
              >
                Tentar novamente
              </Button>
            </div>
          </div>
        ) : displayImages.length === 0 ? (
          <div className="py-10 text-center text-gray-500">
            Nenhuma imagem disponível no momento.
          </div>
        ) : (
          <GalleryCarousel images={displayImages} />
        )}
      </div>
    </section>
  );
};

export default Gallery;
