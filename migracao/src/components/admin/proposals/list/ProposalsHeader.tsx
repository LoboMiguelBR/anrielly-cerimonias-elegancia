
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';

interface ProposalsHeaderProps {
  onAddNew: () => void;
}

const ProposalsHeader: React.FC<ProposalsHeaderProps> = ({ onAddNew }) => {
  return (
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-medium">Propostas</h3>
      <Button 
        onClick={onAddNew}
        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white"
      >
        <Plus size={16} />
        Nova Proposta
      </Button>
    </div>
  );
};

export default ProposalsHeader;
