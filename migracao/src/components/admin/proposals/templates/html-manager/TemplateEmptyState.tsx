
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, PlusCircle } from 'lucide-react';

interface TemplateEmptyStateProps {
  onCreateNew: () => void;
}

const TemplateEmptyState: React.FC<TemplateEmptyStateProps> = ({ onCreateNew }) => {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <FileText className="h-16 w-16 text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-700 mb-2">Nenhum template encontrado</h3>
        <p className="text-gray-500 mb-4 text-center">
          Crie seu primeiro template HTML para propostas
        </p>
        <Button onClick={onCreateNew}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Criar Template
        </Button>
      </CardContent>
    </Card>
  );
};

export default TemplateEmptyState;
