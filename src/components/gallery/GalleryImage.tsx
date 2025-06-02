
import React from 'react';
import { DisplayImage } from './types';
import { normalizeImageUrl } from '@/utils/imageUtils';

interface GalleryImageProps {
  image: DisplayImage;
  onClick: () => void;
}

const GalleryImage: React.FC<GalleryImageProps> = ({ image, onClick }) => {
  const imageUrl = normalizeImageUrl(image.url);

  return (
    <div 
      className="relative overflow-hidden rounded-lg shadow-md cursor-pointer hover:shadow-xl transition-all duration-300 aspect-square"
      onClick={onClick}
    >
      <img
        src={imageUrl}
        alt={`${image.title}${image.description ? ` - ${image.description}` : ''}`}
        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
        loading="lazy"
        onError={(e) => {
          (e.target as HTMLImageElement).src = '/placeholder.svg';
        }}
      />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
        <h3 className="text-white font-semibold line-clamp-1">{image.title}</h3>
      </div>
    </div>
  );
};

export default GalleryImage;
