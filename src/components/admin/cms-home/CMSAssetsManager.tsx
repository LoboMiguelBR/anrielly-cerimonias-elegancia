import React, { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogContent,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  useCMSAssets,
  CMSAsset,
} from "@/hooks/useCMSAssets";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Copy, CheckCircle, AlertCircle } from "lucide-react";

const CMSAssetsManager = () => {
  const { assets, loading, fetchAssets, deleteAsset } = useCMSAssets();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  const filteredAssets = assets.filter((asset) =>
    asset.file_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleAssetSelection = (assetId: string) => {
    if (selectedAssets.includes(assetId)) {
      setSelectedAssets(selectedAssets.filter((id) => id !== assetId));
    } else {
      setSelectedAssets([...selectedAssets, assetId]);
    }
  };

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setSelectedAssets(filteredAssets.map((asset) => asset.id));
    } else {
      setSelectedAssets([]);
    }
  };

  const copyUrlsToClipboard = () => {
    const urls = filteredAssets
      .filter((asset) => selectedAssets.includes(asset.id))
      .map((asset) => asset.file_path); // Ajuste aqui para usar file_path
    const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL; // Certifique-se de ter essa variável de ambiente
    const bucketName = "cms-assets"; // Nome do seu bucket
    const fullUrls = urls.map(
      (path) => `${baseUrl}/storage/v1/object/public/${bucketName}/${path}`
    );

    navigator.clipboard
      .writeText(fullUrls.join("\n"))
      .then(() => {
        setCopySuccess(true);
        toast.success("URLs copiadas para a área de transferência!");
        setTimeout(() => setCopySuccess(false), 3000); // Resetar o estado após 3 segundos
      })
      .catch((err) => {
        toast.error("Falha ao copiar URLs: " + err);
      });
  };

  const handleDelete = async (asset: CMSAsset) => {
    if (
      window.confirm(
        `Tem certeza que deseja remover o asset "${asset.file_name}"?`
      )
    ) {
      await deleteAsset(asset.id, asset.file_path);
    }
  };

  if (loading) {
    return <div>Carregando assets...</div>;
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <Input
          type="text"
          placeholder="Buscar asset..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button onClick={fetchAssets}>Atualizar Assets</Button>
      </div>

      <Table>
        <TableCaption>Lista de assets do CMS.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox
                checked={selectAll}
                onCheckedChange={toggleSelectAll}
              />
            </TableHead>
            <TableHead>Nome do Arquivo</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Tamanho</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAssets.map((asset) => (
            <TableRow key={asset.id}>
              <TableCell className="w-[50px]">
                <Checkbox
                  checked={selectedAssets.includes(asset.id)}
                  onCheckedChange={() => toggleAssetSelection(asset.id)}
                />
              </TableCell>
              <TableCell>{asset.file_name}</TableCell>
              <TableCell>{asset.file_type}</TableCell>
              <TableCell>{(asset.file_size / 1024).toFixed(2)} KB</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <a
                    href={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/cms-assets/${asset.file_path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Ver
                  </a>
                  <button
                    onClick={() => handleDelete(asset)}
                    className="text-red-500 hover:underline"
                  >
                    Excluir
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-4 flex items-center justify-between">
        <Button
          onClick={copyUrlsToClipboard}
          disabled={selectedAssets.length === 0}
        >
          {copySuccess ? (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Copiado!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-2" />
              Copiar URLs Selecionadas
            </>
          )}
        </Button>
        <span>Total de assets: {assets.length}</span>
      </div>
    </div>
  );
};

export default CMSAssetsManager;
