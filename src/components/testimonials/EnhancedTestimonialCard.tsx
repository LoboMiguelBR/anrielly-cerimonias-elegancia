
import { FC } from 'react';
import { normalizeImageUrl } from '@/utils/imageUtils';
import { TestimonialItemProps } from './TestimonialItem';
import { cn } from '@/lib/utils';

const EnhancedTestimonialCard: FC<TestimonialItemProps> = ({ name, role, quote, imageUrl }) => {
  const normalizedImageUrl = normalizeImageUrl(imageUrl);
  
  console.log('[EnhancedTestimonialCard]', { 
    name, 
    role, 
    imageUrl: imageUrl, 
    normalizedUrl: normalizedImageUrl 
  });

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col md:flex-row md:items-start gap-6">
      <div className="flex-shrink-0 flex justify-center md:justify-start">
        <div className="relative">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gold/20">
            <img 
              src={normalizedImageUrl} 
              alt={`Foto de ${name}`} 
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                console.error(`[EnhancedTestimonialCard] Falha ao carregar imagem de ${name}:`, normalizedImageUrl);
                (e.target as HTMLImageElement).src = '/placeholder.svg';
              }}
            />
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gold/80 rounded-full flex items-center justify-center text-white text-xl">
            "
          </div>
        </div>
      </div>
      
      <div className="flex-1">
        <blockquote>
          <p className="text-gray-700 italic text-lg leading-relaxed font-playfair mb-4">
            "{quote}"
          </p>
          
          <footer>
            <div className="flex flex-col md:flex-row md:items-center">
              <cite className="not-italic font-semibold text-lg">{name}</cite>
              <span className="md:ml-2 text-gray-500">{role}</span>
            </div>
            <div className="mt-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg 
                    key={star} 
                    className="w-4 h-4 text-yellow-400" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          </footer>
        </blockquote>
      </div>
    </div>
  );
};

export default EnhancedTestimonialCard;
