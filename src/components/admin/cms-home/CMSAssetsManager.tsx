
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Upload, Search, Trash2, Copy, Image as ImageIcon } from 'lucide-react';
import { useCMSAssets, CMSAsset } from '@/hooks/useCMSAssets';
import { toast } from 'sonner';

interface CMSAssetsManagerProps {
  onSelectAsset?: (asset: CMSAsset) => void;
  selectionMode?: boolean;
}

const CMSAssetsManager: React.FC<CMSAssetsManagerProps> = ({ 
  onSelectAsset, 
  selectionMode = false 
}) => {
  const { assets, loading, uploading, uploadAsset, deleteAsset, getAssetUrl } = useCMSAssets();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState({
    title: '',
    alt_text: '',
    description: '',
    tags: ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredAssets = assets.filter(asset =>
    asset.file_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.alt_text?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setMetadata({
        title: file.name,
        alt_text: '',
        description: '',
        tags: ''
      });
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      const tags = metadata.tags.split(',').map(tag => tag.trim()).filter(Boolean);
      await uploadAsset(selectedFile, {
        title: metadata.title,
        alt_text: metadata.alt_text,
        description: metadata.description,
        tags
      });
      
      setSelectedFile(null);
      setMetadata({ title: '', alt_text: '', description: '', tags: '' });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error uploading:', error);
    }
  };

  const handleCopyUrl = (asset: CMSAsset) => {
    const url = getAssetUrl(asset.file_path);
    navigator.clipboard.writeText(url);
    toast.success('URL copiada para a área de transferência!');
  };

  const handleAssetClick = (asset: CMSAsset) => {
    if (selectionMode && onSelectAsset) {
      onSelectAsset(asset);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      {!selectionMode && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Enviar Nova Imagem
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="file-upload">Arquivo</Label>
              <Input
                ref={fileInputRef}
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="mt-1"
              />
            </div>
            
            {selectedFile && (
              <>
                <div>
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={metadata.title}
                    onChange={(e) => setMetadata({ ...metadata, title: e.target.value })}
                    placeholder="Título da imagem"
                  />
                </div>
                
                <div>
                  <Label htmlFor="alt_text">Texto Alternativo</Label>
                  <Input
                    id="alt_text"
                    value={metadata.alt_text}
                    onChange={(e) => setMetadata({ ...metadata, alt_text: e.target.value })}
                    placeholder="Descrição para acessibilidade"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={metadata.description}
                    onChange={(e) => setMetadata({ ...metadata, description: e.target.value })}
                    placeholder="Descrição detalhada da imagem"
                  />
                </div>
                
                <div>
                  <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
                  <Input
                    id="tags"
                    value={metadata.tags}
                    onChange={(e) => setMetadata({ ...metadata, tags: e.target.value })}
                    placeholder="hero, banner, casamento, festa"
                  />
                </div>
                
                <Button onClick={handleUpload} disabled={uploading} className="w-full">
                  {uploading ? 'Enviando...' : 'Enviar Imagem'}
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar imagens..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Assets Grid */}
      {loading ? (
        <div className="text-center py-8">
          <p>Carregando assets...</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredAssets.map((asset) => (
            <Card 
              key={asset.id} 
              className={`cursor-pointer hover:shadow-lg transition-shadow ${
                selectionMode ? 'hover:border-blue-500' : ''
              }`}
              onClick={() => handleAssetClick(asset)}
            >
              <CardContent className="p-3">
                <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden">
                  <img
                    src={getAssetUrl(asset.file_path)}
                    alt={asset.alt_text || asset.title || asset.file_name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      img.style.display = 'none';
                      const placeholder = img.parentElement?.querySelector('.placeholder');
                      if (placeholder) {
                        (placeholder as HTMLElement).style.display = 'flex';
                      }
                    }}
                  />
                  <div className="placeholder hidden w-full h-full items-center justify-center">
                    <ImageIcon className="h-8 w-8 text-gray-400" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-sm truncate" title={asset.title || asset.file_name}>
                    {asset.title || asset.file_name}
                  </h4>
                  
                  <p className="text-xs text-gray-500">
                    {formatFileSize(asset.file_size)}
                  </p>
                  
                  {asset.tags && asset.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {asset.tags.slice(0, 2).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {asset.tags.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{asset.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  )}
                  
                  {!selectionMode && (
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyUrl(asset);
                        }}
                        className="flex-1"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteAsset(asset);
                        }}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredAssets.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">
          {searchTerm ? 'Nenhum asset encontrado para sua busca.' : 'Nenhum asset enviado ainda.'}
        </div>
      )}
    </div>
  );
};

export default CMSAssetsManager;
