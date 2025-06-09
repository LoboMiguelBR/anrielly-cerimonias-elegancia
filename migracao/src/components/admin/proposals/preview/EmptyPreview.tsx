
import React from 'react';
import { ProposalTemplateData } from '../templates/shared/types';
import { PreviewActions } from '.';

interface EmptyPreviewProps {
  template: ProposalTemplateData;
  onBack: () => void;
}

const EmptyPreview: React.FC<EmptyPreviewProps> = ({ template, onBack }) => {
  return (
    <div className="p-12 text-center">
      <p className="text-gray-500">Nenhuma proposta foi gerada ainda.</p>
    </div>
  );
};

export default EmptyPreview;
