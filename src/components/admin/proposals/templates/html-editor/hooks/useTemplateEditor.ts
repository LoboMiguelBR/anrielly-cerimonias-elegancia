
import { HtmlTemplateData } from '../types';
import { useTemplateDisplay } from './useTemplateDisplay';
import { useTemplateContent } from './useTemplateContent';
import { useTemplateActions } from './useTemplateActions';
import { useTemplateLoading } from './useTemplateLoading';
import { useCallback } from 'react';

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

  // Initialize template content management
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
  } = useTemplateContent(null); // Start with null, will be set by useTemplateLoading

  // Template actions (saving)
  const { 
    isSaving, 
    saveError, 
    debugInfo, 
    handleSave: saveTemplate 
  } = useTemplateActions();

  // Template loading - this will update the template content when initialTemplate changes
  const { isLoading } = useTemplateLoading(
    initialTemplate,
    setTemplate,
    handleHtmlChange,
    handleCssChange
  );

  // Wrap the save action in a stable callback
  const handleSave = useCallback(async () => {
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
  }, [template, htmlContent, cssContent, saveTemplate, setTemplate, onSave, saveError]);

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
