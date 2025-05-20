
import React from 'react';

interface GalleryImageProps {
  url: string;
  title: string;
  description: string | null;
  index: number;
  onClick: () => void;
}

const GalleryImage: React.FC<GalleryImageProps> = ({ 
  url, 
  title, 
  description, 
  index, 
  onClick 
}) => {
  // Fix URL if it contains duplicate paths
  const fixImageUrl = (url: string): string => {
    if (url.includes('/v1/object/public/v1/object/public/')) {
      return url.replace('/v1/object/public/v1/object/public/', '/v1/object/public/');
    }
    return url;
  };
  
  const processedUrl = fixImageUrl(url);

  return (
    <div 
      className="aspect-square overflow-hidden rounded-lg shadow-md animate-on-scroll"
      style={{ animationDelay: `${index * 100}ms` }}
      onClick={onClick}
    >
      <div className="relative h-full group cursor-pointer">
        <img 
          src={processedUrl} 
          alt={title || `Galeria Anrielly Gomes - Imagem ${index + 1}`} 
          className="w-full h-full object-cover hover-zoom"
          onError={(e) => {
            console.error(`Failed to load image: ${processedUrl}`);
            // Fallback to placeholder if image fails to load
            (e.target as HTMLImageElement).src = '/placeholder.svg';
          }}
        />
        <div className="absolute inset-0 bg-gold/0 group-hover:bg-gold/20 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="sr-only">Ver ampliado</span>
          </div>
        </div>
        {description && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <p className="text-sm truncate">{description}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryImage;
