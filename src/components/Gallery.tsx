import React, { useRef, useEffect, useCallback } from 'react';
import GalleryGrid from './gallery/GalleryGrid';
import GalleryModal from './gallery/GalleryModal';
import { useGalleryContext } from './gallery/GalleryContext';

const Gallery: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  
  const { 
    selectedImage, 
    selectedImageTitle, 
    selectedImageDescription, 
    setSelectedImage, 
    displayImages, 
    isLoading, 
    error, 
    fetchGalleryImages 
  } = useGalleryContext();

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

  const handleImageClick = useCallback(
    (url: string, title: string, description: string | null) => {
      setSelectedImage(url, title, description);
    },
    [setSelectedImage]
  );

  console.log('[Gallery] displayImages:', displayImages);
  console.log('[Gallery] isLoading:', isLoading, 'error:', error);

  return (
    <section id="galeria" className="bg-white" ref={sectionRef}>
      <div className="container mx-auto px-4 py-12">
        <h2 className="section-title animate-on-scroll text-3xl font-semibold text-center mb-8">
          Galeria
        </h2>
        
        <GalleryGrid 
          isLoading={isLoading}
          error={error}
          displayImages={displayImages}
          onRetry={fetchGalleryImages}
          onImageClick={handleImageClick}
        />

        <GalleryModal 
          isOpen={!!selectedImage} 
          onClose={() => setSelectedImage(null, '', null)}
          imageUrl={selectedImage}
          imageTitle={selectedImageTitle}
          imageDescription={selectedImageDescription}
        />
      </div>
    </section>
  );
};

export default Gallery;
