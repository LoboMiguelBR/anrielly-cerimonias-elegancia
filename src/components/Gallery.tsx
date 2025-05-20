
import { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface GalleryImage {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
}

const Gallery = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageTitle, setSelectedImageTitle] = useState<string>('');
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    fetchGalleryImages();
    
    // Set up realtime subscription
    const channel = supabase
      .channel('public:gallery')
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
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchGalleryImages = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('order_index');

      if (error) throw error;
      
      if (data && data.length > 0) {
        console.log('Gallery images fetched successfully:', data.length, 'images');
        
        // Corrige URLs das imagens para evitar o padrão 'v1/object/public/v1/object/public'
        // que aparece nos erros
        const validatedImages = data.map(img => {
          if (!img.image_url) {
            console.warn('Image without URL found:', img.id);
            return img;
          }
          
          let fixedUrl = img.image_url;
          
          // Corrige URLs duplicadas
          if (img.image_url.includes('/v1/object/public/v1/object/public/')) {
            fixedUrl = img.image_url.replace('/v1/object/public/v1/object/public/', '/v1/object/public/');
            console.log('Fixed duplicate path in URL:', fixedUrl);
          }
          
          // Se a URL for do Supabase Storage, regenera a URL pública
          if (fixedUrl.includes('storage.googleapis.com') || fixedUrl.includes('supabase.co/storage')) {
            try {
              // Extrai o bucket e o caminho do arquivo
              const url = new URL(fixedUrl);
              const pathParts = url.pathname.split('/');
              // Encontra o bucket e o nome do arquivo
              const bucketIndex = pathParts.findIndex(part => part === 'object' || part === 'storage');
              
              if (bucketIndex !== -1 && pathParts.length > bucketIndex + 2) {
                const bucket = pathParts[bucketIndex + 1];
                const filePath = pathParts.slice(bucketIndex + 2).join('/');
                
                console.log(`Regenerating URL for bucket: ${bucket}, path: ${filePath}`);
                
                const { data: publicUrlData } = supabase.storage
                  .from(bucket)
                  .getPublicUrl(filePath);
                
                if (publicUrlData?.publicUrl) {
                  console.log(`Regenerated URL: ${publicUrlData.publicUrl}`);
                  return { ...img, image_url: publicUrlData.publicUrl };
                }
              }
            } catch (urlError) {
              console.error('Error fixing image URL:', urlError);
            }
          }
          
          return { ...img, image_url: fixedUrl };
        });
        
        setImages(validatedImages);
      } else {
        console.log('No gallery images found in the database, using fallback static images');
        setImages([]);
      }
    } catch (error: any) {
      console.error('Error fetching gallery images:', error);
      setError(error.message || 'Erro ao carregar imagens da galeria');
      toast.error('Não foi possível carregar a galeria de imagens', {
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fallback to static images if no images in database
  const staticImages = [
    "/lovable-uploads/c8bfe776-c594-4d05-bc65-9472d76d5323.png",
    "/lovable-uploads/ea42111a-a240-43c5-84f8-067b63793694.png",
    "/lovable-uploads/e722dd38-54b1-498a-adeb-7a5a126035fd.png",
    "/lovable-uploads/d856da09-1255-4e7d-a9d6-0a2a04edac9d.png",
    "/lovable-uploads/2d2b8e86-59cd-4e39-8d62-d5843123bb08.png",
    "/lovable-uploads/38a84af5-3e22-4ae4-bcea-ef49e9e81209.png",
    "/lovable-uploads/c2283906-77d8-4d1c-a901-5453ea6dd515.png",
    "/lovable-uploads/322b9c8a-c27a-42c2-bbfd-b8fbcfd2c449.png"
  ];

  const displayImages = images.length > 0 
    ? images.map(img => ({ 
        id: img.id, 
        url: img.image_url, 
        title: img.title, 
        description: img.description 
      }))
    : staticImages.map((url, i) => ({ 
        id: `static-${i}`, 
        url, 
        title: `Imagem ${i+1}`, 
        description: null 
      }));

  const handleImageClick = (url: string, title: string) => {
    setSelectedImage(url);
    setSelectedImageTitle(title);
  };

  return (
    <section id="galeria" className="bg-white" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <h2 className="section-title animate-on-scroll">Galeria</h2>
        
        {isLoading ? (
          <div className="py-20 text-center">Carregando galeria...</div>
        ) : error ? (
          <div className="py-10 text-center text-red-500">
            {error}
            <div className="mt-4">
              <button 
                onClick={() => fetchGalleryImages()}
                className="px-4 py-2 bg-gold/80 text-white rounded-md hover:bg-gold transition-colors"
              >
                Tentar novamente
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {displayImages.map((image, index) => (
              <div 
                key={image.id} 
                className="aspect-square overflow-hidden rounded-lg shadow-md animate-on-scroll"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => handleImageClick(image.url, image.title)}
              >
                <div className="relative h-full group cursor-pointer">
                  <img 
                    src={image.url} 
                    alt={image.title || `Galeria Anrielly Gomes - Imagem ${index + 1}`} 
                    className="w-full h-full object-cover hover-zoom"
                    onError={(e) => {
                      console.error(`Failed to load image: ${image.url}`);
                      // Fallback to placeholder if image fails to load
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gold/0 group-hover:bg-gold/20 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="sr-only">Ver ampliado</span>
                    </div>
                  </div>
                  {image.description && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-sm truncate">{image.description}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-4xl p-1 bg-transparent border-none">
            <DialogTitle className="sr-only">
              {selectedImageTitle || 'Imagem ampliada'}
            </DialogTitle>
            <img 
              src={selectedImage || ''} 
              alt={selectedImageTitle || 'Imagem ampliada'} 
              className="w-full h-auto rounded-lg"
              onError={(e) => {
                console.error(`Failed to load enlarged image: ${selectedImage}`);
                (e.target as HTMLImageElement).src = '/placeholder.svg';
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default Gallery;
