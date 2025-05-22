
import { useState, useEffect, useCallback } from 'react';
import { HtmlTemplateData } from '../types';
import { toast } from 'sonner';

export const useTemplateLoading = (
  initialTemplate: HtmlTemplateData | undefined,
  setTemplate: (template: HtmlTemplateData) => void,
  handleHtmlChange: (value: string) => void,
  handleCssChange: (value: string) => void
) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Create a stable function that won't change on renders
  const loadTemplate = useCallback(() => {
    try {
      setIsLoading(true);

      if (initialTemplate) {
        console.log('Loading initial template:', initialTemplate.id);
        
        // Update all states at once to prevent multiple re-renders
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
        
        // Update all states at once
        setTemplate(emptyTemplate);
        handleHtmlChange(emptyTemplate.htmlContent);
        handleCssChange(emptyTemplate.cssContent);
      }
    } catch (error) {
      console.error('Error loading template:', error);
      toast.error('Erro ao carregar template');
    } finally {
      setIsLoading(false);
    }
  }, [initialTemplate, setTemplate, handleHtmlChange, handleCssChange]);

  // Run only once on mount or when initialTemplate changes reference
  useEffect(() => {
    loadTemplate();
  }, [loadTemplate]);

  return {
    isLoading
  };
};
