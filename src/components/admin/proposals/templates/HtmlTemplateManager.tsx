
import React, { useState, useEffect } from 'react';
import { 
  fetchHtmlTemplates, 
  deleteHtmlTemplate
} from './html-editor/templateHtmlService';
import { HtmlTemplateData } from './html-editor/types';
import { Dialog } from '@/components/ui/dialog';
import { toast } from 'sonner';

// Import the newly created components
import {
  TemplateHeader,
  TemplateLoading,
  TemplateEmptyState,
  TemplateGrid,
  TemplateEditorDialog
} from './html-manager';

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

  const handleTemplateSaved = async (template: HtmlTemplateData) => {
    setShowEditor(false);
    setEditingTemplate(null);
    await loadTemplates();
    return true;
  };

  return (
    <div>
      <TemplateHeader onCreateNew={handleNewTemplate} />

      {isLoading ? (
        <TemplateLoading />
      ) : templates.length === 0 ? (
        <TemplateEmptyState onCreateNew={handleNewTemplate} />
      ) : (
        <TemplateGrid 
          templates={templates}
          onEdit={handleEditTemplate}
          onDelete={handleDeleteTemplate}
          onDuplicate={handleDuplicateTemplate}
        />
      )}
      
      <Dialog open={showEditor} onOpenChange={setShowEditor}>
        <TemplateEditorDialog
          editingTemplate={editingTemplate}
          onSave={handleTemplateSaved}
          onCancel={() => setShowEditor(false)}
        />
      </Dialog>
    </div>
  );
};

export default HtmlTemplateManager;
