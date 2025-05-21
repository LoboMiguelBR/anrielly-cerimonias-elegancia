
import React from 'react';
import { ProposalTemplateData } from '../../proposals/templates/shared/types';
import TemplateSelector from '../templates/TemplateSelector';

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
  return (
    <div className="border-b pb-4 mb-6">
      <h3 className="text-xl font-medium mb-4">
        {isEditMode ? 'Editar Proposta' : 'Nova Proposta'}
      </h3>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Template da Proposta</label>
        <TemplateSelector 
          selectedTemplateId={templateId || 'default'} 
          onSelectTemplate={onTemplateChange}
        />
      </div>
    </div>
  );
};

export default GeneratorHeader;
