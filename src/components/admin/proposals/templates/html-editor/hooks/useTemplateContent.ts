
import { useState } from 'react';
import { HtmlTemplateData } from '../types';
import { toast } from 'sonner';
import { insertVariableAtCursor } from '../utils/editorUtils';

export const useTemplateContent = (initialTemplate: HtmlTemplateData | null) => {
  const [template, setTemplate] = useState<HtmlTemplateData | null>(initialTemplate);
  const [htmlContent, setHtmlContent] = useState<string>(initialTemplate?.htmlContent || '');
  const [cssContent, setCssContent] = useState<string>(initialTemplate?.cssContent || '');
  const [currentCursorPosition, setCurrentCursorPosition] = useState<number>(0);
  const [activeEditor, setActiveEditor] = useState<'html' | 'css'>('html');

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
