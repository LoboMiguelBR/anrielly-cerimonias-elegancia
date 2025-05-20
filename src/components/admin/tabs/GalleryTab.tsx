
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Upload } from 'lucide-react';
import { useGallery, GalleryImage } from '../hooks/useGallery';
import ImageUpload from '../gallery/ImageUpload';
import ImageEdit from '../gallery/ImageEdit';
import DeleteConfirmation from '../gallery/DeleteConfirmation';
import GalleryImageCard from '../gallery/GalleryImageCard';

const GalleryTab = () => {
  const {
    galleryImages,
    isLoading,
    deleteImage,
    updateImage,
    uploadImages
  } = useGallery();
  
  // Upload dialog state
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  
  // Edit dialog state
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [currentImage, setCurrentImage] = useState<GalleryImage | null>(null);
  
  // Delete confirmation dialog state
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<GalleryImage | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEditImage = (image: GalleryImage) => {
    setCurrentImage(image);
    setShowEditDialog(true);
  };

  const handleDeleteImage = (image: GalleryImage) => {
    setImageToDelete(image);
    setShowDeleteDialog(true);
  };

  const confirmDeleteImage = async () => {
    if (!imageToDelete) return;
    
    setIsDeleting(true);
    const success = await deleteImage(imageToDelete);
    setIsDeleting(false);
    
    if (success) {
      setShowDeleteDialog(false);
      setImageToDelete(null);
    }
  };

  const handleUploadImages = async (files: File[], title: string, description: string | null) => {
    return await uploadImages(files, title, description);
  };

  const handleSaveImageChanges = async (id: string, title: string, description: string | null) => {
    return await updateImage(id, title, description);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Gerenciar Galeria de Fotos</h2>
        <Button onClick={() => setShowUploadDialog(true)}>
          <Plus className="mr-2" size={16} /> Adicionar Imagens
        </Button>
      </div>
      
      {isLoading ? (
        <div className="p-12 text-center">Carregando imagens...</div>
      ) : galleryImages.length === 0 ? (
        <div className="p-12 text-center border-2 border-dashed rounded-lg">
          <p className="text-gray-500 mb-4">Nenhuma imagem na galeria</p>
          <Button onClick={() => setShowUploadDialog(true)} variant="outline">
            <Upload className="mr-2" size={16} /> Fazer upload de imagens
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {galleryImages.map((image) => (
            <GalleryImageCard 
              key={image.id}
              image={image}
              onEdit={handleEditImage}
              onDelete={handleDeleteImage}
            />
          ))}
        </div>
      )}
      
      {/* Upload Dialog */}
      <ImageUpload 
        open={showUploadDialog}
        onClose={() => setShowUploadDialog(false)}
        onUpload={handleUploadImages}
      />
      
      {/* Edit Dialog */}
      <ImageEdit
        open={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        onSave={handleSaveImageChanges}
        image={currentImage}
      />
      
      {/* Delete Confirmation Dialog */}
      <DeleteConfirmation
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDeleteImage}
        image={imageToDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default GalleryTab;
