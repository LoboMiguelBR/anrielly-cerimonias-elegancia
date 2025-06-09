
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Save, Image, Code, Eye } from 'lucide-react';
import { CMSHomeSection } from '@/hooks/useCMSHomeSections';
import CMSAssetsManager from './CMSAssetsManager';
import CMSVisualTemplates from './CMSVisualTemplates';
import { CMSAsset } from '@/hooks/useCMSAssets';

interface CMSSectionEditorProps {
  section: CMSHomeSection | null;
  onSave: (sectionData: Omit<CMSHomeSection, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onCancel: () => void;
  isCreating: boolean;
}

const CMSSectionEditor: React.FC<CMSSectionEditorProps> = ({
  section,
  onSave,
  onCancel,
  isCreating
}) => {
  const [activeTab, setActiveTab] = useState('content');
  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    subtitle: '',
    content_html: '',
    bg_color: '#ffffff',
    cta_label: '',
    cta_link: '',
    order_index: 1,
    active: true
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (section) {
      setFormData({
        slug: section.slug,
        title: section.title,
        subtitle: section.subtitle || '',
        content_html: section.content_html || '',
        bg_color: section.bg_color || '#ffffff',
        cta_label: section.cta_label || '',
        cta_link: section.cta_link || '',
        order_index: section.order_index,
        active: section.active
      });
    }
  }, [section]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      await onSave(formData);
    } catch (error) {
      console.error('Error saving section:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAssetSelect = (asset: CMSAsset) => {
    const assetUrl = `https://oampddkpuybkbwqggrty.supabase.co/storage/v1/object/public/cms-assets/${asset.file_path}`;
    const imageTag = `<img src="${assetUrl}" alt="${asset.alt_text || asset.title}" class="w-full h-auto" />`;
    
    // Inserir a imagem no HTML
    const textarea = document.getElementById('content_html') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      const before = text.substring(0, start);
      const after = text.substring(end, text.length);
      const newText = before + imageTag + after;
      
      handleChange('content_html', newText);
      
      // Voltar para a aba de conteúdo
      setActiveTab('content');
    }
  };

  const handleTemplateSelect = (html: string) => {
    handleChange('content_html', html);
    setActiveTab('content');
  };

  const processContentVariables = (content: string) => {
    return content
      .replace(/\{\{title\}\}/g, formData.title || 'Título da Seção')
      .replace(/\{\{subtitle\}\}/g, formData.subtitle || 'Subtítulo da seção')
      .replace(/\{\{cta_label\}\}/g, formData.cta_label || 'Botão')
      .replace(/\{\{cta_link\}\}/g, formData.cta_link || '#')
      .replace(/\{\{background_image\}\}/g, 'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')
      .replace(/\{\{image_url\}\}/g, 'https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')
      .replace(/\{\{image_alt\}\}/g, 'Imagem ilustrativa')
      .replace(/\{\{content_text\}\}/g, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.')
      .replace(/\{\{(image_\d+)\}\}/g, 'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80')
      .replace(/\{\{(alt_\d+)\}\}/g, 'Imagem da galeria')
      .replace(/\{\{(service_image_\d+)\}\}/g, 'https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80')
      .replace(/\{\{(service_alt_\d+)\}\}/g, 'Serviço')
      .replace(/\{\{(service_title_\d+)\}\}/g, 'Nome do Serviço')
      .replace(/\{\{(service_description_\d+)\}\}/g, 'Descrição do serviço oferecido.')
      .replace(/\{\{client_photo\}\}/g, 'https://images.unsplash.com/photo-1494790108755-2616b612b5bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80')
      .replace(/\{\{client_name\}\}/g, 'Nome do Cliente')
      .replace(/\{\{client_role\}\}/g, 'Cargo ou Descrição')
      .replace(/\{\{testimonial_text\}\}/g, 'Depoimento incrível sobre o serviço prestado. Foi uma experiência maravilhosa e superou todas as expectativas.');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onCancel}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <h2 className="text-2xl font-bold">
          {isCreating ? 'Nova Seção' : `Editar: ${section?.title}`}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="slug">Slug (identificador único)</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => handleChange('slug', e.target.value)}
                  placeholder="ex: hero, sobre, servicos"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtítulo</Label>
                <Input
                  id="subtitle"
                  value={formData.subtitle}
                  onChange={(e) => handleChange('subtitle', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bg_color">Cor de Fundo</Label>
                <Input
                  id="bg_color"
                  type="color"
                  value={formData.bg_color}
                  onChange={(e) => handleChange('bg_color', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="order_index">Ordem</Label>
                <Input
                  id="order_index"
                  type="number"
                  value={formData.order_index}
                  onChange={(e) => handleChange('order_index', parseInt(e.target.value))}
                  min="1"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={formData.active}
                  onCheckedChange={(checked) => handleChange('active', checked)}
                />
                <Label htmlFor="active">Seção ativa</Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Call to Action</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cta_label">Texto do Botão</Label>
                <Input
                  id="cta_label"
                  value={formData.cta_label}
                  onChange={(e) => handleChange('cta_label', e.target.value)}
                  placeholder="ex: Solicitar Orçamento"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cta_link">Link do Botão</Label>
                <Input
                  id="cta_link"
                  value={formData.cta_link}
                  onChange={(e) => handleChange('cta_link', e.target.value)}
                  placeholder="ex: #contato, /orcamento"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Editor Visual</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="content" className="flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  HTML
                </TabsTrigger>
                <TabsTrigger value="templates" className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Templates
                </TabsTrigger>
                <TabsTrigger value="assets" className="flex items-center gap-2">
                  <Image className="h-4 w-4" />
                  Imagens
                </TabsTrigger>
                <TabsTrigger value="preview" className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Preview
                </TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="content_html">HTML da Seção</Label>
                  <Textarea
                    id="content_html"
                    value={formData.content_html}
                    onChange={(e) => handleChange('content_html', e.target.value)}
                    placeholder="HTML da seção. Use {{title}}, {{subtitle}}, {{cta_label}}, {{cta_link}} como variáveis."
                    className="min-h-96 font-mono text-sm"
                  />
                  <div className="text-xs text-gray-500 space-y-1">
                    <p><strong>Variáveis disponíveis:</strong></p>
                    <p>• Básicas: {{`{title}, {subtitle}, {cta_label}, {cta_link}`}}</p>
                    <p>• Imagens: {{`{background_image}, {image_url}, {image_1}, {image_2}...`}}</p>
                    <p>• Serviços: {{`{service_image_1}, {service_title_1}, {service_description_1}...`}}</p>
                    <p>• Depoimentos: {{`{client_photo}, {client_name}, {testimonial_text}...`}}</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="templates" className="space-y-4">
                <CMSVisualTemplates onSelectTemplate={handleTemplateSelect} />
              </TabsContent>

              <TabsContent value="assets" className="space-y-4">
                <CMSAssetsManager 
                  onSelectAsset={handleAssetSelect}
                  selectionMode={true}
                />
              </TabsContent>

              <TabsContent value="preview" className="space-y-4">
                <div className="border rounded-lg p-4 bg-white min-h-96">
                  <div 
                    dangerouslySetInnerHTML={{ 
                      __html: processContentVariables(formData.content_html)
                    }}
                    style={{ backgroundColor: formData.bg_color }}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Salvando...' : 'Salvar Seção'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CMSSectionEditor;
