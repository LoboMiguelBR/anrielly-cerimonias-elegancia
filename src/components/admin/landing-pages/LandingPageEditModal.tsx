
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useLandingPageActions } from '@/hooks/useLandingPageActions';
import { LandingPageTemplate } from '@/hooks/useLandingPageData';

interface LandingPageEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  template: LandingPageTemplate | null;
}

const LandingPageEditModal = ({ open, onOpenChange, onSuccess, template }: LandingPageEditModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    isActive: false,
    sections: {
      hero: {
        title: '',
        subtitle: '',
        background_image: '',
        cta_primary: '',
        cta_secondary: '',
        whatsapp_link: ''
      },
      about: {
        title: '',
        content: '',
        image: ''
      }
    }
  });

  const { updateTemplate, loading } = useLandingPageActions();

  useEffect(() => {
    if (template) {
      setFormData({
        name: template.name,
        slug: template.slug,
        isActive: template.is_active,
        sections: template.sections || {
          hero: {
            title: '',
            subtitle: '',
            background_image: '',
            cta_primary: '',
            cta_secondary: '',
            whatsapp_link: ''
          },
          about: {
            title: '',
            content: '',
            image: ''
          }
        }
      });
    }
  }, [template]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!template) return;

    const success = await updateTemplate(template.id, {
      name: formData.name,
      slug: formData.slug,
      is_active: formData.isActive,
      sections: formData.sections
    });

    if (success) {
      onSuccess();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Landing Page</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Tabs defaultValue="basic" className="space-y-4">
            <TabsList>
              <TabsTrigger value="basic">Básico</TabsTrigger>
              <TabsTrigger value="hero">Hero</TabsTrigger>
              <TabsTrigger value="about">Sobre</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div>
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="slug">Slug (URL)</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
                <Label htmlFor="isActive">Ativo</Label>
              </div>
            </TabsContent>

            <TabsContent value="hero" className="space-y-4">
              <div>
                <Label htmlFor="heroTitle">Título</Label>
                <Input
                  id="heroTitle"
                  value={formData.sections.hero.title}
                  onChange={(e) => setFormData({
                    ...formData,
                    sections: {
                      ...formData.sections,
                      hero: { ...formData.sections.hero, title: e.target.value }
                    }
                  })}
                />
              </div>

              <div>
                <Label htmlFor="heroSubtitle">Subtítulo</Label>
                <Input
                  id="heroSubtitle"
                  value={formData.sections.hero.subtitle}
                  onChange={(e) => setFormData({
                    ...formData,
                    sections: {
                      ...formData.sections,
                      hero: { ...formData.sections.hero, subtitle: e.target.value }
                    }
                  })}
                />
              </div>

              <div>
                <Label htmlFor="heroImage">Imagem de Fundo</Label>
                <Input
                  id="heroImage"
                  value={formData.sections.hero.background_image}
                  onChange={(e) => setFormData({
                    ...formData,
                    sections: {
                      ...formData.sections,
                      hero: { ...formData.sections.hero, background_image: e.target.value }
                    }
                  })}
                />
              </div>
            </TabsContent>

            <TabsContent value="about" className="space-y-4">
              <div>
                <Label htmlFor="aboutTitle">Título</Label>
                <Input
                  id="aboutTitle"
                  value={formData.sections.about.title}
                  onChange={(e) => setFormData({
                    ...formData,
                    sections: {
                      ...formData.sections,
                      about: { ...formData.sections.about, title: e.target.value }
                    }
                  })}
                />
              </div>

              <div>
                <Label htmlFor="aboutContent">Conteúdo</Label>
                <Textarea
                  id="aboutContent"
                  value={formData.sections.about.content}
                  onChange={(e) => setFormData({
                    ...formData,
                    sections: {
                      ...formData.sections,
                      about: { ...formData.sections.about, content: e.target.value }
                    }
                  })}
                  rows={4}
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LandingPageEditModal;
