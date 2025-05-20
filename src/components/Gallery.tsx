
import { useRef, useState, useEffect } from 'react';
import { useGalleryImages } from './gallery/useGalleryImages';
import GalleryGrid from './gallery/GalleryGrid';
import GalleryModal from './gallery/GalleryModal';

const Gallery = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageTitle, setSelectedImageTitle] = useState<string>('');
  
  const { images, isLoading, error, fetchGalleryImages, staticImages } = useGalleryImages();

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

  // Convert database images or use static fallback
  const displayImages = images.length > 0 
    ? images.map(img => ({ 
        id: img.id, 
        url: img.image_url, 
        title: img.title, 
        description: img.description 
      }))
    : staticImages.map((url, i) => ({ 
        id: `static-${i}`, 
        url, 
        title: `Imagem ${i+1}`, 
        description: null 
      }));

  const handleImageClick = (url: string, title: string) => {
    setSelectedImage(url);
    setSelectedImageTitle(title);
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
          onClose={() => setSelectedImage(null)}
          imageUrl={selectedImage}
          imageTitle={selectedImageTitle}
        />
      </div>
    </section>
  );
};

export default Gallery;
