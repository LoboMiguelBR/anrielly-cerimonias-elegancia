
import React from 'react';
import LeadSelector from '../selectors/LeadSelector';
import ProfessionalSelector from '../selectors/ProfessionalSelector';

interface LeadProfessionalSelectionProps {
  onLeadSelect: (lead: any) => void;
  onProfessionalSelect: (professional: any) => void;
  selectedLeadId?: string;
  selectedProfessionalId?: string;
}

const LeadProfessionalSelection: React.FC<LeadProfessionalSelectionProps> = ({
  onLeadSelect,
  onProfessionalSelect,
  selectedLeadId,
  selectedProfessionalId
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Selecionar Cliente</h3>
      <LeadSelector 
        onLeadSelect={onLeadSelect}
        selectedLeadId={selectedLeadId}
      />
      
      {/* Seleção de Profissional */}
      <ProfessionalSelector 
        onProfessionalSelect={onProfessionalSelect}
        selectedProfessionalId={selectedProfessionalId}
      />
    </div>
  );
};

export default LeadProfessionalSelection;
