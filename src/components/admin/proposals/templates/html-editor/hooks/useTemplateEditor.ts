
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

  const { isLoading } = useTemplateLoading(
    initialTemplate,
    setTemplate,
    handleHtmlChange,
    handleCssChange
  );

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
