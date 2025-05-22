
import { useState } from 'react';
import { HtmlTemplateData } from '../types';
import { toast } from 'sonner';
import { insertVariableAtCursor } from '../utils/editorUtils';

// Create default values to avoid null states
const defaultTemplate: HtmlTemplateData = {
  id: 'new',
  name: '',
  description: '',
  htmlContent: '',
  cssContent: '',
  variables: {},
  isDefault: false
};

export const useTemplateContent = (initialTemplate: HtmlTemplateData | null) => {
  // Initialize with default values instead of null to avoid null checks
  const [template, setTemplate] = useState<HtmlTemplateData>(initialTemplate || defaultTemplate);
  const [htmlContent, setHtmlContent] = useState<string>(initialTemplate?.htmlContent || '');
  const [cssContent, setCssContent] = useState<string>(initialTemplate?.cssContent || '');
  const [currentCursorPosition, setCurrentCursorPosition] = useState<number>(0);
  const [activeEditor, setActiveEditor] = useState<'html' | 'css'>('html');

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTemplate(prev => ({ ...prev, name: e.target.value }));
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTemplate(prev => ({ ...prev, description: e.target.value }));
  };

  const handleHtmlChange = (value: string) => {
    setHtmlContent(value);
    // Update template using functional update to avoid stale state references
    setTemplate(prev => ({ ...prev, htmlContent: value }));
  };

  const handleCssChange = (value: string) => {
    setCssContent(value);
    // Update template using functional update to avoid stale state references
    setTemplate(prev => ({ ...prev, cssContent: value }));
  };

  const handleInsertVariable = (category: string, variableName: string) => {
    if (activeEditor !== 'html') {
      toast.info('Variáveis só podem ser inseridas no editor HTML');
      return;
    }
    
    const result = insertVariableAtCursor(
      htmlContent,
      currentCursorPosition,
      '{{',
      '}}',
      `${category}.${variableName}`
    );
    
    // First update the htmlContent state
    setHtmlContent(result.updatedContent);
    setCurrentCursorPosition(result.cursorPosition);
    
    // Then update the template state with the new htmlContent
    setTemplate(prev => ({ ...prev, htmlContent: result.updatedContent }));
    
    toast.success(`Variável {{${category}.${variableName}}} inserida`);
  };

  const handleCursorPositionChange = (position: number) => {
    setCurrentCursorPosition(position);
  };

  return {
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
  };
};
