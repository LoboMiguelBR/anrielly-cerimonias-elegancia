
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Layout, Eye, Edit, Trash2 } from 'lucide-react';
import { useWebsiteSections, WebsiteSection } from '@/hooks/useWebsiteSections';
import { useWebsitePages } from '@/hooks/useWebsitePages';

type SectionType = 'hero' | 'about' | 'services' | 'gallery' | 'testimonials' | 'contact' | 'custom';

interface FormData {
  title: string;
  page_id: string;
  section_type: SectionType;
  content: any;
  is_active: boolean;
  order_index: number;
}

const SectionsManagerEnhanced = () => {
  const { sections, isLoading, createSection, updateSection, deleteSection, toggleSectionActive } = useWebsiteSections();
  const { pages } = useWebsitePages();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<WebsiteSection | null>(null);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    page_id: '',
    section_type: 'custom',
    content: {},
    is_active: true,
    order_index: 0
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSection) {
        await updateSection(editingSection.id, formData);
        setEditingSection(null);
      } else {
        await createSection(formData);
        setIsCreateDialogOpen(false);
      }
      resetForm();
    } catch (error) {
      console.error('Error saving section:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      page_id: '',
      section_type: 'custom',
      content: {},
      is_active: true,
      order_index: 0
    });
  };

  const handleEdit = (section: WebsiteSection) => {
    setFormData({
      title: section.title || '',
      page_id: section.page_id || '',
      section_type: section.section_type,
      content: section.content,
      is_active: section.is_active,
      order_index: section.order_index
    });
    setEditingSection(section);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta seção?')) {
      await deleteSection(id);
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    await toggleSectionActive(id, isActive);
  };

  const getSectionTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      hero: 'Banner Principal',
      about: 'Sobre',
      services: 'Serviços',
      gallery: 'Galeria',
      testimonials: 'Depoimentos',
      contact: 'Contato',
      custom: 'Personalizada'
    };
    return types[type] || type;
  };

  const getPageTitle = (pageId: string) => {
    const page = pages.find(p => p.id === pageId);
    return page ? page.title : 'Página não especificada';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando seções...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Gerenciar Seções</h3>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nova Seção
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Criar Nova Seção</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="section_type">Tipo de Seção</Label>
                  <Select 
                    value={formData.section_type} 
                    onValueChange={(value: SectionType) => 
                      setFormData(prev => ({ ...prev, section_type: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hero">Banner Principal</SelectItem>
                      <SelectItem value="about">Sobre</SelectItem>
                      <SelectItem value="services">Serviços</SelectItem>
                      <SelectItem value="gallery">Galeria</SelectItem>
                      <SelectItem value="testimonials">Depoimentos</SelectItem>
                      <SelectItem value="contact">Contato</SelectItem>
                      <SelectItem value="custom">Personalizada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="page_id">Página</Label>
                <Select 
                  value={formData.page_id} 
                  onValueChange={(value) => 
                    setFormData(prev => ({ ...prev, page_id: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma página" />
                  </SelectTrigger>
                  <SelectContent>
                    {pages.map(page => (
                      <SelectItem key={page.id} value={page.id}>
                        {page.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, is_active: checked }))
                  }
                />
                <Label htmlFor="is_active">Seção ativa</Label>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Criar Seção</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {sections.map((section) => (
          <Card key={section.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Layout className="h-5 w-5 text-gray-400" />
                  <div>
                    <h4 className="font-medium">{section.title}</h4>
                    <p className="text-sm text-gray-500">
                      {getSectionTypeLabel(section.section_type)} • {getPageTitle(section.page_id || '')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Switch
                    checked={section.is_active}
                    onCheckedChange={(checked) => handleToggleActive(section.id, checked)}
                  />
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    section.is_active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {section.is_active ? 'Ativa' : 'Inativa'}
                  </span>
                  
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-8 w-8 p-0"
                      onClick={() => handleEdit(section)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-8 w-8 p-0 text-red-600"
                      onClick={() => handleDelete(section.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {sections.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Nenhuma seção criada ainda.
          </div>
        )}
      </div>

      {/* Dialog de Edição */}
      <Dialog open={!!editingSection} onOpenChange={() => setEditingSection(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Seção</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-title">Título</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-section_type">Tipo de Seção</Label>
                <Select 
                  value={formData.section_type} 
                  onValueChange={(value: SectionType) => 
                    setFormData(prev => ({ ...prev, section_type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hero">Banner Principal</SelectItem>
                    <SelectItem value="about">Sobre</SelectItem>
                    <SelectItem value="services">Serviços</SelectItem>
                    <SelectItem value="gallery">Galeria</SelectItem>
                    <SelectItem value="testimonials">Depoimentos</SelectItem>
                    <SelectItem value="contact">Contato</SelectItem>
                    <SelectItem value="custom">Personalizada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="edit-page_id">Página</Label>
              <Select 
                value={formData.page_id} 
                onValueChange={(value) => 
                  setFormData(prev => ({ ...prev, page_id: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma página" />
                </SelectTrigger>
                <SelectContent>
                  {pages.map(page => (
                    <SelectItem key={page.id} value={page.id}>
                      {page.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="edit-is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, is_active: checked }))
                }
              />
              <Label htmlFor="edit-is_active">Seção ativa</Label>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setEditingSection(null)}>
                Cancelar
              </Button>
              <Button type="submit">Salvar Alterações</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SectionsManagerEnhanced;
