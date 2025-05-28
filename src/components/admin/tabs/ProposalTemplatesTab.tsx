
import React from 'react';
import ProposalTemplatesManager from '../proposals/templates/ProposalTemplatesManager';

const ProposalTemplatesTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="p-6 bg-white rounded-lg shadow-sm border-l-4 border-l-purple-200">
        <div className="mb-6">
          <h2 className="text-2xl font-playfair font-semibold mb-2">
            Templates de Propostas
          </h2>
          <p className="text-gray-500">
            Crie e personalize templates para suas propostas comerciais seguindo o mesmo padrão dos contratos
          </p>
        </div>
        
        <ProposalTemplatesManager />
      </div>
    </div>
  );
};

export default ProposalTemplatesTab;
