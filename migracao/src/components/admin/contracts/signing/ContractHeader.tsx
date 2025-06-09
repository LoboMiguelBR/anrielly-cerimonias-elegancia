
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from 'lucide-react';
import ContractStatusBadge from '../ContractStatusBadge';
import { ContractData } from '../../hooks/contract/types';

interface ContractHeaderProps {
  contract: ContractData;
  isAlreadySigned: boolean;
}

const ContractHeader: React.FC<ContractHeaderProps> = ({ contract, isAlreadySigned }) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header Mobile/Desktop */}
      <div className="text-center mb-4 md:mb-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          {isAlreadySigned ? 'Contrato Assinado' : 'Assinatura de Contrato'}
        </h1>
        <p className="text-sm sm:text-base text-gray-600 px-4">
          {isAlreadySigned 
            ? 'Este contrato já foi assinado com sucesso'
            : 'Revise os detalhes abaixo e assine o contrato'
          }
        </p>
      </div>

      {/* Contract Status Card */}
      <Card className="mb-4 md:mb-6 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg md:text-xl">
              <FileText className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span className="truncate">Status do Contrato</span>
            </CardTitle>
            <div className="flex-shrink-0">
              <ContractStatusBadge status={contract.status} />
            </div>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
};

export default ContractHeader;
