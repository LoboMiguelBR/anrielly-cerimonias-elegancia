
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Star, Copy } from 'lucide-react';
import { contractApi } from '../../hooks/contract';
import { ContractTemplate } from '../../hooks/contract/types';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ContractTemplatesListProps {
  onEdit: (template: ContractTemplate) => void;
  onCreate: () => void;
}

const ContractTemplatesList = ({ onEdit, onCreate }: ContractTemplatesListProps) => {
  const [templates, setTemplates] = useState<ContractTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [templateToDelete, setTemplateToDelete] = useState<ContractTemplate | null>(null);

  const loadTemplates = async () => {
    try {
      setIsLoading(true);
      const data = await contractApi.getContractTemplates();
      setTemplates(data);
    } catch (error) {
      console.error('Erro ao carregar templates:', error);
      toast.error('Erro ao carregar templates');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  const handleDelete = async () => {
    if (!templateToDelete) return;

    try {
      await contractApi.deleteContractTemplate(templateToDelete.id);
      toast.success('Template excluído com sucesso');
      loadTemplates();
    } catch (error) {
      console.error('Erro ao excluir template:', error);
      toast.error('Erro ao excluir template');
    } finally {
      setTemplateToDelete(null);
    }
  };

  const handleDuplicate = async (template: ContractTemplate) => {
    try {
      const duplicatedTemplate = {
        name: `${template.name} (Cópia)`,
        description: template.description,
        html_content: template.html_content,
        css_content: template.css_content,
        is_default: false
      };
      
      await contractApi.createContractTemplate(duplicatedTemplate);
      toast.success('Template duplicado com sucesso');
      loadTemplates();
    } catch (error) {
      console.error('Erro ao duplicar template:', error);
      toast.error('Erro ao duplicar template');
    }
  };

  const handleSetDefault = async (template: ContractTemplate) => {
    try {
      await contractApi.updateContractTemplate(template.id, { is_default: true });
      toast.success('Template definido como padrão');
      loadTemplates();
    } catch (error) {
      console.error('Erro ao definir template padrão:', error);
      toast.error('Erro ao definir template padrão');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Templates de Contrato</h2>
            <p className="text-gray-600">Gerencie os templates dos seus contratos</p>
          </div>
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Templates de Contrato</h2>
          <p className="text-gray-600">Gerencie os templates dos seus contratos</p>
        </div>
        
        <Button onClick={onCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Template
        </Button>
      </div>

      {/* Templates Grid */}
      {templates.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Edit className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                Nenhum template encontrado
              </h3>
              <p className="text-gray-500 mb-6">
                Crie seu primeiro template de contrato para começar
              </p>
              <Button onClick={onCreate}>
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeiro Template
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {templates.map((template) => (
            <Card key={template.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    {template.is_default && (
                      <Badge variant="default" className="bg-yellow-100 text-yellow-800">
                        <Star className="w-3 h-3 mr-1" />
                        Padrão
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {!template.is_default && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetDefault(template)}
                        title="Definir como padrão"
                      >
                        <Star className="w-4 h-4" />
                      </Button>
                    )}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDuplicate(template)}
                      title="Duplicar template"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(template)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setTemplateToDelete(template)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-gray-600 mb-3">
                  {template.description || 'Sem descrição'}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>
                    Criado em: {new Date(template.created_at).toLocaleDateString('pt-BR')}
                  </span>
                  <span>
                    Atualizado em: {new Date(template.updated_at).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!templateToDelete} onOpenChange={() => setTemplateToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o template "{templateToDelete?.name}"? 
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ContractTemplatesList;
