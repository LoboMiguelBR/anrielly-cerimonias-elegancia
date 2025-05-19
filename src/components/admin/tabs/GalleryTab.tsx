
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'sonner';
import { Trash2, Upload, Plus, Pencil, X, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Progress } from '@/components/ui/progress';

const GalleryTab = () => {
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Upload dialog state
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [imageTitle, setImageTitle] = useState('');
  const [imageDescription, setImageDescription] = useState('');
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  
  // Edit dialog state
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [currentImage, setCurrentImage] = useState<any>(null);
  
  // Delete confirmation dialog state
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<any>(null);
  
  useEffect(() => {
    fetchGalleryImages();
    
    // Ensure bucket exists when component mounts
    const ensureBucketExists = async () => {
      try {
        const { data, error } = await supabase.storage.getBucket('gallery');
        
        if (error && error.message.includes('bucket not found')) {
          const { error: createError } = await supabase.storage.createBucket('gallery', {
            public: true,
            fileSizeLimit: 10485760, // 10MB
            allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
          });
          
          if (createError) {
            console.error('Error creating gallery bucket:', createError);
            toast.error('Erro ao criar bucket de armazenamento');
          } else {
            console.log('Gallery bucket created successfully');
          }
        } else if (error) {
          console.error('Error checking gallery bucket:', error);
        }
      } catch (err) {
        console.error('Unexpected error checking bucket:', err);
      }
    };
    
    ensureBucketExists();
    
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
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchGalleryImages = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('order_index', { ascending: true });
        
      if (error) throw error;
      
      setGalleryImages(data || []);
    } catch (error) {
      console.error('Error fetching gallery images:', error);
      toast.error('Erro ao carregar imagens da galeria');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      setUploadFiles([]);
      setPreviewUrls([]);
      return;
    }
    
    // Convert FileList to array and set state
    const fileArray = Array.from(files);
    setUploadFiles(fileArray);
    
    // Set default title based on the first file
    if (fileArray.length === 1) {
      setImageTitle(fileArray[0].name.split('.')[0]);
    } else {
      setImageTitle(`Imagens (${fileArray.length})`);
    }
    
    // Create preview URLs for all files
    const newPreviewUrls: string[] = [];
    
    fileArray.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviewUrls.push(reader.result as string);
        setPreviewUrls([...newPreviewUrls]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFilePreview = (index: number) => {
    const newFiles = [...uploadFiles];
    const newPreviewUrls = [...previewUrls];
    
    newFiles.splice(index, 1);
    newPreviewUrls.splice(index, 1);
    
    setUploadFiles(newFiles);
    setPreviewUrls(newPreviewUrls);
    
    if (newFiles.length === 0) {
      setImageTitle('');
    } else if (newFiles.length === 1) {
      setImageTitle(newFiles[0].name.split('.')[0]);
    }
  };

  const handleUpload = async () => {
    if (uploadFiles.length === 0 || !imageTitle) {
      toast.error('Selecione pelo menos um arquivo e forneça um título');
      return;
    }
    
    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      // First check if bucket exists
      const { data: bucketData, error: bucketError } = await supabase.storage.getBucket('gallery');
      
      if (bucketError && bucketError.message.includes('bucket not found')) {
        const { error: createError } = await supabase.storage.createBucket('gallery', {
          public: true,
          fileSizeLimit: 10485760,
          allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
        });
        
        if (createError) {
          throw new Error(`Erro ao criar bucket de armazenamento: ${createError.message}`);
        }
      } else if (bucketError) {
        throw new Error(`Erro ao verificar bucket de armazenamento: ${bucketError.message}`);
      }
      
      let successCount = 0;
      const totalFiles = uploadFiles.length;
      
      // Process each file sequentially
      for (let i = 0; i < uploadFiles.length; i++) {
        const file = uploadFiles[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${i}.${fileExt}`;
        
        // 1. Upload image to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('gallery')
          .upload(fileName, file);
        
        if (uploadError) {
          console.error(`Error uploading file ${i+1}:`, uploadError);
          toast.error(`Erro ao fazer upload do arquivo ${i+1}: ${uploadError.message}`);
          continue;  // Skip to next file on error
        }
        
        // 2. Get public URL
        const { data: publicUrlData } = supabase.storage
          .from('gallery')
          .getPublicUrl(fileName);
        
        const publicUrl = publicUrlData.publicUrl;
        
        // 3. Create record in gallery table
        // For multiple files, add numbering to title if not custom per file
        const itemTitle = totalFiles > 1 
          ? `${imageTitle} (${i+1}/${totalFiles})` 
          : imageTitle;
          
        const { error: insertError } = await supabase
          .from('gallery')
          .insert({
            title: itemTitle,
            description: imageDescription || null,
            image_url: publicUrl,
            order_index: galleryImages.length + i
          });
        
        if (insertError) {
          console.error(`Error creating gallery entry ${i+1}:`, insertError);
          toast.error(`Erro ao registrar imagem ${i+1} no banco de dados: ${insertError.message}`);
          continue;  // Skip to next file on error
        }
        
        successCount++;
        setUploadProgress(Math.round((i + 1) / totalFiles * 100));
      }
      
      if (successCount === 0) {
        toast.error('Não foi possível fazer o upload das imagens');
      } else if (successCount < totalFiles) {
        toast.warning(`Upload parcial: ${successCount} de ${totalFiles} imagens foram adicionadas`);
      } else {
        toast.success(`${totalFiles} ${totalFiles === 1 ? 'imagem adicionada' : 'imagens adicionadas'} com sucesso!`);
      }
      
      setShowUploadDialog(false);
      
      // Reset form
      setUploadFiles([]);
      setImageTitle('');
      setImageDescription('');
      setPreviewUrls([]);
      
    } catch (error: any) {
      console.error('Error uploading images:', error);
      toast.error(`Erro ao fazer upload: ${error.message}`);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleEditImage = (image: any) => {
    setCurrentImage(image);
    setImageTitle(image.title);
    setImageDescription(image.description || '');
    setShowEditDialog(true);
  };

  const saveImageChanges = async () => {
    if (!currentImage || !imageTitle) {
      toast.error('O título é obrigatório');
      return;
    }
    
    try {
      setIsUploading(true);
      
      const { error } = await supabase
        .from('gallery')
        .update({
          title: imageTitle,
          description: imageDescription || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentImage.id);
      
      if (error) throw error;
      
      toast.success('Imagem atualizada com sucesso!');
      setShowEditDialog(false);
      
    } catch (error: any) {
      console.error('Error updating image:', error);
      toast.error(`Erro ao atualizar: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const confirmDeleteImage = (image: any) => {
    setImageToDelete(image);
    setShowDeleteDialog(true);
  };

  const deleteImage = async () => {
    if (!imageToDelete) return;
    
    try {
      // Extract the file name from the URL
      const url = new URL(imageToDelete.image_url);
      const filePath = url.pathname.split('/').pop();
      
      // Delete image from storage
      if (filePath) {
        const { error: storageError } = await supabase.storage
          .from('gallery')
          .remove([filePath]);
        
        if (storageError) {
          console.error('Storage removal error:', storageError);
          // Continue with deletion from database even if storage removal fails
        }
      }
      
      // Delete from gallery table
      const { error } = await supabase
        .from('gallery')
        .delete()
        .eq('id', imageToDelete.id);
      
      if (error) throw error;
      
      toast.success('Imagem removida com sucesso!');
      setShowDeleteDialog(false);
      setImageToDelete(null);
      
    } catch (error: any) {
      console.error('Error deleting image:', error);
      toast.error(`Erro ao excluir: ${error.message}`);
    }
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
            <div key={image.id} className="group relative border rounded-md overflow-hidden">
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
                    onClick={() => handleEditImage(image)}
                  >
                    <Pencil size={16} /> Editar
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="bg-white hover:bg-gray-100 text-red-600" 
                    onClick={() => confirmDeleteImage(image)}
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
          ))}
        </div>
      )}
      
      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Novas Imagens</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4">
            {previewUrls.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-60 overflow-y-auto p-2">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative w-full aspect-square">
                    <img 
                      src={url} 
                      alt={`Preview ${index + 1}`} 
                      className="w-full h-full object-cover rounded-md"
                    />
                    <button
                      onClick={() => removeFilePreview(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                      type="button"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center w-full">
                <label htmlFor="upload-image" className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Clique para fazer upload</span>
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG ou WEBP (máx. 10MB)</p>
                    <p className="text-xs text-gray-500 mt-1">Selecione várias imagens segurando Ctrl/Cmd</p>
                  </div>
                  <input
                    id="upload-image"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                    multiple
                  />
                </label>
              </div>
            )}

            {isUploading && (
              <div className="my-2">
                <Progress value={uploadProgress} />
                <p className="text-xs text-center mt-1">Upload: {uploadProgress}%</p>
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="title">Título das Imagens</Label>
              <Input
                id="title"
                value={imageTitle}
                onChange={(e) => setImageTitle(e.target.value)}
                placeholder="Título para as imagens"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Descrição (opcional)</Label>
              <Textarea
                id="description"
                value={imageDescription}
                onChange={(e) => setImageDescription(e.target.value)}
                placeholder="Adicione uma breve descrição..."
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowUploadDialog(false)}
              disabled={isUploading}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleUpload} 
              disabled={isUploading || uploadFiles.length === 0}
            >
              {isUploading ? `Enviando (${uploadProgress}%)...` : `Adicionar ${uploadFiles.length > 1 ? `${uploadFiles.length} Imagens` : 'Imagem'}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Imagem</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4">
            {currentImage && (
              <div className="mx-auto">
                <img 
                  src={currentImage.image_url} 
                  alt={currentImage.title} 
                  className="w-40 h-40 object-cover rounded-md"
                />
              </div>
            )}
            
            <div className="grid gap-2">
              <Label htmlFor="edit-title">Título da Imagem</Label>
              <Input
                id="edit-title"
                value={imageTitle}
                onChange={(e) => setImageTitle(e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Descrição (opcional)</Label>
              <Textarea
                id="edit-description"
                value={imageDescription}
                onChange={(e) => setImageDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowEditDialog(false)}
              disabled={isUploading}
            >
              Cancelar
            </Button>
            <Button 
              onClick={saveImageChanges} 
              disabled={isUploading}
            >
              {isUploading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <p>Tem certeza que deseja excluir esta imagem? Esta ação não pode ser desfeita.</p>
            
            {imageToDelete && (
              <div className="mt-4 flex items-center gap-4">
                <img 
                  src={imageToDelete.image_url} 
                  alt={imageToDelete.title} 
                  className="w-20 h-20 object-cover rounded-md"
                />
                <div>
                  <p className="font-medium">{imageToDelete.title}</p>
                  {imageToDelete.description && (
                    <p className="text-sm text-gray-500">{imageToDelete.description}</p>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancelar
            </Button>
            <Button 
              variant="destructive"
              onClick={deleteImage}
            >
              Excluir Imagem
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GalleryTab;
