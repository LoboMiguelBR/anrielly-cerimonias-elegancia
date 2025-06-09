
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface CMSAsset {
  id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  alt_text?: string;
  title?: string;
  description?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

export const useCMSAssets = () => {
  const [assets, setAssets] = useState<CMSAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('cms_assets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAssets(data || []);
    } catch (err) {
      console.error('Error fetching assets:', err);
      toast.error('Erro ao carregar assets');
    } finally {
      setLoading(false);
    }
  };

  const uploadAsset = async (file: File, metadata?: { alt_text?: string; title?: string; description?: string; tags?: string[] }) => {
    try {
      setUploading(true);
      
      // Upload do arquivo para o storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `cms/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('cms-assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Salvar metadados na tabela
      const { error: insertError } = await supabase
        .from('cms_assets')
        .insert([{
          file_name: file.name,
          file_path: filePath,
          file_size: file.size,
          file_type: file.type,
          alt_text: metadata?.alt_text || '',
          title: metadata?.title || file.name,
          description: metadata?.description || '',
          tags: metadata?.tags || []
        }]);

      if (insertError) throw insertError;

      toast.success('Asset enviado com sucesso!');
      await fetchAssets();
    } catch (err) {
      console.error('Error uploading asset:', err);
      toast.error('Erro ao enviar asset');
      throw err;
    } finally {
      setUploading(false);
    }
  };

  const deleteAsset = async (asset: CMSAsset) => {
    try {
      // Deletar do storage
      const { error: storageError } = await supabase.storage
        .from('cms-assets')
        .remove([asset.file_path]);

      if (storageError) throw storageError;

      // Deletar da tabela
      const { error: dbError } = await supabase
        .from('cms_assets')
        .delete()
        .eq('id', asset.id);

      if (dbError) throw dbError;

      toast.success('Asset deletado com sucesso!');
      await fetchAssets();
    } catch (err) {
      console.error('Error deleting asset:', err);
      toast.error('Erro ao deletar asset');
    }
  };

  const getAssetUrl = (filePath: string) => {
    const { data } = supabase.storage
      .from('cms-assets')
      .getPublicUrl(filePath);
    return data.publicUrl;
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  return {
    assets,
    loading,
    uploading,
    uploadAsset,
    deleteAsset,
    getAssetUrl,
    fetchAssets
  };
};
