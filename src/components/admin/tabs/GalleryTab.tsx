
import React, { useState, useEffect } from 'react';
import { Camera, Plus, Pencil, Trash2, Upload } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface GalleryImage {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  order_index: number | null;
}

const GalleryTab = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState<Partial<GalleryImage>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    fetchGalleryImages();

    // Set up realtime subscription
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'gallery' 
        },
        () => {
          fetchGalleryImages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchGalleryImages = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('order_index');

      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      console.error('Error fetching gallery images:', error);
      toast.error('Erro ao carregar imagens da galeria');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files);
    }
  };

  const handleImageUpload = async (files: FileList) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    const selectedFiles = Array.from(files).filter(file => 
      allowedTypes.includes(file.type)
    );
    
    if (selectedFiles.length === 0) {
      toast.error('Selecione apenas arquivos de imagem (JPEG, PNG, WEBP)');
      return;
    }

    setIsUploading(true);

    try {
      for (const file of selectedFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `gallery/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('gallery')
          .upload(filePath, file);
        
        if (uploadError) throw uploadError;
        
        const { data } = supabase.storage.from('gallery').getPublicUrl(filePath);
        
        await supabase.from('gallery').insert({
          title: file.name.split('.')[0],
          image_url: data.publicUrl,
          order_index: images.length
        });
      }

      toast.success('Imagem(ns) enviada(s) com sucesso!');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Erro ao enviar imagem');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditing && currentImage.id) {
        // Update existing image
        const { error } = await supabase
          .from('gallery')
          .update({
            title: currentImage.title,
            description: currentImage.description,
            updated_at: new Date().toISOString()
          })
          .eq('id', currentImage.id);
          
        if (error) throw error;
        toast.success('Imagem atualizada com sucesso!');
      }
      
      resetAndCloseDialog();
    } catch (error) {
      console.error('Error saving image:', error);
      toast.error('Erro ao salvar imagem');
    }
  };

  const handleDelete = async (id: string, imageUrl: string) => {
    if (!confirm('Tem certeza que deseja excluir esta imagem?')) return;
    
    try {
      // Extract the path from the URL
      const urlParts = imageUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const filePath = `gallery/${fileName}`;
      
      // Delete from storage
      await supabase.storage
        .from('gallery')
        .remove([filePath]);
        
      // Delete from database
      const { error } = await supabase
        .from('gallery')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      toast.success('Imagem removida com sucesso!');
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Erro ao excluir imagem');
    }
  };

  const handleEdit = (image: GalleryImage) => {
    setCurrentImage(image);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const resetAndCloseDialog = () => {
    setCurrentImage({});
    setIsEditing(false);
    setIsDialogOpen(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleImageUpload(e.target.files);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Gerenciar Galeria</h2>
        <div>
          <input
            type="file"
            id="image-upload"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <label htmlFor="image-upload">
            <Button as="span">
              <Upload className="mr-2 h-4 w-4" />
              Enviar Imagens
            </Button>
          </label>
        </div>
      </div>

      <div 
        className={`border-2 border-dashed ${dragActive ? 'border-gold bg-gold/10' : 'border-gray-300'} rounded-lg p-8 text-center mb-8`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Camera className="w-12 h-12 mx-auto text-gray-400 mb-2" />
        <p className="text-gray-600">Arraste e solte as imagens aqui ou clique no botão acima para fazer upload</p>
        {isUploading && <p className="text-gold mt-2">Enviando imagens...</p>}
      </div>

      {isLoading ? (
        <div className="py-10 text-center">Carregando imagens...</div>
      ) : images.length === 0 ? (
        <div className="py-10 text-center text-gray-500">
          <p>Nenhuma imagem encontrada</p>
          <label htmlFor="image-upload" className="mt-4 inline-block">
            <Button variant="outline" as="span">
              Adicionar Primeira Imagem
            </Button>
          </label>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <div key={image.id} className="relative group rounded-lg overflow-hidden shadow-sm border">
              <img 
                src={image.image_url} 
                alt={image.title}
                className="w-full aspect-square object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                <div className="text-white">
                  <h3 className="font-medium truncate">{image.title}</h3>
                  {image.description && (
                    <p className="text-sm text-gray-200 truncate">{image.description}</p>
                  )}
                </div>
                <div className="flex justify-end">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-white"
                    onClick={() => handleEdit(image)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-red-400"
                    onClick={() => handleDelete(image.id, image.image_url)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Detalhes da Imagem</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="mb-4">
              <img 
                src={currentImage.image_url} 
                alt={currentImage.title}
                className="max-h-48 mx-auto rounded-md object-contain"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Título *</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                value={currentImage.title || ''}
                onChange={e => setCurrentImage({...currentImage, title: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Descrição (opcional)</label>
              <textarea
                rows={3}
                className="w-full p-2 border rounded-md"
                value={currentImage.description || ''}
                onChange={e => setCurrentImage({...currentImage, description: e.target.value})}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={resetAndCloseDialog}>
                Cancelar
              </Button>
              <Button type="submit">
                Salvar Alterações
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GalleryTab;
