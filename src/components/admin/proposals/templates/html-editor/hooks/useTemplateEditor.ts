
import { HtmlTemplateData } from '../types';
import { useTemplateDisplay } from './useTemplateDisplay';
import { useTemplateContent } from './useTemplateContent';
import { useTemplateActions } from './useTemplateActions';
import { useTemplateLoading } from './useTemplateLoading';

export const useTemplateEditor = (
  initialTemplate: HtmlTemplateData | undefined,
  onSave?: (template: HtmlTemplateData) => Promise<boolean>
) => {
  // Use our custom hooks to separate concerns
  const { 
    activeTab, 
    setActiveTab, 
    previewMode, 
    togglePreviewMode 
  } = useTemplateDisplay();

  // Initialize content with empty template (not null)
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
  } = useTemplateContent(null);

  const { 
    isSaving, 
    saveError, 
    debugInfo, 
    handleSave: saveTemplate 
  } = useTemplateActions();

  // Load template using the dedicated hook
  const { isLoading } = useTemplateLoading(
    initialTemplate,
    setTemplate,
    handleHtmlChange,
    handleCssChange
  );

  const handleSave = async () => {
    if (!template) {
      console.error('No template to save');
      return;
    }

    console.log('Saving template:', {
      id: template.id,
      name: template.name,
      htmlContent: htmlContent.substring(0, 50) + '...',
      cssContent: cssContent ? cssContent.substring(0, 50) + '...' : ''
    });

    const result = await saveTemplate(template, htmlContent, cssContent, onSave);
    
    console.log('Save result:', result);
    
    if (result.success && result.template) {
      setTemplate(result.template);
      console.log('Template updated after save:', result.template.id);
    } else {
      console.error('Failed to save template:', saveError);
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
