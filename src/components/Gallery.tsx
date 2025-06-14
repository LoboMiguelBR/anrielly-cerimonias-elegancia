import React, { useRef } from 'react';
import { useGalleryContext } from './gallery/GalleryContext';
import GalleryMasonry from './gallery/GalleryMasonry';

const Gallery: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { displayImages, isLoading, error, fetchGalleryImages, openImageModal } = useGalleryContext();

  return (
    <section id="galeria" className="bg-white py-16" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <h2 className="section-title animate-on-scroll text-3xl font-semibold text-center mb-8">
          Galeria
        </h2>
        <GalleryMasonry
          images={displayImages}
          isLoading={isLoading}
          error={error}
          onRetry={fetchGalleryImages}
          onImageClick={openImageModal}
        />
      </div>
    </section>
  );
};

export default Gallery;
