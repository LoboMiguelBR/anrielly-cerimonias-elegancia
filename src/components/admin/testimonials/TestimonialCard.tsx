
import { Pencil, Trash2, Check, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Testimonial } from '../hooks/useTestimonials';
import { normalizeImageUrl } from '@/utils/imageUtils';
import { Badge } from "@/components/ui/badge";

interface TestimonialCardProps {
  testimonial: Testimonial;
  onEdit: (testimonial: Testimonial) => void;
  onDelete: (testimonial: Testimonial) => void;
  onUpdateStatus: (testimonial: Testimonial, newStatus: 'pending' | 'approved' | 'rejected') => void;
}

const TestimonialCard = ({ testimonial, onEdit, onDelete, onUpdateStatus }: TestimonialCardProps) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pendente</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Aprovado</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejeitado</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  return (
    <div className="border rounded-md p-4 bg-white">
      <div className="flex items-center gap-4 mb-3">
        {testimonial.image_url ? (
          <img 
            src={normalizeImageUrl(testimonial.image_url)} 
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
          <div className="mt-1">{getStatusBadge(testimonial.status)}</div>
        </div>
      </div>
      
      <blockquote className="mb-4 text-gray-700 italic text-sm">
        "{testimonial.quote}"
      </blockquote>
      
      <div className="flex flex-wrap justify-end gap-2">
        {testimonial.status !== 'approved' && (
          <Button 
            size="sm" 
            variant="outline"
            className="text-green-600 border-green-200" 
            onClick={() => onUpdateStatus(testimonial, 'approved')}
          >
            <Check size={14} className="mr-1" /> Aprovar
          </Button>
        )}
        
        {testimonial.status !== 'rejected' && (
          <Button 
            size="sm" 
            variant="outline"
            className="text-red-600 border-red-200" 
            onClick={() => onUpdateStatus(testimonial, 'rejected')}
          >
            <X size={14} className="mr-1" /> Rejeitar
          </Button>
        )}
        
        {testimonial.status === 'rejected' && (
          <Button 
            size="sm" 
            variant="outline"
            className="text-yellow-600 border-yellow-200" 
            onClick={() => onUpdateStatus(testimonial, 'pending')}
          >
            Marcar como pendente
          </Button>
        )}
        
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
