
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, CheckCircle, Edit } from 'lucide-react';
import { ContractData } from '../../hooks/contract/types';
import ContractContent from './ContractContent';

interface ContractPreviewProps {
  contract: ContractData;
  onConfirmSignature: () => Promise<void>;
  onEditSignature: () => void;
  isSubmitting: boolean;
}

const ContractPreview: React.FC<ContractPreviewProps> = ({
  contract,
  onConfirmSignature,
  onEditSignature,
  isSubmitting
}) => {
  const hasPreviewSignature = contract.preview_signature_url && contract.status === 'draft_signed';

  if (!hasPreviewSignature) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Preview Header */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Eye className="h-6 w-6 text-blue-600" />
              <div>
                <CardTitle className="text-lg text-blue-900">
                  Pré-visualização do Contrato
                </CardTitle>
                <p className="text-sm text-blue-700 mt-1">
                  Revise como ficará seu contrato antes de assinar definitivamente
                </p>
              </div>
            </div>
            <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
              <Eye className="h-3 w-3 mr-1" />
              Pré-visualização
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">!</span>
              </div>
              <div>
                <h4 className="font-medium text-yellow-800 mb-1">
                  Atenção: Esta é apenas uma pré-visualização
                </h4>
                <p className="text-sm text-yellow-700">
                  Sua assinatura foi salva temporariamente. Revise o contrato completo abaixo e, 
                  se estiver tudo correto, clique em "Confirmar Assinatura" para finalizar o processo.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contract Content with Preview Signature */}
      <ContractContent contract={contract} />

      {/* Action Buttons */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="py-6">
          <div className="text-center space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-green-900 mb-2">
                Revisar e Confirmar Assinatura
              </h3>
              <p className="text-sm text-green-700 mb-4">
                Se o contrato estiver correto, confirme sua assinatura para finalizar o processo.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={onEditSignature}
                variant="outline"
                className="flex items-center gap-2 border-blue-300 text-blue-700 hover:bg-blue-100"
              >
                <Edit className="h-4 w-4" />
                Editar Assinatura
              </Button>
              
              <Button
                onClick={onConfirmSignature}
                disabled={isSubmitting}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-3"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Confirmando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Confirmar Assinatura
                  </>
                )}
              </Button>
            </div>
            
            <p className="text-xs text-green-600">
              Ao confirmar, seu contrato será assinado definitivamente e você receberá uma cópia por email.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContractPreview;
