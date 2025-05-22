
import { useEffect } from 'react';
import { HtmlTemplateData } from '../types';
import { toast } from 'sonner';
import { useTemplateDisplay } from './useTemplateDisplay';
import { useTemplateContent } from './useTemplateContent';
import { useTemplateActions } from './useTemplateActions';

export const useTemplateEditor = (
  initialTemplate: HtmlTemplateData | undefined,
  onSave?: (template: HtmlTemplateData) => Promise<boolean>
) => {
  // Use our custom hooks to separate concerns
  const { 
    isLoading, 
    setIsLoading, 
    activeTab, 
    setActiveTab, 
    previewMode, 
    togglePreviewMode 
  } = useTemplateDisplay();

  const { 
    isSaving, 
    saveError, 
    debugInfo, 
    handleSave: saveTemplate 
  } = useTemplateActions();

  const {
    template,
    setTemplate,
    htmlContent,
    cssContent,
    activeEditor,
    currentCursorPosition,
    handleNameChange,
    handleDescriptionChange,
    handleHtmlChange,
    handleCssChange,
    handleInsertVariable,
    handleCursorPositionChange,
    setActiveEditor
  } = useTemplateContent(null); // Start with null, we'll set it in useEffect

  useEffect(() => {
    const loadTemplate = async () => {
      try {
        setIsLoading(true);

        if (initialTemplate) {
          console.log('Loading initial template:', initialTemplate.id);
          setTemplate(initialTemplate);
          handleHtmlChange(initialTemplate.htmlContent);
          handleCssChange(initialTemplate.cssContent || '');
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
          handleHtmlChange(emptyTemplate.htmlContent);
          handleCssChange(emptyTemplate.cssContent || '');
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

  const handleSave = async () => {
    if (!template) return;

    const result = await saveTemplate(template, htmlContent, cssContent, onSave);
    if (result.success && result.template) {
      setTemplate(result.template);
    }
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
