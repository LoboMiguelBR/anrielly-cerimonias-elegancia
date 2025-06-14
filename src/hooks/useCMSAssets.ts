
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
    setLoading(true);
    const { data, error } = await supabase
      .from("cms_assets")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast.error("Erro ao buscar assets");
    }
    setAssets(data || []);
    setLoading(false);
  };

  const uploadAsset = async (file: File, metadata?: Partial<CMSAsset>) => {
    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 6)}.${fileExt}`;
    const filePath = `cms/${fileName}`;
    const { error: uploadError } = await supabase.storage
      .from("cms-assets")
      .upload(filePath, file);

    if (uploadError) {
      toast.error("Erro ao enviar imagem.");
      setUploading(false);
      return false;
    }

    const { error: insertError } = await supabase
      .from("cms_assets")
      .insert([{
        file_name: file.name,
        file_path: filePath,
        file_size: file.size,
        file_type: file.type,
        ...metadata
      }]);

    if (insertError) {
      toast.error("Erro ao salvar metadados.");
      setUploading(false);
      return false;
    }

    toast.success("Imagem enviada!");
    await fetchAssets();
    setUploading(false);
    return true;
  };

  const getPublicUrl = (filePath: string) => {
    const { data } = supabase.storage.from("cms-assets").getPublicUrl(filePath);
    return data.publicUrl;
  };

  useEffect(() => { fetchAssets(); }, []);
  return { assets, loading, uploading, uploadAsset, getPublicUrl, fetchAssets };
};
