
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Image, Upload, Trash2 } from 'lucide-react';
import GalleryUpload from '../gallery/GalleryUpload';
import GalleryGrid from '../gallery/GalleryGrid';
import { useGalleryAdmin } from '@/hooks/useGalleryAdmin';

const AdminGalleryTab = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { images, isLoading, uploadImage, updateImage, deleteImage } = useGalleryAdmin();

  const handleUpload = async (file: File, title: string, description?: string) => {
    setIsUploading(true);
    try {
      return await uploadImage(file, title, description);
    } finally {
      setIsUploading(false);
    }
  };

  // Estatísticas
  const totalImages = images.length;
  const recentImages = images.filter(img => {
    const createdAt = new Date(img.created_at);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return createdAt > weekAgo;
  }).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Gestão de Galeria</h2>
        <p className="text-gray-600">Gerencie as imagens da sua galeria de eventos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Image className="w-4 h-4" />
              Total de Imagens
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{totalImages}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Adicionadas Esta Semana
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-600">{recentImages}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold text-green-600">
              {totalImages > 0 ? 'Galeria Ativa' : 'Galeria Vazia'}
            </div>
          </CardContent>
        </Card>
      </div>

      <GalleryUpload onUpload={handleUpload} isUploading={isUploading} />

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Imagens da Galeria ({totalImages})
        </h3>
        <GalleryGrid
          images={images}
          isLoading={isLoading}
          onUpdate={updateImage}
          onDelete={deleteImage}
        />
      </div>
    </div>
  );
};

export default AdminGalleryTab;
