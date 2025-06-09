
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Users, Search } from 'lucide-react';
import LeadSelector from '../selectors/LeadSelector';
import ProfessionalSelector from '../selectors/ProfessionalSelector';
import ProfessionalPreview from './components/ProfessionalPreview';

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
  const [selectedProfessional, setSelectedProfessional] = useState<any>(null);

  const handleProfessionalSelect = (professional: any) => {
    setSelectedProfessional(professional);
    onProfessionalSelect(professional);
  };

  return (
    <Card className="border-neutral-200 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Search className="h-5 w-5 text-purple-600" />
          Selecionar Cliente e Profissional
        </CardTitle>
        <Separator />
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-1">
            <Users className="h-4 w-4" />
            Cliente
          </h4>
          <LeadSelector 
            onLeadSelect={onLeadSelect}
            selectedLeadId={selectedLeadId}
          />
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-1">
            <Users className="h-4 w-4" />
            Profissional Responsável
          </h4>
          <ProfessionalSelector 
            onProfessionalSelect={handleProfessionalSelect}
            selectedProfessionalId={selectedProfessionalId}
          />
          
          {selectedProfessional && (
            <div className="mt-4">
              <ProfessionalPreview professional={selectedProfessional} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LeadProfessionalSelection;
