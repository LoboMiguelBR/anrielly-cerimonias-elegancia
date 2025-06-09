
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Hash } from 'lucide-react';
import { ContractData } from '../../../hooks/contract/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ContractVersionInfoProps {
  contract: ContractData;
}

const ContractVersionInfo: React.FC<ContractVersionInfoProps> = ({ contract }) => {
  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  };

  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Hash className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Versão:</span>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                v{contract.version || 1}
              </Badge>
            </div>
            
            {contract.version_timestamp && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-blue-700">
                  Atualizada em {formatDateTime(contract.version_timestamp)}
                </span>
              </div>
            )}
          </div>
          
          <div className="text-xs text-blue-600">
            ID: {contract.id.slice(0, 8)}...
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContractVersionInfo;
