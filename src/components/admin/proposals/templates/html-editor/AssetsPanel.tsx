
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { fetchTemplateAssets, uploadTemplateAsset, deleteTemplateAsset } from './templateHtmlService';
import { TemplateAsset } from './types';
import { Upload, Image, File, Trash2, RefreshCw, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface AssetsPanelProps {
  onSelectAsset: (asset: TemplateAsset) => void;
}

const AssetsPanel: React.FC<AssetsPanelProps> = ({ onSelectAsset }) => {
  const [assets, setAssets] = useState<TemplateAsset[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const loadAssets = async () => {
    setIsLoading(true);
    try {
      const fetchedAssets = await fetchTemplateAssets();
      setAssets(fetchedAssets);
    } catch (error) {
      console.error('Error loading assets:', error);
      toast.error('Erro ao carregar imagens');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAssets();
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const file = files[0];
      const asset = await uploadTemplateAsset(file);
      
      if (asset) {
        setAssets(prev => [asset, ...prev]);
        toast.success('Arquivo enviado com sucesso!');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Erro ao enviar arquivo');
    } finally {
      setIsUploading(false);
      // Reset the input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleAssetSelect = (asset: TemplateAsset) => {
    onSelectAsset(asset);
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copiada para a área de transferência');
  };

  const handleDeleteAsset = async (asset: TemplateAsset) => {
    if (window.confirm(`Tem certeza que deseja excluir "${asset.fileName}"?`)) {
      try {
        const success = await deleteTemplateAsset(asset.id, asset.filePath);
        if (success) {
          setAssets(prev => prev.filter(a => a.id !== asset.id));
        }
      } catch (error) {
        console.error('Error deleting asset:', error);
        toast.error('Erro ao excluir arquivo');
      }
    }
  };

  const isImage = (asset: TemplateAsset) => {
    return asset.fileType?.startsWith('image/') || asset.fileName.match(/\.(jpg|jpeg|png|gif|svg)$/i);
  };

  return (
    <div className="assets-panel">
      <div className="mb-4 flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="flex items-center"
        >
          {isUploading ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Enviar Arquivo
            </>
          )}
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={loadAssets}
          disabled={isLoading}
          title="Atualizar lista"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
        
        <Input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          className="hidden"
          accept="image/*,.pdf,.doc,.docx,text/plain"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      ) : assets.length === 0 ? (
        <div className="text-center py-8 text-gray-500 text-sm">
          Nenhum arquivo encontrado
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto">
          {assets.map(asset => (
            <div 
              key={asset.id}
              className="border rounded-md p-2 flex flex-col"
            >
              <div className="flex items-center justify-between mb-1">
                {isImage(asset) ? (
                  <Image className="w-4 h-4 text-blue-500" />
                ) : (
                  <File className="w-4 h-4 text-gray-500" />
                )}
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleCopyUrl(asset.url || '')}
                    title="Copiar URL"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-red-500 hover:text-red-700"
                    onClick={() => handleDeleteAsset(asset)}
                    title="Excluir arquivo"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              
              <div 
                className="text-xs truncate cursor-pointer"
                title={asset.fileName}
                onClick={() => handleAssetSelect(asset)}
              >
                {asset.fileName}
              </div>
              
              {isImage(asset) && asset.url && (
                <div 
                  className="w-full h-12 mt-1 bg-gray-100 flex items-center justify-center overflow-hidden cursor-pointer"
                  onClick={() => handleAssetSelect(asset)}
                >
                  <img 
                    src={asset.url} 
                    alt={asset.fileName}
                    className="max-h-full object-contain" 
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssetsPanel;
