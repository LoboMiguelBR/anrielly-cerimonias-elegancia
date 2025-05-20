
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
  // Processar a URL da imagem apenas uma vez
  const normalizedImageUrl = normalizeImageUrl(imageUrl);
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
      <div className="mb-6">
        <img 
          src={normalizedImageUrl} 
          alt={name} 
          className="w-20 h-20 rounded-full object-cover border-2 border-gold/30"
          onError={(e) => {
            console.error(`[Testimonials] Falha ao carregar imagem de depoimento: ${normalizedImageUrl}`);
            // Fallback to placeholder if image fails to load
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
