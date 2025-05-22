
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface TemplateHeaderProps {
  onCreateNew: () => void;
}

const TemplateHeader: React.FC<TemplateHeaderProps> = ({ onCreateNew }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-2xl font-bold">Templates HTML</h2>
        <p className="text-gray-500">
          Gerencie os templates HTML para propostas
        </p>
      </div>
      
      <Button onClick={onCreateNew} className="flex items-center">
        <PlusCircle className="mr-2 h-4 w-4" />
        Novo Template
      </Button>
    </div>
  );
};

export default TemplateHeader;
