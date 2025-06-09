
import React, { useState, useEffect } from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { proposalTemplatesApi, ProposalTemplateData } from '../../hooks/proposal/api/proposalTemplates';

interface TemplateSelectorProps {
  selectedTemplateId?: string;
  onSelectTemplate: (template: ProposalTemplateData) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ 
  selectedTemplateId,
  onSelectTemplate
}) => {
  const [templates, setTemplates] = useState<ProposalTemplateData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTemplates = async () => {
      setIsLoading(true);
      
      try {
        console.log('Loading proposal templates for selector...');
        const templatesData = await proposalTemplatesApi.fetchProposalTemplates();
        console.log(`Loaded ${templatesData.length} proposal templates:`, 
          templatesData.map(t => ({ id: t.id, name: t.name })));
        
        setTemplates(templatesData);
        
        // Auto-select default template if none selected
        if (!selectedTemplateId && templatesData.length > 0) {
          const defaultTemplate = templatesData.find(t => t.is_default) || templatesData[0];
          onSelectTemplate(defaultTemplate);
        }
      } catch (error) {
        console.error('Error loading templates:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTemplates();
  }, [selectedTemplateId, onSelectTemplate]);

  const handleTemplateChange = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      onSelectTemplate(template);
    }
  };

  const getSelectedTemplateDisplayName = () => {
    if (isLoading) {
      return 'Carregando templates...';
    }
    
    if (!selectedTemplateId) {
      return 'Selecione um template';
    }
    
    const template = templates.find(t => t.id === selectedTemplateId);
    return template ? `${template.name}${template.is_default ? ' (Padrão)' : ''}` : 'Template não encontrado';
  };

  return (
    <div>
      <Select 
        disabled={isLoading} 
        onValueChange={handleTemplateChange} 
        value={selectedTemplateId || ''}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Selecione um template">
            {getSelectedTemplateDisplayName()}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {templates.length > 0 ? (
            templates.map(template => (
              <SelectItem key={template.id} value={template.id}>
                {template.name} {template.is_default ? '(Padrão)' : ''}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="no-templates" disabled>
              Nenhum template encontrado
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default TemplateSelector;
