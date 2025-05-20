
import { useRef, useEffect } from 'react';
import GalleryGrid from './gallery/GalleryGrid';
import GalleryModal from './gallery/GalleryModal';
import { useGalleryContext } from './gallery/GalleryContext';

const Gallery = () => {
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

  // Apply animation when section becomes visible
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

  const handleImageClick = (url: string, title: string, description: string | null) => {
    setSelectedImage(url, title, description);
  };

  return (
    <section id="galeria" className="bg-white" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <h2 className="section-title animate-on-scroll">Galeria</h2>
        
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
