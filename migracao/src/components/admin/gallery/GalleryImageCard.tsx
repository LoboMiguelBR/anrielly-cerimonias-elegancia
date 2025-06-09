
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from 'lucide-react';
import { GalleryImage } from '../hooks/useGallery';

interface GalleryImageCardProps {
  image: GalleryImage;
  onEdit: (image: GalleryImage) => void;
  onDelete: (image: GalleryImage) => void;
}

const GalleryImageCard = ({ image, onEdit, onDelete }: GalleryImageCardProps) => {
  return (
    <div className="group relative border rounded-md overflow-hidden">
      <img 
        src={image.image_url} 
        alt={image.title} 
        className="w-full aspect-square object-cover"
        onError={(e) => {
          (e.target as HTMLImageElement).src = '/placeholder.svg';
        }}
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            className="bg-white hover:bg-gray-100 text-gray-800" 
            onClick={() => onEdit(image)}
          >
            <Pencil size={16} /> Editar
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="bg-white hover:bg-gray-100 text-red-600" 
            onClick={() => onDelete(image)}
          >
            <Trash2 size={16} /> Remover
          </Button>
        </div>
      </div>
      <div className="p-2 bg-white">
        <p className="font-medium text-sm truncate">{image.title}</p>
        {image.description && (
          <p className="text-xs text-gray-500 truncate">{image.description}</p>
        )}
      </div>
    </div>
  );
};

export default GalleryImageCard;
