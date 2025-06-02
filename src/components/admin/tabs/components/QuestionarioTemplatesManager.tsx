
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Settings, Eye, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useQuestionarioTemplates } from "@/hooks/useQuestionarioTemplates";
import QuestionarioTemplateForm from "./QuestionarioTemplateForm";
import QuestionarioTemplateEditor from "./QuestionarioTemplateEditor";
import QuestionarioTemplatePreview from "./QuestionarioTemplatePreview";
import QuestionarioTemplateDeleteDialog from "./QuestionarioTemplateDeleteDialog";

const QuestionarioTemplatesManager = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

  const { templates, isLoading, refetch, deleteTemplate } = useQuestionarioTemplates();

  const handleCreateSuccess = () => {
    setIsCreateDialogOpen(false);
    refetch();
  };

  const handleEditSuccess = () => {
    setIsEditDialogOpen(false);
    refetch();
  };

  const handleEdit = (template: any) => {
    setSelectedTemplate(template);
    setIsEditDialogOpen(true);
  };

  const handlePreview = (template: any) => {
    setSelectedTemplate(template);
    setIsPreviewDialogOpen(true);
  };

  const handleDeleteClick = (template: any) => {
    setSelectedTemplate(template);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedTemplate) {
      const success = await deleteTemplate(selectedTemplate.id);
      if (success) {
        setIsDeleteDialogOpen(false);
        setSelectedTemplate(null);
      }
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-semibold">Templates de Questionário</h3>
          <p className="text-gray-600">Gerencie os modelos de questionários para diferentes tipos de eventos</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Novo Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Criar Novo Template</DialogTitle>
            </DialogHeader>
            <QuestionarioTemplateForm onSuccess={handleCreateSuccess} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Grid de Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates?.map((template: any) => (
          <Card key={template.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{template.nome}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">{template.tipo_evento}</p>
                </div>
                <div className="flex gap-1">
                  {template.is_default && (
                    <Badge variant="default" className="text-xs">Padrão</Badge>
                  )}
                  {template.ativo && (
                    <Badge variant="outline" className="text-xs">Ativo</Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              {template.descricao && (
                <p className="text-sm text-gray-600 mb-4">{template.descricao}</p>
              )}
              
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>Categoria: {template.categoria}</span>
                <span>Ordem: {template.ordem}</span>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePreview(template)}
                  className="flex-1"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Visualizar
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(template)}
                  className="flex-1"
                >
                  <Settings className="h-4 w-4 mr-1" />
                  Editar
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteClick(template)}
                  className={`${
                    template.is_default 
                      ? 'text-gray-400 cursor-not-allowed' 
                      : 'text-red-600 hover:text-red-700 hover:bg-red-50'
                  }`}
                  disabled={template.is_default}
                  title={template.is_default ? 'Templates padrão não podem ser excluídos' : 'Excluir template'}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modais */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Editar Template: {selectedTemplate?.nome}</DialogTitle>
          </DialogHeader>
          <QuestionarioTemplateEditor
            template={selectedTemplate}
            onSuccess={handleEditSuccess}
            onClose={() => setIsEditDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Preview: {selectedTemplate?.nome}</DialogTitle>
          </DialogHeader>
          <QuestionarioTemplatePreview
            template={selectedTemplate}
            onClose={() => setIsPreviewDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <QuestionarioTemplateDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        templateName={selectedTemplate?.nome || ''}
        isDefault={selectedTemplate?.is_default || false}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default QuestionarioTemplatesManager;
