
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Plus, ExternalLink, Copy, Trash2 } from "lucide-react";
import { useLandingPageTemplates } from '@/hooks/useLandingPageTemplates';
import { useLandingPageActions } from '@/hooks/useLandingPageActions';
import LandingPageCreateModal from '../landing-pages/LandingPageCreateModal';
import LandingPageEditModal from '../landing-pages/LandingPageEditModal';
import { LandingPageTemplate } from '@/hooks/useLandingPageData';

const LandingPagesTab = () => {
  const { templates, loading, refetch } = useLandingPageTemplates();
  const { duplicateTemplate, deleteTemplate } = useLandingPageActions();
  const [searchTerm, setSearchTerm] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<LandingPageTemplate | null>(null);

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (template: LandingPageTemplate) => {
    setSelectedTemplate(template);
    setEditModalOpen(true);
  };

  const handleDuplicate = async (id: string) => {
    const success = await duplicateTemplate(id);
    if (success) {
      refetch();
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja deletar este template?')) {
      const success = await deleteTemplate(id);
      if (success) {
        refetch();
      }
    }
  };

  const handleSuccess = () => {
    refetch();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Landing Pages</h2>
          <p className="text-gray-600">Gerencie templates de landing pages dinâmicas</p>
        </div>
        <Button onClick={() => setCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Landing Page
        </Button>
      </div>

      <div className="flex gap-4">
        <Input
          placeholder="Buscar por nome ou slug..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
        <Button onClick={refetch} variant="outline">
          Atualizar
        </Button>
      </div>

      <div className="grid gap-4">
        {filteredTemplates.map((template) => (
          <Card key={template.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{template.name}</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant={template.is_active ? "default" : "secondary"}>
                    {template.is_active ? "Ativo" : "Inativo"}
                  </Badge>
                  <Badge variant="outline">
                    {template.tenant_id}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">URL:</p>
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                    /{template.slug}
                  </code>
                </div>
                
                <div className="flex gap-2 flex-wrap">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => window.open(`/${template.slug}`, '_blank')}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Visualizar
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleEdit(template)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleDuplicate(template.id)}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Duplicar
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => window.open(`/${template.slug}`, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Abrir
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => handleDelete(template.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Deletar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>Nenhuma landing page encontrada.</p>
        </div>
      )}

      <LandingPageCreateModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onSuccess={handleSuccess}
      />

      <LandingPageEditModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        onSuccess={handleSuccess}
        template={selectedTemplate}
      />
    </div>
  );
};

export default LandingPagesTab;
