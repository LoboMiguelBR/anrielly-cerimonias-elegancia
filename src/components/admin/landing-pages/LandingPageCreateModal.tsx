
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useLandingPageActions } from '@/hooks/useLandingPageActions';

interface LandingPageCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const LandingPageCreateModal = ({ open, onOpenChange, onSuccess }: LandingPageCreateModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    isActive: false
  });

  const { createTemplate, loading } = useLandingPageActions();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await createTemplate({
      name: formData.name,
      slug: formData.slug,
      is_active: formData.isActive,
      sections: {
        hero: {
          title: "Novo Template",
          subtitle: "Personalize este template",
          background_image: "/lovable-uploads/51ec6ddc-43be-45c4-9c33-1f407dba1411.png",
          cta_primary: "Solicitar Orçamento",
          cta_secondary: "Fale no WhatsApp",
          whatsapp_link: "https://wa.me/5524992689947"
        },
        about: {
          title: "Sobre",
          content: "Conteúdo personalizado aqui...",
          image: "/lovable-uploads/99442f1a-9c10-4e95-a063-bd0bda0a998c.png"
        },
        services: {
          title: "Serviços",
          items: []
        },
        contact: {
          show_form: true
        }
      }
    });

    if (success) {
      setFormData({ name: '', slug: '', isActive: false });
      onSuccess();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nova Landing Page</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Nome da landing page"
              required
            />
          </div>

          <div>
            <Label htmlFor="slug">Slug (URL)</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="minha-landing-page"
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
              {loading ? 'Criando...' : 'Criar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LandingPageCreateModal;
