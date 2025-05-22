
import { useState, useEffect } from 'react';
import { HtmlTemplateData } from '../types';
import { toast } from 'sonner';

export const useTemplateLoading = (
  initialTemplate: HtmlTemplateData | undefined,
  setTemplate: (template: HtmlTemplateData) => void,
  handleHtmlChange: (value: string) => void,
  handleCssChange: (value: string) => void
) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
  }, [initialTemplate, setTemplate, handleHtmlChange, handleCssChange]);

  return {
    isLoading
  };
};
