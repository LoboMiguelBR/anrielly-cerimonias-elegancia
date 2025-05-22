
import React, { useRef } from 'react';
import { useGalleryContext } from './gallery/GalleryContext';
import GalleryGrid from './gallery/GalleryGrid';
import { Button } from "@/components/ui/button";

const Gallery: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { displayImages, isLoading, error, fetchGalleryImages, openImageModal } = useGalleryContext();

  return (
    <section id="galeria" className="bg-white py-16" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <h2 className="section-title animate-on-scroll text-3xl font-semibold text-center mb-8">
          Galeria
        </h2>

        {/* Always render GalleryGrid component regardless of state */}
        <GalleryGrid 
          isLoading={isLoading}
          error={error}
          displayImages={displayImages}
          onRetry={fetchGalleryImages}
          onImageClick={(url, title, description) => openImageModal(url, title, description)}
        />
      </div>
    </section>
  );
};

export default Gallery;
