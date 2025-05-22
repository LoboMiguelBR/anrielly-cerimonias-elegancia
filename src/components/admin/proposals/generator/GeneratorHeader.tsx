
import React, { useEffect, useState } from 'react';
import { ProposalTemplateData } from '../templates/shared/types';
import TemplateSelector from '../templates/TemplateSelector';
import { HtmlTemplateData } from '../templates/html-editor/types';
import { fetchHtmlTemplateById } from '../templates/html-editor/templateHtmlService';

interface GeneratorHeaderProps {
  isEditMode: boolean;
  templateId: string | undefined;
  onTemplateChange: (template: ProposalTemplateData) => void;
}

const GeneratorHeader: React.FC<GeneratorHeaderProps> = ({ 
  isEditMode, 
  templateId, 
  onTemplateChange 
}) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(templateId || 'default');

  useEffect(() => {
    // Check if the template ID is for an HTML template
    const loadHtmlTemplate = async () => {
      if (templateId && !templateId.startsWith('html_')) {
        // Try to fetch HTML template
        try {
          const htmlTemplate = await fetchHtmlTemplateById(templateId);
          if (htmlTemplate) {
            // Convert to the format expected by ProposalGenerator
            const htmlAsProposalTemplate: ProposalTemplateData = {
              id: htmlTemplate.id,
              name: htmlTemplate.name,
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
              htmlTemplate: htmlTemplate
            };
            
            onTemplateChange(htmlAsProposalTemplate);
            setSelectedTemplateId(`html_${htmlTemplate.id}`);
          }
        } catch (error) {
          console.error('Error loading HTML template:', error);
        }
      }
    };
    
    if (templateId) {
      loadHtmlTemplate();
    }
  }, [templateId, onTemplateChange]);

  return (
    <div className="border-b pb-4 mb-6">
      <h3 className="text-xl font-medium mb-4">
        {isEditMode ? 'Editar Proposta' : 'Nova Proposta'}
      </h3>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Template da Proposta</label>
        <TemplateSelector 
          selectedTemplateId={selectedTemplateId} 
          onSelectTemplate={(template) => {
            onTemplateChange(template);
            setSelectedTemplateId(template.isHtmlTemplate ? `html_${template.id}` : template.id);
          }}
        />
      </div>
    </div>
  );
};

export default GeneratorHeader;
