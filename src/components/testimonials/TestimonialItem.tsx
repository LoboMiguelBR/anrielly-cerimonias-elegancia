
import { FC } from 'react';
import { normalizeImageUrl } from '@/utils/imageUtils';

export interface TestimonialItemProps {
  id: string;
  name: string;
  role: string;
  quote: string;
  imageUrl: string | null;
}

const TestimonialItem: FC<TestimonialItemProps> = ({ name, role, quote, imageUrl }) => {
  const normalizedImageUrl = normalizeImageUrl(imageUrl);
  
  console.log('[TestimonialItem]', { name, imageUrl, normalizedUrl: normalizedImageUrl });

  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
      <div className="mb-6">
        <img 
          src={normalizedImageUrl} 
          alt={`Foto de ${name}`} 
          className="w-20 h-20 rounded-full object-cover border-2 border-gold/30"
          loading="lazy"
          onError={(e) => {
            console.error(`[TestimonialItem] Falha ao carregar imagem de ${name}: ${normalizedImageUrl}`);
            (e.target as HTMLImageElement).src = '/placeholder.svg';
          }}
        />
      </div>
      <blockquote className="text-center mb-4 font-playfair italic text-gray-700">
        "{quote}"
      </blockquote>
      <div className="text-center">
        <p className="font-semibold">{name}</p>
        <p className="text-sm text-gray-500">{role}</p>
      </div>
    </div>
  );
};

export default TestimonialItem;
