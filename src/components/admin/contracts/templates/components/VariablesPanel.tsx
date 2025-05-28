
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAvailableVariables } from '@/utils/contractVariables';

interface VariablesPanelProps {
  onVariableClick: (variable: string) => void;
}

const VariablesPanel: React.FC<VariablesPanelProps> = ({ onVariableClick }) => {
  const availableVariables = getAvailableVariables();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Variáveis Disponíveis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 text-xs">
          {availableVariables.map((variable) => (
            <code
              key={variable}
              className="bg-gray-100 px-2 py-1 rounded cursor-pointer hover:bg-gray-200 transition-colors"
              onClick={() => onVariableClick(variable)}
            >
              {variable}
            </code>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Clique em uma variável para adicioná-la ao conteúdo HTML
        </p>
      </CardContent>
    </Card>
  );
};

export default VariablesPanel;
