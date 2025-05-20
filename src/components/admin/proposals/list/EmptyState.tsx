
import React from 'react';
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onAddNew: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onAddNew }) => {
  return (
    <div className="bg-gray-50 border rounded-md p-8 text-center">
      <p className="text-gray-500">Nenhuma proposta encontrada</p>
      <Button 
        variant="outline" 
        className="mt-4"
        onClick={onAddNew}
      >
        Criar primeira proposta
      </Button>
    </div>
  );
};

export default EmptyState;
