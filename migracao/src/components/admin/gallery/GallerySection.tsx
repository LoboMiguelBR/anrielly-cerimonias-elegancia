
interface GallerySectionProps {
  totalImages: number;
  children: React.ReactNode;
}

const GallerySection = ({ totalImages, children }: GallerySectionProps) => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Imagens da Galeria ({totalImages})
      </h3>
      {children}
    </div>
  );
};

export default GallerySection;
