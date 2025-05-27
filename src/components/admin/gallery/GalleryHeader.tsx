
interface GalleryHeaderProps {
  totalImages: number;
}

const GalleryHeader = ({ totalImages }: GalleryHeaderProps) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Gestão de Galeria</h2>
      <p className="text-gray-600">Gerencie as imagens da sua galeria de eventos</p>
    </div>
  );
};

export default GalleryHeader;
