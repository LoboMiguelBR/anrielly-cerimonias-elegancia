
import { FC } from 'react';

export interface TestimonialItemProps {
  id: string;
  name: string;
  role: string;
  quote: string;
  imageUrl: string | null;
  status?: 'pending' | 'approved' | 'rejected';
}

const TestimonialItem: FC<TestimonialItemProps> = ({ name, role, quote, imageUrl }) => {
  return (
    <div className="testimonial-item text-center p-6">
      <div className="avatar mx-auto mb-4 relative">
        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gold/20 mx-auto">
          <img 
            src={imageUrl || '/placeholder.svg'} 
            alt={`Depoimento de ${name}`} 
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.svg';
            }}
          />
        </div>
        <div className="absolute -bottom-2 right-1/3 w-8 h-8 bg-gold/80 rounded-full flex items-center justify-center text-white text-xl">
          "
        </div>
      </div>
      <blockquote className="mb-4">
        <p className="italic text-gray-700">{quote}</p>
      </blockquote>
      <footer>
        <cite className="not-italic font-semibold">{name}</cite>
        {role && <span className="block text-gray-500 text-sm">{role}</span>}
      </footer>
    </div>
  );
};

export default TestimonialItem;
