
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Calendar, MapPin, DollarSign, FileText } from 'lucide-react';
import { ContractData } from '../../hooks/contract/types';

interface ContractDetailsProps {
  contract: ContractData;
}

const ContractDetails: React.FC<ContractDetailsProps> = ({ contract }) => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg md:text-xl">
          <FileText className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
          Detalhes do Contrato
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 gap-3 sm:gap-4 text-sm sm:text-base">
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <User className="h-4 w-4 text-gray-500 flex-shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <span className="font-medium text-gray-700">Cliente:</span>
              <p className="text-gray-900 break-words">{contract.client_name}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <Calendar className="h-4 w-4 text-gray-500 flex-shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <span className="font-medium text-gray-700">Evento:</span>
              <p className="text-gray-900 break-words">{contract.event_type}</p>
            </div>
          </div>

          {contract.event_date && (
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <Calendar className="h-4 w-4 text-gray-500 flex-shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <span className="font-medium text-gray-700">Data:</span>
                <p className="text-gray-900">{new Date(contract.event_date).toLocaleDateString('pt-BR')}</p>
              </div>
            </div>
          )}

          {contract.event_location && (
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <span className="font-medium text-gray-700">Local:</span>
                <p className="text-gray-900 break-words">{contract.event_location}</p>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
            <DollarSign className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <span className="font-medium text-green-700">Valor Total:</span>
              <p className="text-green-900 font-semibold">
                R$ {contract.total_price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContractDetails;
