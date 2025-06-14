
import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, GripVertical, Save, X } from 'lucide-react';
import { useCMSHomeSections } from '@/hooks/useCMSHomeSections';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const CMSHomeManager = () => {
  const { sections, loading, error, createSection, updateSection, deleteSection } = useCMSHomeSections();
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    content_html: '',
    bg_color: '#ffffff',
    cta_label: '',
    cta_link: '',
    active: true
  });

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      content_html: '',
      bg_color: '#ffffff',
      cta_label: '',
      cta_link: '',
      active: true
    });
    setEditingSection(null);
    setShowAddForm(false);
  };

  const handleSave = async () => {
    try {
      const slug = formData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const sectionData = {
        ...formData,
        slug,
        order_index: sections.length + 1
      };

      if (editingSection) {
        await updateSection(editingSection, sectionData);
        toast.success('Seção atualizada!');
      } else {
        await createSection(sectionData);
        toast.success('Seção criada!');
      }
      resetForm();
    } catch (err) {
      toast.error('Erro ao salvar seção');
    }
  };

  const handleEdit = (section: any) => {
    setFormData({
      title: section.title,
      subtitle: section.subtitle || '',
      content_html: section.content_html || '',
      bg_color: section.bg_color || '#ffffff',
      cta_label: section.cta_label || '',
      cta_link: section.cta_link || '',
      active: section.active
    });
    setEditingSection(section.id);
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta seção?')) {
      try {
        await deleteSection(id);
        toast.success('Seção excluída!');
      } catch (err) {
        toast.error('Erro ao excluir seção');
      }
    }
  };

  const toggleActive = async (id: string, active: boolean) => {
    try {
      await updateSection(id, { active });
      toast.success(`Seção ${active ? 'ativada' : 'desativada'}!`);
    } catch (err) {
      toast.error('Erro ao alterar status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-600 mb-4">Erro ao carregar seções: {error}</p>
        <Button onClick={() => window.location.reload()}>Tentar novamente</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gerenciar Página Inicial</h2>
          <p className="text-gray-600">Configure as seções da página inicial do site</p>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nova Seção
        </Button>
      </div>

      {/* Formulário de Criação/Edição */}
      {showAddForm && (
        <Card className="border-2 border-primary/20">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-center">
              <CardTitle>{editingSection ? 'Editar Seção' : 'Nova Seção'}</CardTitle>
              <Button variant="ghost" size="sm" onClick={resetForm}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Título *</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Sobre nós"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Subtítulo</label>
                <Input
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="Ex: Conheça nossa história"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Conteúdo HTML</label>
              <Textarea
                value={formData.content_html}
                onChange={(e) => setFormData({ ...formData, content_html: e.target.value })}
                placeholder="<section class='py-20'><div class='container mx-auto px-4'>...</div></section>"
                rows={6}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Cor de Fundo</label>
                <Input
                  type="color"
                  value={formData.bg_color}
                  onChange={(e) => setFormData({ ...formData, bg_color: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Texto do Botão</label>
                <Input
                  value={formData.cta_label}
                  onChange={(e) => setFormData({ ...formData, cta_label: e.target.value })}
                  placeholder="Ex: Saiba mais"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Link do Botão</label>
                <Input
                  value={formData.cta_link}
                  onChange={(e) => setFormData({ ...formData, cta_link: e.target.value })}
                  placeholder="Ex: #contato"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.active}
                onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
              />
              <label className="text-sm font-medium">Seção ativa</label>
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleSave} className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                {editingSection ? 'Atualizar' : 'Criar'} Seção
              </Button>
              <Button variant="outline" onClick={resetForm}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de Seções */}
      <div className="space-y-4">
        {sections.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500 mb-4">Nenhuma seção criada ainda</p>
              <Button onClick={() => setShowAddForm(true)}>Criar primeira seção</Button>
            </CardContent>
          </Card>
        ) : (
          sections.map((section, index) => (
            <Card key={section.id} className={section.active ? '' : 'opacity-60'}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <GripVertical className="w-4 h-4 text-gray-400" />
                    <div>
                      <h3 className="font-semibold flex items-center gap-2">
                        {section.title}
                        {!section.active && <Badge variant="secondary">Inativa</Badge>}
                      </h3>
                      {section.subtitle && (
                        <p className="text-sm text-gray-600">{section.subtitle}</p>
                      )}
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-xs text-gray-500">Ordem: {section.order_index}</span>
                        {section.bg_color !== '#ffffff' && (
                          <div className="flex items-center gap-1">
                            <div 
                              className="w-3 h-3 rounded border"
                              style={{ backgroundColor: section.bg_color }}
                            />
                            <span className="text-xs text-gray-500">{section.bg_color}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleActive(section.id, !section.active)}
                    >
                      {section.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(section)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(section.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {sections.length > 0 && (
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            💡 Dica: As seções são exibidas na ordem indicada. Apenas seções ativas aparecem no site.
          </p>
        </div>
      )}
    </div>
  );
};

export default CMSHomeManager;
