
import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { GalleryImage } from '@/hooks/useGalleryAdmin';

interface GalleryUploadProps {
  onUpload: (file: File, title: string, description?: string) => Promise<GalleryImage>;
  isUploading?: boolean;
}

const GalleryUpload = ({ onUpload, isUploading = false }: GalleryUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setTitle(file.name.split('.')[0]); // Nome sem extensão como título padrão
      
      // Criar preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !title.trim()) return;

    try {
      await onUpload(selectedFile, title.trim(), description.trim() || undefined);
      
      // Reset form
      setSelectedFile(null);
      setTitle('');
      setDescription('');
      setPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      // Error is handled in the hook
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setTitle('');
    setDescription('');
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="file-upload" className="text-base font-medium">
              Upload de Nova Imagem
            </Label>
            <p className="text-sm text-gray-600 mb-3">
              Selecione uma imagem para adicionar à galeria
            </p>
          </div>

          {!selectedFile ? (
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-rose-400 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Clique para selecionar uma imagem</p>
              <p className="text-sm text-gray-500">PNG, JPG, JPEG até 5MB</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={preview || ''}
                  alt="Preview"
                  className="w-full max-w-md h-48 object-cover rounded-lg mx-auto"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearSelection}
                  className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="image-title">Título *</Label>
                  <Input
                    id="image-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Título da imagem"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image-description">Descrição</Label>
                  <Textarea
                    id="image-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descrição opcional da imagem"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={clearSelection}>
                  Cancelar
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={!title.trim() || isUploading}
                  className="bg-rose-500 hover:bg-rose-600 text-white"
                >
                  {isUploading ? (
                    <>
                      <Upload className="w-4 h-4 mr-2 animate-spin" />
                      Fazendo Upload...
                    </>
                  ) : (
                    <>
                      <ImageIcon className="w-4 h-4 mr-2" />
                      Adicionar à Galeria
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GalleryUpload;
