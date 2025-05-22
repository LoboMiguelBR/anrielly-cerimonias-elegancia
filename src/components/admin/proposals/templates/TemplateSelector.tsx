
import React, { useState, useEffect } from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { ProposalTemplateData } from './shared/types';
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
  const [htmlTemplates, setHtmlTemplates] = useState<HtmlTemplateData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTemplates = async () => {
      setIsLoading(true);
      
      try {
        console.log('Loading HTML templates for selector...');
        // Load HTML templates
        const htmlTemplatesData = await fetchHtmlTemplates();
        console.log(`Loaded ${htmlTemplatesData.length} HTML templates:`, 
          htmlTemplatesData.map(t => ({ id: t.id, name: t.name })));
        
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
    console.log('Template selected:', value);
    
    // Get the selected HTML template
    let selectedHtmlTemplate: HtmlTemplateData | undefined;
    
    if (value === 'default') {
      // Find default template
      selectedHtmlTemplate = htmlTemplates.find(t => t.isDefault);
      
      // If no default template found, use the first one
      if (!selectedHtmlTemplate && htmlTemplates.length > 0) {
        selectedHtmlTemplate = htmlTemplates[0];
      }
    } else {
      // Get selected template by ID (remove html_ prefix if it exists)
      const templateId = value.startsWith('html_') ? value.replace('html_', '') : value;
      selectedHtmlTemplate = htmlTemplates.find(t => t.id === templateId);
    }
    
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
      
      console.log('Converting HTML template to proposal template:', htmlAsProposalTemplate);
      onSelectTemplate(htmlAsProposalTemplate);
    } else {
      console.error('Selected template not found:', value);
    }
  };

  const getSelectedTemplateDisplayName = () => {
    if (isLoading) {
      return 'Carregando templates...';
    }
    
    if (selectedTemplateId === 'default') {
      const defaultTemplate = htmlTemplates.find(t => t.isDefault);
      return defaultTemplate ? `${defaultTemplate.name} (Padrão)` : 'Template padrão';
    }
    
    const templateId = selectedTemplateId.startsWith('html_') 
      ? selectedTemplateId.replace('html_', '') 
      : selectedTemplateId;
    
    const template = htmlTemplates.find(t => t.id === templateId);
    return template ? template.name : 'Template padrão';
  };

  return (
    <div>
      <Select 
        disabled={isLoading} 
        onValueChange={handleTemplateChange} 
        defaultValue={selectedTemplateId}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Selecione um template">
            {getSelectedTemplateDisplayName()}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="default">Template padrão</SelectItem>
          
          {htmlTemplates.length > 0 && (
            <>
              {htmlTemplates.map(template => (
                <SelectItem key={template.id} value={template.id}>
                  {template.name} {template.isDefault ? '(Padrão)' : ''}
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
