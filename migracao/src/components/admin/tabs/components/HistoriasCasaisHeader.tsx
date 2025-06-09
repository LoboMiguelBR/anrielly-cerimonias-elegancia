
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface HistoriasCasaisHeaderProps {
  onRefresh: () => void;
}

const HistoriasCasaisHeader = ({ onRefresh }: HistoriasCasaisHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Histórias dos Casais (IA)</h2>
        <p className="text-gray-600">Gerencie e visualize as histórias criadas pela IA</p>
      </div>
      <Button onClick={onRefresh} variant="outline">
        <RefreshCw className="w-4 h-4 mr-2" />
        Atualizar
      </Button>
    </div>
  );
};

export default HistoriasCasaisHeader;
