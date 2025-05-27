
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Star, Copy, Mail } from 'lucide-react';
import { contractApi } from '../../hooks/contract';
import { ContractEmailTemplate, EMAIL_TEMPLATE_TYPES } from '../../hooks/contract/types';
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

interface ContractEmailTemplatesListProps {
  onEdit: (template: ContractEmailTemplate) => void;
  onCreate: () => void;
}

const ContractEmailTemplatesList = ({ onEdit, onCreate }: ContractEmailTemplatesListProps) => {
  const [templates, setTemplates] = useState<ContractEmailTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [templateToDelete, setTemplateToDelete] = useState<ContractEmailTemplate | null>(null);

  const loadTemplates = async () => {
    try {
      setIsLoading(true);
      const data = await contractApi.getContractEmailTemplates();
      setTemplates(data);
    } catch (error) {
      console.error('Erro ao carregar templates de email:', error);
      toast.error('Erro ao carregar templates de email');
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
      await contractApi.deleteContractEmailTemplate(templateToDelete.id);
      toast.success('Template de email excluído com sucesso');
      loadTemplates();
    } catch (error) {
      console.error('Erro ao excluir template de email:', error);
      toast.error('Erro ao excluir template de email');
    } finally {
      setTemplateToDelete(null);
    }
  };

  const handleDuplicate = async (template: ContractEmailTemplate) => {
    try {
      const duplicatedTemplate = {
        name: `${template.name} (Cópia)`,
        description: template.description,
        subject: template.subject,
        html_content: template.html_content,
        template_type: template.template_type,
        is_default: false
      };
      
      await contractApi.createContractEmailTemplate(duplicatedTemplate);
      toast.success('Template de email duplicado com sucesso');
      loadTemplates();
    } catch (error) {
      console.error('Erro ao duplicar template de email:', error);
      toast.error('Erro ao duplicar template de email');
    }
  };

  const handleSetDefault = async (template: ContractEmailTemplate) => {
    try {
      await contractApi.updateContractEmailTemplate(template.id, { is_default: true });
      toast.success('Template definido como padrão');
      loadTemplates();
    } catch (error) {
      console.error('Erro ao definir template padrão:', error);
      toast.error('Erro ao definir template padrão');
    }
  };

  const getTemplateTypeLabel = (type: string) => {
    const templateType = EMAIL_TEMPLATE_TYPES.find(t => t.value === type);
    return templateType?.label || type;
  };

  const getTemplateTypeColor = (type: string) => {
    switch (type) {
      case 'signature':
        return 'bg-blue-100 text-blue-800';
      case 'signed_confirmation':
        return 'bg-green-100 text-green-800';
      case 'reminder':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Templates de Email</h2>
            <p className="text-gray-600">Gerencie os templates de email dos contratos</p>
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
          <h2 className="text-2xl font-bold">Templates de Email</h2>
          <p className="text-gray-600">Gerencie os templates de email dos contratos</p>
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
              <Mail className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                Nenhum template de email encontrado
              </h3>
              <p className="text-gray-500 mb-6">
                Crie seu primeiro template de email para contratos
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
                    <Badge className={getTemplateTypeColor(template.template_type)}>
                      {getTemplateTypeLabel(template.template_type)}
                    </Badge>
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
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Assunto:</p>
                    <p className="text-sm">{template.subject}</p>
                  </div>
                  
                  <p className="text-gray-600 text-sm">
                    {template.description || 'Sem descrição'}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>
                      Criado em: {new Date(template.created_at).toLocaleDateString('pt-BR')}
                    </span>
                    <span>
                      Atualizado em: {new Date(template.updated_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
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
        </AlertDialogFooter>
      </AlertDialog>
    </div>
  );
};

export default ContractEmailTemplatesList;
