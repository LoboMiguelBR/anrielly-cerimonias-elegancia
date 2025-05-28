
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Eye } from 'lucide-react';
import SignatureCanvas from './SignatureCanvas';
import { ContractData } from '../../hooks/contract/types';

interface SignatureSectionProps {
  contract: ContractData;
  signature: string;
  onSignatureChange: (signature: string) => void;
  signatureUrl: string;
  onSignatureUrlChange: (url: string) => void;
  hasDrawnSignature: boolean;
  onHasDrawnSignatureChange: (hasDrawn: boolean) => void;
  clientName: string;
  onClientNameChange: (name: string) => void;
  clientEmail: string;
  onClientEmailChange: (email: string) => void;
  isSubmitting: boolean;
  onSubmit: () => Promise<void>;
}

const SignatureSection: React.FC<SignatureSectionProps> = ({
  contract,
  signature,
  onSignatureChange,
  signatureUrl,
  onSignatureUrlChange,
  hasDrawnSignature,
  onHasDrawnSignatureChange,
  clientName,
  onClientNameChange,
  clientEmail,
  onClientEmailChange,
  isSubmitting,
  onSubmit
}) => {
  const isAlreadySigned = contract.status === 'signed';
  const canPreview = hasDrawnSignature && signatureUrl && clientName.trim() && clientEmail.trim();

  if (isAlreadySigned) {
    return (
      <Card className="shadow-sm">
        <CardContent className="text-center py-6 sm:py-8">
          <CheckCircle className="h-12 w-12 sm:h-16 sm:w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
            Contrato Assinado com Sucesso!
          </h3>
          <p className="text-sm sm:text-base text-gray-600 mb-4 px-4">
            Este contrato foi assinado em {contract.signed_at ? new Date(contract.signed_at).toLocaleString('pt-BR') : ''}
          </p>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-3 py-1">
            Assinado
          </Badge>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base sm:text-lg md:text-xl">
          Assinatura Digital
        </CardTitle>
        <p className="text-sm text-gray-600">
          Desenhe sua assinatura e visualize o contrato antes de confirmar
        </p>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6 pt-0">
        {/* Client Information */}
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="client-name" className="text-sm font-medium">
              Nome Completo
            </Label>
            <Input
              id="client-name"
              value={clientName}
              onChange={(e) => onClientNameChange(e.target.value)}
              className="h-12 text-base"
              placeholder="Digite seu nome completo"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="client-email" className="text-sm font-medium">
              Email
            </Label>
            <Input
              id="client-email"
              type="email"
              value={clientEmail}
              onChange={(e) => onClientEmailChange(e.target.value)}
              className="h-12 text-base"
              placeholder="Digite seu email"
            />
          </div>
        </div>

        <Separator className="my-4" />

        {/* Signature Canvas */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Assinatura Digital
          </Label>
          <div className="relative">
            <SignatureCanvas
              onSignatureChange={onSignatureChange}
              onSignatureUrlChange={onSignatureUrlChange}
              hasDrawnSignature={hasDrawnSignature}
              onHasDrawnSignatureChange={onHasDrawnSignatureChange}
              contractId={contract.id}
            />
          </div>
        </div>

        {/* Information Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Eye className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 mb-1">
                Processo de Assinatura em 2 Etapas
              </h4>
              <p className="text-sm text-blue-800">
                1. Desenhe sua assinatura e clique em "Visualizar Contrato"<br/>
                2. Revise o documento completo e confirme sua assinatura
              </p>
            </div>
          </div>
        </div>

        {/* Validation Message */}
        {hasDrawnSignature && !signatureUrl && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-700">
              ⚠️ Por favor, clique em "Salvar Assinatura" antes de continuar
            </p>
          </div>
        )}

        {/* Action Button - Fixed at bottom on mobile */}
        <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 -mx-6 -mb-6 mt-6 sm:static sm:border-0 sm:p-0 sm:m-0 z-10">
          <Button
            onClick={onSubmit}
            disabled={!canPreview || isSubmitting}
            className={`w-full h-12 sm:h-10 text-base sm:text-sm transition-all ${
              canPreview 
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Salvando...
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-2" />
                Visualizar Contrato
              </>
            )}
          </Button>
          
          {!canPreview && (
            <p className="text-xs text-gray-500 text-center mt-2">
              {!hasDrawnSignature 
                ? 'Desenhe sua assinatura' 
                : !signatureUrl 
                ? 'Salve sua assinatura' 
                : 'Preencha todos os campos'}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SignatureSection;
