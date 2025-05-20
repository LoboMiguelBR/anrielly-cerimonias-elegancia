
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Testimonial } from '../hooks/useTestimonials';

interface TestimonialCardProps {
  testimonial: Testimonial;
  onEdit: (testimonial: Testimonial) => void;
  onDelete: (testimonial: Testimonial) => void;
}

const TestimonialCard = ({ testimonial, onEdit, onDelete }: TestimonialCardProps) => {
  return (
    <div className="border rounded-md p-4 bg-white">
      <div className="flex items-center gap-4 mb-3">
        {testimonial.image_url ? (
          <img 
            src={testimonial.image_url} 
            alt={testimonial.name} 
            className="w-16 h-16 rounded-full object-cover border-2 border-gold/30"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.svg';
            }}
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gold/30">
            <span className="text-gray-500 text-xl font-bold">
              {testimonial.name.charAt(0)}
            </span>
          </div>
        )}
        <div>
          <h3 className="font-medium">{testimonial.name}</h3>
          <p className="text-sm text-gray-500">{testimonial.role}</p>
        </div>
      </div>
      
      <blockquote className="mb-4 text-gray-700 italic text-sm">
        "{testimonial.quote}"
      </blockquote>
      
      <div className="flex justify-end gap-2">
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => onEdit(testimonial)}
        >
          <Pencil size={14} className="mr-1" /> Editar
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          className="text-red-600" 
          onClick={() => onDelete(testimonial)}
        >
          <Trash2 size={14} className="mr-1" /> Remover
        </Button>
      </div>
    </div>
  );
};

export default TestimonialCard;
