
import { useState } from 'react';
import GalleryUpload from '../gallery/GalleryUpload';
import GalleryGrid from '../gallery/GalleryGrid';
import GalleryStats from '../gallery/GalleryStats';
import GalleryHeader from '../gallery/GalleryHeader';
import GallerySection from '../gallery/GallerySection';
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
      <GalleryHeader totalImages={totalImages} />

      <GalleryStats totalImages={totalImages} recentImages={recentImages} />

      <GalleryUpload onUpload={handleUpload} isUploading={isUploading} />

      <GallerySection totalImages={totalImages}>
        <GalleryGrid
          images={images}
          isLoading={isLoading}
          onUpdate={updateImage}
          onDelete={deleteImage}
        />
      </GallerySection>
    </div>
  );
};

export default AdminGalleryTab;
