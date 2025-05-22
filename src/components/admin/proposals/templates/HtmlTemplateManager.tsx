
import React, { useState, useEffect } from 'react';
import { 
  fetchHtmlTemplates, 
  deleteHtmlTemplate, 
  getDefaultHtmlTemplate 
} from './html-editor/templateHtmlService';
import { HtmlTemplateData } from './html-editor/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PlusCircle, FileText, Trash2, Edit, Copy } from 'lucide-react';
import TemplateHtmlEditor from './html-editor/TemplateHtmlEditor';
import { toast } from 'sonner';

const HtmlTemplateManager: React.FC = () => {
  const [templates, setTemplates] = useState<HtmlTemplateData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showEditor, setShowEditor] = useState<boolean>(false);
  const [editingTemplate, setEditingTemplate] = useState<HtmlTemplateData | null>(null);

  const loadTemplates = async () => {
    setIsLoading(true);
    try {
      const fetchedTemplates = await fetchHtmlTemplates();
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

  const handleNewTemplate = () => {
    setEditingTemplate(null);
    setShowEditor(true);
  };

  const handleEditTemplate = (template: HtmlTemplateData) => {
    setEditingTemplate(template);
    setShowEditor(true);
  };

  const handleDeleteTemplate = async (templateId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este template?')) {
      try {
        const success = await deleteHtmlTemplate(templateId);
        if (success) {
          setTemplates(prev => prev.filter(t => t.id !== templateId));
          toast.success('Template excluído com sucesso');
        }
      } catch (error) {
        console.error('Error deleting template:', error);
        toast.error('Erro ao excluir template');
      }
    }
  };

  const handleDuplicateTemplate = async (template: HtmlTemplateData) => {
    try {
      const duplicatedTemplate: HtmlTemplateData = {
        ...template,
        id: 'new',
        name: `${template.name} (Cópia)`,
        isDefault: false
      };
      
      setEditingTemplate(duplicatedTemplate);
      setShowEditor(true);
    } catch (error) {
      console.error('Error duplicating template:', error);
      toast.error('Erro ao duplicar template');
    }
  };

  const handleTemplateSaved = async () => {
    setShowEditor(false);
    setEditingTemplate(null);
    loadTemplates();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Templates HTML</h2>
          <p className="text-gray-500">
            Gerencie os templates HTML para propostas
          </p>
        </div>
        
        <Button onClick={handleNewTemplate} className="flex items-center">
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Template
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
        </div>
      ) : templates.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">Nenhum template encontrado</h3>
            <p className="text-gray-500 mb-4 text-center">
              Crie seu primeiro template HTML para propostas
            </p>
            <Button onClick={handleNewTemplate}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Criar Template
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map(template => (
            <Card key={template.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="flex justify-between items-center">
                  <span className="truncate">{template.name}</span>
                  {template.isDefault && (
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                      Padrão
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <div className="h-32 mb-4 overflow-hidden border rounded bg-gray-50 text-xs text-gray-500">
                  <div className="p-2 overflow-hidden" style={{ maxHeight: '100%' }}>
                    <pre className="overflow-hidden whitespace-pre-wrap">
                      {template.htmlContent.length > 500 
                        ? `${template.htmlContent.substring(0, 500)}...` 
                        : template.htmlContent}
                    </pre>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <div className="text-xs text-gray-500">
                    {new Date(template.createdAt || '').toLocaleDateString('pt-BR')}
                  </div>
                  <div className="flex space-x-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDuplicateTemplate(template)}
                      title="Duplicar template"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleEditTemplate(template)}
                      title="Editar template"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDeleteTemplate(template.id)}
                      title="Excluir template"
                      disabled={template.isDefault}
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
      
      <Dialog open={showEditor} onOpenChange={setShowEditor}>
        <DialogContent className="max-w-screen-xl max-h-screen overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTemplate ? `Editar Template: ${editingTemplate.name}` : 'Novo Template HTML'}
            </DialogTitle>
          </DialogHeader>
          <TemplateHtmlEditor
            initialTemplate={editingTemplate || undefined}
            onSave={async (template) => {
              await handleTemplateSaved();
              return true;
            }}
            onCancel={() => setShowEditor(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HtmlTemplateManager;
