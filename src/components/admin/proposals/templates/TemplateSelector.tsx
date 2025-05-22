
import React, { useState, useEffect } from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { ProposalTemplateData } from './shared/types';
import { defaultTemplate, fetchTemplates } from './shared/templateService';
import { HtmlTemplateData } from './html-editor/types';
import { fetchHtmlTemplates } from './html-editor/templateHtmlService';

interface TemplateSelectorProps {
  selectedTemplateId?: string;
  onSelectTemplate: (template: ProposalTemplateData) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ 
  selectedTemplateId = 'default',
  onSelectTemplate
}) => {
  const [templates, setTemplates] = useState<ProposalTemplateData[]>([defaultTemplate]);
  const [htmlTemplates, setHtmlTemplates] = useState<HtmlTemplateData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTemplates = async () => {
      setIsLoading(true);
      
      try {
        // Load legacy templates
        const legacyTemplates = await fetchTemplates();
        
        // Load HTML templates
        const htmlTemplatesData = await fetchHtmlTemplates();
        
        setTemplates([defaultTemplate, ...legacyTemplates]);
        setHtmlTemplates(htmlTemplatesData);
      } catch (error) {
        console.error('Error loading templates:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTemplates();
  }, []);

  const handleTemplateChange = (value: string) => {
    // Check if the selected template is an HTML template
    if (value.startsWith('html_')) {
      const htmlTemplateId = value.replace('html_', '');
      const selectedHtmlTemplate = htmlTemplates.find(t => t.id === htmlTemplateId);
      
      if (selectedHtmlTemplate) {
        // Convert HTML template to the format expected by the proposal system
        const htmlAsProposalTemplate: ProposalTemplateData = {
          id: selectedHtmlTemplate.id,
          name: selectedHtmlTemplate.name,
          colors: {
            primary: '#6C2BD9',
            secondary: '#A78BFA',
            accent: '#F472B6',
            text: '#333333',
            background: '#FFFFFF'
          },
          fonts: {
            title: 'Playfair Display, serif',
            body: 'Inter, sans-serif'
          },
          logo: 'https://oampddkpuybkbwqggrty.supabase.co/storage/v1/object/public/proposals/LogoAG.png',
          isHtmlTemplate: true,
          htmlTemplate: selectedHtmlTemplate
        };
        
        onSelectTemplate(htmlAsProposalTemplate);
        return;
      }
    }
    
    // Handle legacy templates
    const selectedTemplate = templates.find(t => t.id === value);
    if (selectedTemplate) {
      onSelectTemplate(selectedTemplate);
    }
  };

  return (
    <div>
      <Select disabled={isLoading} onValueChange={handleTemplateChange} defaultValue={selectedTemplateId}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Selecione um template">
            {isLoading 
              ? 'Carregando templates...' 
              : (selectedTemplateId.startsWith('html_') 
                ? htmlTemplates.find(t => t.id === selectedTemplateId.replace('html_', ''))?.name 
                : templates.find(t => t.id === selectedTemplateId)?.name) || 'Template padrão'}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="default">Template padrão</SelectItem>
          
          {htmlTemplates.length > 0 && (
            <>
              <div className="py-2 px-2 text-xs font-semibold text-gray-500">
                Templates HTML
              </div>
              {htmlTemplates.map(template => (
                <SelectItem key={`html_${template.id}`} value={`html_${template.id}`}>
                  {template.name} {template.isDefault ? '(Padrão)' : ''}
                </SelectItem>
              ))}
            </>
          )}
          
          {templates.length > 1 && (
            <>
              <div className="py-2 px-2 text-xs font-semibold text-gray-500">
                Templates Legados
              </div>
              {templates.slice(1).map(template => (
                <SelectItem key={template.id} value={template.id}>
                  {template.name}
                </SelectItem>
              ))}
            </>
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default TemplateSelector;
