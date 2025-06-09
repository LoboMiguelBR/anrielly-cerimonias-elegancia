import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Copy, Plus } from 'lucide-react';
import { proposalTemplatesApi, ProposalTemplateData } from '../../hooks/proposal/api/proposalTemplates';
import { toast } from 'sonner';

interface ProposalTemplatesListProps {
  onEdit: (template: ProposalTemplateData) => void;
  onCreate: () => void;
}

const ProposalTemplatesList = ({ onEdit, onCreate }: ProposalTemplatesListProps) => {
  const [templates, setTemplates] = useState<ProposalTemplateData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadTemplates = async () => {
    setIsLoading(true);
    try {
      const fetchedTemplates = await proposalTemplatesApi.fetchProposalTemplates();
      setTemplates(fetchedTemplates);
    } catch (error) {
      console.error('Error loading templates:', error);
      toast.error('Erro ao carregar templates');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  const handleDelete = async (templateId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este template?')) {
      try {
        await proposalTemplatesApi.deleteProposalTemplate(templateId);
        setTemplates(prev => prev.filter(t => t.id !== templateId));
      } catch (error) {
        console.error('Error deleting template:', error);
      }
    }
  };

  const handleDuplicate = async (template: ProposalTemplateData) => {
    try {
      const duplicatedTemplate = {
        name: `${template.name} (Cópia)`,
        description: template.description,
        html_content: template.html_content,
        css_content: template.css_content,
        variables: template.variables,
        is_default: false
      };
      
      await proposalTemplatesApi.createProposalTemplate(duplicatedTemplate);
      await loadTemplates();
      toast.success('Template duplicado com sucesso!');
    } catch (error) {
      console.error('Error duplicating template:', error);
      toast.error('Erro ao duplicar template');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Templates de Proposta</h2>
          <p className="text-gray-600">Gerencie seus templates de proposta</p>
        </div>
        <Button onClick={onCreate} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Novo Template
        </Button>
      </div>

      {templates.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500 mb-4">Nenhum template encontrado</p>
            <Button onClick={onCreate} variant="outline">
              Criar Primeiro Template
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => (
            <Card key={template.id} className="relative">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    {template.description && (
                      <p className="text-sm text-gray-600 mt-1">
                        {template.description}
                      </p>
                    )}
                  </div>
                  {template.is_default && (
                    <Badge variant="secondary">Padrão</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-xs text-gray-500">
                    Criado em {new Date(template.created_at || '').toLocaleDateString('pt-BR')}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onEdit(template)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDuplicate(template)}
                      className="h-8 w-8 p-0"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(template.id)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProposalTemplatesList;
