
import React from "react";
import { DisplayImage } from "./types";
import GalleryImage from "./GalleryImage";
import { cn } from "@/lib/utils";

interface GalleryMasonryProps {
  images: DisplayImage[];
  onImageClick: (url: string, title: string, description: string | null) => void;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}

const Skeleton = () => (
  <div className="rounded-lg bg-gray-200 animate-pulse aspect-square w-full h-44" />
);

const GalleryMasonry: React.FC<GalleryMasonryProps> = ({
  images,
  onImageClick,
  isLoading,
  error,
  onRetry,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <button onClick={onRetry} className="px-4 py-2 bg-gold rounded text-white">
          Tentar novamente
        </button>
      </div>
    );
  }

  if (!images.length) {
    return <p className="text-center py-12">Nenhuma imagem disponível na galeria.</p>;
  }

  // Masonry CSS grid usando colunas auto-fill
  return (
    <div
      className={cn(
        "grid",
        "gap-4",
        "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
        "auto-rows-[10px]"
      )}
      style={{
        gridAutoRows: "10px"
      }}
    >
      {images.map((image) => (
        <div
          key={image.id}
          className="relative group cursor-pointer"
          style={{
            gridRowEnd: `span ${Math.floor(Math.random() * 8) + 15}`, // Simulação para masonry
          }}
          onClick={() => onImageClick(image.url, image.title, image.description)}
        >
          <GalleryImage image={image} onClick={() => onImageClick(image.url, image.title, image.description)} />
        </div>
      ))}
    </div>
  );
};

export default GalleryMasonry;
