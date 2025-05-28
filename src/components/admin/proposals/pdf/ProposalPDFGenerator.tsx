
import React from 'react';
import { ProposalData } from '../../hooks/proposal/types';
import { ProposalTemplateData } from '../../hooks/proposal/api/proposalTemplates';

interface ProposalPDFGeneratorProps {
  proposal: ProposalData;
  template?: ProposalTemplateData;
  onPdfReady: (blob: Blob) => void;
  onError: (error: string) => void;
}

const ProposalPDFGenerator: React.FC<ProposalPDFGeneratorProps> = ({
  proposal,
  template,
  onPdfReady,
  onError
}) => {
  return (
    <div className="border rounded-lg p-4">
      <p className="text-gray-600">Gerador de PDF da Proposta em desenvolvimento...</p>
      <pre className="mt-4 text-xs bg-gray-100 p-2 rounded">
        {JSON.stringify({ proposal: proposal.client_name, template: template?.name }, null, 2)}
      </pre>
    </div>
  );
};

export default ProposalPDFGenerator;
