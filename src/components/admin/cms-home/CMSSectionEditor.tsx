import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Trash2, Save, Eye, EyeOff } from "lucide-react";
import { CMSHomeSection } from '@/hooks/useCMSHomeSections';
import CMSImageUpload from "./CMSImageUpload";

interface CMSSectionEditorProps {
  section?: CMSHomeSection;
  onSave: (section: Omit<CMSHomeSection, 'id' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
  onDelete?: (id: string) => void;
  isCreating?: boolean;
}

const CMSSectionEditor = ({ section, onSave, onCancel, onDelete, isCreating }: CMSSectionEditorProps) => {
  const [formData, setFormData] = useState<Omit<CMSHomeSection, 'id' | 'created_at' | 'updated_at'>>(
    section ? {
      slug: section.slug,
      title: section.title,
      subtitle: section.subtitle || '',
      content_html: section.content_html || '',
      bg_color: section.bg_color || '#ffffff',
      cta_label: section.cta_label || '',
      cta_link: section.cta_link || '',
      order_index: section.order_index,
      active: section.active,
      background_image: section.background_image || "",
    } : {
      slug: '',
      title: '',
      subtitle: '',
      content_html: '',
      bg_color: '#ffffff',
      cta_label: '',
      cta_link: '',
      order_index: 0,
      active: true,
      background_image: "",
    }
  );
  const [previewMode, setPreviewMode] = useState(false);

  const handleSave = () => {
    if (!formData.title || !formData.slug) {
      toast.error('Título e slug são obrigatórios');
      return;
    }

    onSave(formData);
  };

  const handleDelete = () => {
    if (section?.id && onDelete) {
      onDelete(section.id);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">
          {isCreating ? 'Nova Seção' : `Editar Seção: ${section?.title}`}
        </CardTitle>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPreviewMode(!previewMode)}
          >
            {previewMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {previewMode ? 'Editar' : 'Preview'}
          </Button>
          {section && !isCreating && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={onCancel}>
            Cancelar
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {!previewMode ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Informações Básicas */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Título da Seção</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Sobre Nós"
                />
              </div>

              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="Ex: sobre-nos"
                />
              </div>

              <div>
                <Label htmlFor="subtitle">Subtítulo</Label>
                <Input
                  id="subtitle"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="Subtítulo opcional"
                />
              </div>

              <div>
                <Label htmlFor="bg_color">Cor de Fundo</Label>
                <Input
                  id="bg_color"
                  type="color"
                  value={formData.bg_color}
                  onChange={(e) => setFormData({ ...formData, bg_color: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="order_index">Ordem</Label>
                <Input
                  id="order_index"
                  type="number"
                  value={formData.order_index}
                  onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={formData.active}
                  onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                />
                <Label htmlFor="active">Seção Ativa</Label>
              </div>

              {/* ============ NOVO: Upload e seleção de imagem de fundo ============= */}
              <CMSImageUpload
                value={formData.background_image}
                onChange={(url) => setFormData({ ...formData, background_image: url || "" })}
                label="Imagem de Fundo"
                helperText="Opcional. Upload ou URL de imagem."
              />
            </div>

            {/* Conteúdo */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="content_html">Conteúdo HTML</Label>
                <Textarea
                  id="content_html"
                  value={formData.content_html}
                  onChange={(e) => setFormData({ ...formData, content_html: e.target.value })}
                  placeholder="Digite o HTML da seção..."
                  rows={10}
                />
              </div>

              <div>
                <Label htmlFor="cta_label">Texto do Botão</Label>
                <Input
                  id="cta_label"
                  value={formData.cta_label}
                  onChange={(e) => setFormData({ ...formData, cta_label: e.target.value })}
                  placeholder="Ex: Saiba Mais"
                />
              </div>

              <div>
                <Label htmlFor="cta_link">Link do Botão</Label>
                <Input
                  id="cta_link"
                  value={formData.cta_link}
                  onChange={(e) => setFormData({ ...formData, cta_link: e.target.value })}
                  placeholder="Ex: /contato"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="border rounded-lg p-4 bg-gray-50" 
            style={{
              backgroundColor: formData.bg_color, 
              backgroundImage: formData.background_image 
                ? `url(${formData.background_image})` 
                : undefined,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center"
            }}>
            <h3 className="text-lg font-semibold mb-2">{formData.title}</h3>
            {formData.subtitle && (
              <p className="text-gray-600 mb-4">{formData.subtitle}</p>
            )}
            <div 
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: formData.content_html }}
            />
            {formData.cta_label && (
              <Button className="mt-4">
                {formData.cta_label}
              </Button>
            )}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-4">
          <Button onClick={handleSave} className="min-w-24">
            <Save className="w-4 h-4 mr-2" />
            Salvar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CMSSectionEditor;
