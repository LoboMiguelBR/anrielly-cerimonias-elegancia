
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getVariablesByCategory } from '@/utils/contractVariables';

interface VariablesPanelProps {
  onVariableClick: (variable: string) => void;
}

const VariablesPanel: React.FC<VariablesPanelProps> = ({ onVariableClick }) => {
  const variablesByCategory = getVariablesByCategory();

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Auditoria':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Assinaturas':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Cliente':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Evento':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Financeiro':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Documento':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryDescription = (category: string) => {
    switch (category) {
      case 'Auditoria':
        return 'Dados críticos para validade jurídica';
      case 'Assinaturas':
        return 'Imagens das assinaturas';
      case 'Cliente':
        return 'Informações pessoais do contratante';
      case 'Evento':
        return 'Detalhes do evento contratado';
      case 'Financeiro':
        return 'Valores e prazos de pagamento';
      case 'Documento':
        return 'Informações do documento';
      default:
        return '';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Variáveis Disponíveis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(variablesByCategory).map(([category, variables]) => (
          <div key={category} className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge className={getCategoryColor(category)}>
                {category}
              </Badge>
              {getCategoryDescription(category) && (
                <span className="text-xs text-gray-500">
                  {getCategoryDescription(category)}
                </span>
              )}
            </div>
            
            <div className="grid grid-cols-1 gap-1">
              {variables.map((variable) => (
                <code
                  key={variable}
                  className="bg-gray-100 px-2 py-1 rounded cursor-pointer hover:bg-gray-200 transition-colors text-xs block"
                  onClick={() => onVariableClick(variable)}
                  title={`Clique para inserir ${variable}`}
                >
                  {variable}
                </code>
              ))}
            </div>
          </div>
        ))}
        
        <div className="border-t pt-2 mt-4">
          <p className="text-xs text-gray-500">
            💡 Clique em uma variável para adicioná-la ao template
          </p>
          <p className="text-xs text-red-600 mt-1">
            ⚖️ Variáveis de Auditoria são obrigatórias para validade jurídica
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default VariablesPanel;
