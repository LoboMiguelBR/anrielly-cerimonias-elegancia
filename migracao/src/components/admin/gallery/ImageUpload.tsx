
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from '@/components/ui/progress';
import { Upload, X } from 'lucide-react';
import { toast } from 'sonner';

interface ImageUploadProps {
  open: boolean;
  onClose: () => void;
  onUpload: (files: File[], title: string, description: string | null) => Promise<number>;
}

const ImageUpload = ({ open, onClose, onUpload }: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [imageTitle, setImageTitle] = useState('');
  const [imageDescription, setImageDescription] = useState('');
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

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
      
      const totalFiles = uploadFiles.length;
      
      // Start the upload process
      const successCount = await onUpload(uploadFiles, imageTitle, imageDescription || null);
      
      // Display success or error messages
      if (successCount === 0) {
        toast.error('Não foi possível fazer o upload das imagens');
      } else if (successCount < totalFiles) {
        toast.warning(`Upload parcial: ${successCount} de ${totalFiles} imagens foram adicionadas`);
      } else {
        toast.success(`${totalFiles} ${totalFiles === 1 ? 'imagem adicionada' : 'imagens adicionadas'} com sucesso!`);
      }
      
      // Reset form and close dialog
      resetForm();
      onClose();
      
    } catch (error: any) {
      console.error('Error in handleUpload:', error);
      toast.error(`Erro ao fazer upload: ${error.message}`);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const resetForm = () => {
    setUploadFiles([]);
    setImageTitle('');
    setImageDescription('');
    setPreviewUrls([]);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Update progress based on upload progress
  const updateProgress = (progress: number) => {
    setUploadProgress(progress);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
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
            onClick={handleClose}
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
  );
};

export default ImageUpload;
