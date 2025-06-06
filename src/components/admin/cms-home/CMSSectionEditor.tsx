
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save } from 'lucide-react';
import { CMSHomeSection } from '@/hooks/useCMSHomeSections';

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

  const loadTemplate = (templateType: string) => {
    const templates = {
      hero: `<div class="text-center py-20 bg-gradient-to-br from-purple-50 to-pink-50">
  <h1 class="text-5xl font-serif text-primary mb-4">{{title}}</h1>
  <p class="text-xl text-gray-600 mb-8">{{subtitle}}</p>
  <div class="space-x-4">
    <a href="{{cta_link}}" class="bg-primary text-white px-8 py-3 rounded-lg hover:bg-opacity-90 transition-colors">{{cta_label}}</a>
  </div>
</div>`,
      section: `<section class="py-20 bg-white">
  <div class="container mx-auto px-4">
    <div class="max-w-4xl mx-auto text-center">
      <h2 class="text-4xl font-serif text-primary mb-6">{{title}}</h2>
      <p class="text-lg text-gray-600 leading-relaxed">{{subtitle}}</p>
    </div>
  </div>
</section>`,
      cards: `<section class="py-20 bg-gray-50">
  <div class="container mx-auto px-4">
    <div class="text-center mb-12">
      <h2 class="text-4xl font-serif text-primary mb-4">{{title}}</h2>
      <p class="text-xl text-gray-600">{{subtitle}}</p>
    </div>
    <div class="grid md:grid-cols-3 gap-8">
      <div class="bg-white p-6 rounded-lg shadow-lg">
        <h3 class="text-xl font-semibold mb-4">Card 1</h3>
        <p class="text-gray-600">Descrição do primeiro card.</p>
      </div>
      <div class="bg-white p-6 rounded-lg shadow-lg">
        <h3 class="text-xl font-semibold mb-4">Card 2</h3>
        <p class="text-gray-600">Descrição do segundo card.</p>
      </div>
      <div class="bg-white p-6 rounded-lg shadow-lg">
        <h3 class="text-xl font-semibold mb-4">Card 3</h3>
        <p class="text-gray-600">Descrição do terceiro card.</p>
      </div>
    </div>
  </div>
</section>`
    };

    handleChange('content_html', templates[templateType as keyof typeof templates] || '');
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
            <CardTitle>Conteúdo HTML</CardTitle>
            <div className="flex gap-2">
              <Button type="button" size="sm" onClick={() => loadTemplate('hero')}>
                Template Hero
              </Button>
              <Button type="button" size="sm" onClick={() => loadTemplate('section')}>
                Template Seção
              </Button>
              <Button type="button" size="sm" onClick={() => loadTemplate('cards')}>
                Template Cards
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="content_html">HTML Personalizado</Label>
              <Textarea
                id="content_html"
                value={formData.content_html}
                onChange={(e) => handleChange('content_html', e.target.value)}
                placeholder="HTML da seção. Use {{title}}, {{subtitle}}, {{cta_label}}, {{cta_link}} como variáveis."
                className="min-h-96 font-mono text-sm"
              />
              <p className="text-xs text-gray-500">
                Variáveis disponíveis: {`{{title}}, {{subtitle}}, {{cta_label}}, {{cta_link}}`}
              </p>
            </div>
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
