
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Image, UploadCloud } from "lucide-react";
import { useCMSAssets } from "@/hooks/useCMSAssets";

interface CMSImageUploadProps {
  value?: string;
  onChange: (newUrl: string | null) => void;
  label?: string;
  helperText?: string;
}

const CMSImageUpload = ({ value, onChange, label, helperText }: CMSImageUploadProps) => {
  const { uploadAsset, getPublicUrl, uploading } = useCMSAssets();
  const fileInput = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const ok = await uploadAsset(file);
    if (ok) {
      // Ao salvar, recupera url pública do arquivo
      const fakePath = `cms/${file.name}`;
      // Para garantir, re-buscamos o asset mais recente
      onChange(""); // Limpa enquanto busca
      setTimeout(() => {
        const url = getPublicUrl(`cms/${file.name}`);
        onChange(url);
      }, 1500);
    }
  };

  const handlePick = () => fileInput.current?.click();
  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium">{label}</label>}
      <div className="flex gap-3 items-center">
        <Button 
          onClick={handlePick}
          variant="outline"
          type="button"
          size="sm"
          disabled={uploading}
        >
          <UploadCloud className="w-4 h-4 mr-1" />
          {uploading ? "Enviando..." : "Enviar Imagem"}
        </Button>
        <input type="file" accept="image/*" className="hidden" ref={fileInput} onChange={handleFile} />
        {value && (
          <div className="w-24 h-16 rounded overflow-hidden border">
            <img src={value} alt="Preview" className="object-cover w-full h-full" />
          </div>
        )}
      </div>
      {helperText && <p className="text-xs text-gray-500">{helperText}</p>}
    </div>
  );
};

export default CMSImageUpload;
