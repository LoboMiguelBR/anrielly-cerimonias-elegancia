
import React, { useState, useCallback } from 'react';
import { DisplayImage } from './types';
import { normalizeImageUrl } from '@/utils/imageUtils';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from '@/lib/utils';

interface GalleryCarouselProps {
  images: DisplayImage[];
}

const GalleryCarousel: React.FC<GalleryCarouselProps> = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const handleImageClick = useCallback((index: number) => {
    setActiveIndex(index);
    setIsExpanded(!isExpanded);
  }, [isExpanded]);

  return (
    <div className="w-full">
      {/* Main carousel */}
      <Carousel className="w-full mb-8"
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {images.map((image, index) => {
            const processedUrl = normalizeImageUrl(image.url);
            
            return (
              <CarouselItem 
                key={image.id} 
                className="pl-2 md:pl-4 xs:basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 cursor-pointer"
              >
                <div 
                  className="relative aspect-square overflow-hidden rounded-lg shadow-md group"
                  onClick={() => handleImageClick(index)}
                >
                  <img 
                    src={processedUrl} 
                    alt={`${image.title || 'Galeria Anrielly Gomes'}${image.description ? ` - ${image.description}` : ''}`} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                    draggable={false}
                    onError={(e) => {
                      console.error(`[GalleryCarousel] Falha ao carregar imagem: ${processedUrl}`);
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <div className="text-white text-center p-4">
                      {image.title && (
                        <h3 className="text-lg font-semibold">{image.title}</h3>
                      )}
                      {image.description && (
                        <p className="text-sm mt-1">{image.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <div className="flex justify-center gap-2 mt-4">
          <CarouselPrevious className="relative static transform-none translate-y-0" />
          <CarouselNext className="relative static transform-none translate-y-0" />
        </div>
      </Carousel>

      {/* Expanded image view */}
      <div 
        className={cn(
          "fixed inset-0 z-50 bg-black/80 flex items-center justify-center transition-opacity duration-300",
          isExpanded ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsExpanded(false)}
      >
        {isExpanded && images[activeIndex] && (
          <div className="max-w-6xl w-full p-4" onClick={e => e.stopPropagation()}>
            <img 
              src={normalizeImageUrl(images[activeIndex].url)} 
              alt={images[activeIndex].title || "Imagem ampliada"}
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
            />
            
            <div className="bg-black/50 text-white p-4 mt-2 rounded-lg">
              <h3 className="text-xl font-semibold">{images[activeIndex].title || "Detalhe"}</h3>
              {images[activeIndex].description && (
                <p className="mt-2">{images[activeIndex].description}</p>
              )}
            </div>
            
            <button 
              className="absolute top-4 right-4 text-white bg-black/50 w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/70"
              onClick={() => setIsExpanded(false)}
              aria-label="Fechar visualização"
            >
              ✕
            </button>

            <div className="absolute left-0 right-0 bottom-8 flex justify-center gap-4">
              <button 
                className="bg-white/20 hover:bg-white/40 p-3 rounded-full transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIndex((activeIndex - 1 + images.length) % images.length);
                }}
                aria-label="Imagem anterior"
              >
                ← 
              </button>
              <button 
                className="bg-white/20 hover:bg-white/40 p-3 rounded-full transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIndex((activeIndex + 1) % images.length);
                }}
                aria-label="Próxima imagem"
              >
                →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Thumbnail strip */}
      <div className="hidden md:block mt-8">
        <div className="flex overflow-x-auto space-x-2 py-2">
          {images.map((image, index) => (
            <div 
              key={`thumb-${image.id}`}
              className={cn(
                "w-20 h-20 flex-shrink-0 cursor-pointer rounded border-2",
                activeIndex === index ? "border-gold" : "border-transparent"
              )}
              onClick={() => setActiveIndex(index)}
            >
              <img 
                src={normalizeImageUrl(image.url)} 
                alt={`Miniatura - ${image.title || "Imagem"}`}
                className="w-full h-full object-cover rounded"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GalleryCarousel;
