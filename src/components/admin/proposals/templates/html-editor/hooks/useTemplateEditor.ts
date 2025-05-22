import { useState, useEffect } from 'react';
import { HtmlTemplateData } from '../types';
import { toast } from 'sonner';
import { 
  saveHtmlTemplate, 
  updateHtmlTemplate 
} from '../templateHtmlService';
import { insertVariableAtCursor } from '../variableUtils';

export const useTemplateEditor = (
  initialTemplate: HtmlTemplateData | undefined,
  onSave?: (template: HtmlTemplateData) => Promise<boolean>
) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("editor");
  const [previewMode, setPreviewMode] = useState<boolean>(false);
  const [template, setTemplate] = useState<HtmlTemplateData | null>(null);
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [cssContent, setCssContent] = useState<string>('');
  const [currentCursorPosition, setCurrentCursorPosition] = useState<number>(0);
  const [activeEditor, setActiveEditor] = useState<'html' | 'css'>('html');
  const [saveError, setSaveError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  
  useEffect(() => {
    const loadTemplate = async () => {
      try {
        setIsLoading(true);
        setSaveError(null);
        setDebugInfo(null);

        if (initialTemplate) {
          console.log('Loading initial template:', initialTemplate.id);
          setTemplate(initialTemplate);
          setHtmlContent(initialTemplate.htmlContent);
          setCssContent(initialTemplate.cssContent || '');
        } else {
          // Create a new empty template
          console.log('Creating new empty template');
          const emptyTemplate: HtmlTemplateData = {
            id: 'new',
            name: 'Novo Template',
            description: '',
            htmlContent: '<div class="template">\n  <!-- Conteúdo do template aqui -->\n</div>',
            cssContent: '.template {\n  font-family: Arial, sans-serif;\n}',
            variables: {},
            isDefault: false
          };
          setTemplate(emptyTemplate);
          setHtmlContent(emptyTemplate.htmlContent);
          setCssContent(emptyTemplate.cssContent || '');
        }
      } catch (error) {
        console.error('Error loading template:', error);
        toast.error('Erro ao carregar template');
      } finally {
        setIsLoading(false);
      }
    };

    loadTemplate();
  }, [initialTemplate]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (template) {
      setTemplate({ ...template, name: e.target.value });
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (template) {
      setTemplate({ ...template, description: e.target.value });
    }
  };

  const handleHtmlChange = (value: string) => {
    setHtmlContent(value);
    if (template) {
      setTemplate({ ...template, htmlContent: value });
    }
  };

  const handleCssChange = (value: string) => {
    setCssContent(value);
    if (template) {
      setTemplate({ ...template, cssContent: value });
    }
  };

  const handleSave = async () => {
    if (!template) return;

    try {
      setIsSaving(true);
      setSaveError(null);
      setDebugInfo(null);
      
      // Validate template data
      if (!template.name || template.name.trim() === '') {
        toast.error('O nome do template é obrigatório');
        setSaveError('Nome do template é obrigatório');
        return;
      }
      
      if (!htmlContent || htmlContent.trim() === '') {
        toast.error('O conteúdo HTML é obrigatório');
        setSaveError('Conteúdo HTML é obrigatório');
        return;
      }
      
      console.log('Saving template:', {
        id: template.id,
        name: template.name,
        htmlContent: htmlContent.length > 50 ? htmlContent.substring(0, 50) + '...' : htmlContent,
        cssContent: cssContent ? (cssContent.length > 50 ? cssContent.substring(0, 50) + '...' : cssContent) : '',
        isDefault: template.isDefault
      });
      
      // Ensure we have complete template data
      const templateToSave: HtmlTemplateData = {
        ...template,
        htmlContent,
        cssContent
      };
      
      let success = false;
      
      // If we have onSave callback, use it
      if (onSave) {
        success = await onSave(templateToSave);
      } else {
        // Otherwise use our service directly
        console.log('Using direct save method');
        
        if (template.id === 'new') {
          console.log('Creating new template');
          try {
            // Create new template
            const newId = await saveHtmlTemplate({
              name: template.name,
              description: template.description,
              htmlContent,
              cssContent,
              variables: template.variables,
              isDefault: template.isDefault
            });
            
            success = !!newId;
            console.log('New template created with ID:', newId);
            
            if (success && newId) {
              setTemplate({
                ...templateToSave,
                id: newId
              });
              setDebugInfo(`Template salvo com sucesso! ID: ${newId}`);
            } else {
              setDebugInfo(`Erro: ID não retornado após salvar. Verifique as políticas RLS da tabela.`);
              throw new Error('ID não retornado após salvar');
            }
          } catch (error: any) {
            console.error('Detailed save error:', error);
            setDebugInfo(`Erro ao salvar: ${error.message || JSON.stringify(error)}. Verifique se as políticas RLS estão configuradas na tabela proposal_template_html.`);
            throw error;
          }
        } else {
          console.log('Updating existing template:', template.id);
          try {
            // Update existing template
            success = await updateHtmlTemplate(template.id, {
              name: template.name,
              description: template.description,
              htmlContent,
              cssContent,
              variables: template.variables,
              isDefault: template.isDefault
            });
            
            setDebugInfo(success 
              ? `Template atualizado com sucesso! ID: ${template.id}` 
              : 'Falha na atualização do template. Verifique as políticas RLS da tabela.');
            
            console.log('Template update result:', success ? 'Success' : 'Failed');
          } catch (error: any) {
            console.error('Detailed update error:', error);
            setDebugInfo(`Erro ao atualizar: ${error.message || JSON.stringify(error)}. Verifique se as políticas RLS estão configuradas na tabela proposal_template_html.`);
            throw error;
          }
        }
      }
      
      if (success) {
        toast.success('Template salvo com sucesso!');
      } else {
        toast.error('Erro ao salvar template. Verifique as políticas RLS.');
        setSaveError('Falha ao salvar o template no banco de dados. Verifique se as políticas RLS estão configuradas na tabela proposal_template_html.');
      }
    } catch (error: any) {
      console.error('Error saving template:', error);
      toast.error(`Erro ao salvar template: ${error.message}`);
      setSaveError(`Erro: ${error.message || "Problema desconhecido"}. Verifique se as políticas RLS estão configuradas na tabela proposal_template_html.`);
    } finally {
      setIsSaving(false);
    }
  };

  const togglePreviewMode = () => {
    setPreviewMode(!previewMode);
  };

  const handleInsertVariable = (category: string, variableName: string) => {
    if (activeEditor !== 'html') {
      toast.info('Variáveis só podem ser inseridas no editor HTML');
      return;
    }
    
    const result = insertVariableAtCursor(
      htmlContent,
      currentCursorPosition,
      category,
      variableName
    );
    
    setHtmlContent(result.updatedContent);
    setCurrentCursorPosition(result.cursorPosition);
    
    if (template) {
      setTemplate({ ...template, htmlContent: result.updatedContent });
    }
    
    toast.success(`Variável {{${category}.${variableName}}} inserida`);
  };

  const handleCursorPositionChange = (position: number) => {
    setCurrentCursorPosition(position);
  };

  return {
    template,
    htmlContent,
    cssContent,
    isLoading,
    isSaving,
    previewMode,
    activeTab,
    activeEditor,
    currentCursorPosition,
    saveError,
    debugInfo,
    setActiveTab,
    setActiveEditor,
    handleNameChange,
    handleDescriptionChange,
    handleHtmlChange,
    handleCssChange,
    handleSave,
    togglePreviewMode,
    handleInsertVariable,
    handleCursorPositionChange
  };
};
