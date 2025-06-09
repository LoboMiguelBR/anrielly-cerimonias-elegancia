
import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Edit2, Trash2, GripVertical, Save, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { GalleryImage } from '@/hooks/useGalleryAdmin';
import { useMobileLayout } from '@/hooks/useMobileLayout';

interface GalleryGridProps {
  images: GalleryImage[];
  isLoading: boolean;
  onUpdate: (id: string, updates: Partial<GalleryImage>) => Promise<GalleryImage>;
  onDelete: (id: string) => Promise<void>;
}

const GalleryGrid = ({ images, isLoading, onUpdate, onDelete }: GalleryGridProps) => {
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const { isMobile } = useMobileLayout();

  const handleEdit = (image: GalleryImage) => {
    setEditingImage(image);
    setEditTitle(image.title);
    setEditDescription(image.description || '');
  };

  const handleSave = async () => {
    if (!editingImage) return;

    setIsUpdating(true);
    try {
      await onUpdate(editingImage.id, {
        title: editTitle.trim(),
        description: editDescription.trim() || undefined
      });
      setEditingImage(null);
    } catch (error) {
      // Error is handled in the hook
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    setEditingImage(null);
    setEditTitle('');
    setEditDescription('');
  };

  if (isLoading) {
    return (
      <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-3'}`}>
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="aspect-video bg-gray-200 rounded-t-lg"></div>
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="text-gray-500">
            <p className="text-lg mb-2">Nenhuma imagem na galeria</p>
            <p className="text-sm">Adicione sua primeira imagem usando o formulário acima</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-3'}`}>
        {images.map((image) => (
          <Card key={image.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <img
                src={image.image_url}
                alt={image.title}
                className="w-full aspect-video object-cover"
              />
              <div className="absolute top-2 right-2 flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(image)}
                  className="bg-white/80 hover:bg-white"
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white/80 hover:bg-white text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja excluir a imagem "{image.title}"? 
                        Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onDelete(image.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
              <Badge variant="secondary" className="absolute bottom-2 left-2">
                #{image.order_index}
              </Badge>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900 mb-1">{image.title}</h3>
              {image.description && (
                <p className="text-sm text-gray-600 mb-2">{image.description}</p>
              )}
              <p className="text-xs text-gray-500">
                Adicionada em {format(new Date(image.created_at), 'dd/MM/yyyy', { locale: ptBR })}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!editingImage} onOpenChange={() => handleCancel()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Imagem</DialogTitle>
          </DialogHeader>
          
          {editingImage && (
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={editingImage.image_url}
                  alt={editingImage.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-title">Título *</Label>
                  <Input
                    id="edit-title"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="Título da imagem"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-description">Descrição</Label>
                  <Textarea
                    id="edit-description"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder="Descrição opcional da imagem"
                    rows={3}
                  />
                </div>

                <div className="flex gap-3 justify-end">
                  <Button variant="outline" onClick={handleCancel}>
                    <X className="w-4 h-4 mr-2" />
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={!editTitle.trim() || isUpdating}
                    className="bg-rose-500 hover:bg-rose-600 text-white"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isUpdating ? 'Salvando...' : 'Salvar'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GalleryGrid;
