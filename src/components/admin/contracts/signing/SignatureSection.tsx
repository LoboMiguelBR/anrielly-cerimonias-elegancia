
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from 'lucide-react';
import SignatureCanvas from './SignatureCanvas';
import { ContractData } from '../../hooks/contract/types';

interface SignatureSectionProps {
  contract: ContractData;
  signature: string;
  onSignatureChange: (signature: string) => void;
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
              hasDrawnSignature={hasDrawnSignature}
              onHasDrawnSignatureChange={onHasDrawnSignatureChange}
            />
          </div>
        </div>

        {/* Action Button - Fixed at bottom on mobile */}
        <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 -mx-6 -mb-6 mt-6 sm:static sm:border-0 sm:p-0 sm:m-0 z-10">
          <Button
            onClick={onSubmit}
            disabled={!hasDrawnSignature || !clientName.trim() || !clientEmail.trim() || isSubmitting}
            className="w-full h-12 sm:h-10 text-base sm:text-sm bg-rose-600 hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Assinando...
              </>
            ) : (
              'Assinar Contrato'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SignatureSection;
