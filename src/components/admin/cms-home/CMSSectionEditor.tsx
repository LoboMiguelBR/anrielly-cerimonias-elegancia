import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Trash2, Save, Eye, EyeOff } from "lucide-react";

// Interfaces e tipos
interface CMSSection {
  id?: string;
  title: string;
  slug: string;
  subtitle?: string;
  content_html: string;
  cta_label?: string;
  cta_link?: string;
  bg_color: string;
  order_index: number;
  active: boolean;
}

interface CMSSectionEditorProps {
  section?: CMSSection;
  onSave: (section: CMSSection) => void;
  onDelete?: (id: string) => void;
}

const CMSSectionEditor = ({ section, onSave, onDelete }: CMSSectionEditorProps) => {
  const [formData, setFormData] = useState<CMSSection>(
    section || {
      title: '',
      slug: '',
      subtitle: '',
      content_html: '',
      cta_label: '',
      cta_link: '',
      bg_color: '#f0f0f0',
      order_index: 0,
      active: true,
    }
  );
  const [previewMode, setPreviewMode] = useState(false);

  const handleSave = () => {
    onSave(formData);
    toast.success('Seção salva com sucesso!');
  };

  const handleDelete = () => {
    if (section?.id && onDelete) {
      onDelete(section.id);
      toast.success('Seção removida com sucesso!');
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">
          {section ? `Editar Seção: ${section.title}` : 'Nova Seção'}
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
          {section && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
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
          <div className="border rounded-lg p-4 bg-gray-50">
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
