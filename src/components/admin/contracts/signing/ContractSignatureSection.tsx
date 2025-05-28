
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Calendar, MapPin, DollarSign, User, FileText } from 'lucide-react';
import { ContractData } from '../../hooks/contract/types';
import ContractStatusBadge from '../ContractStatusBadge';
import SignatureCanvas from './SignatureCanvas';

interface ContractSignatureSectionProps {
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

const ContractSignatureSection: React.FC<ContractSignatureSectionProps> = ({
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

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Contract Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <FileText className="h-5 w-5" />
            Detalhes do Contrato
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Cliente:</span>
              <span>{contract.client_name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Evento:</span>
              <span>{contract.event_type}</span>
            </div>
            {contract.event_date && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Data:</span>
                <span>{new Date(contract.event_date).toLocaleDateString('pt-BR')}</span>
              </div>
            )}
            {contract.event_location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Local:</span>
                <span>{contract.event_location}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Valor Total:</span>
              <span>R$ {contract.total_price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contract Content */}
      {contract.html_content && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Conteúdo do Contrato</CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className="prose max-w-none text-sm md:text-base"
              dangerouslySetInnerHTML={{ __html: contract.html_content }}
            />
          </CardContent>
        </Card>
      )}

      {/* Signature Section */}
      {!isAlreadySigned ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Assinatura Digital</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 md:space-y-6">
            {/* Client Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="client-name" className="text-sm font-medium">
                  Nome Completo
                </Label>
                <Input
                  id="client-name"
                  value={clientName}
                  onChange={(e) => onClientNameChange(e.target.value)}
                  className="mt-1 h-12 text-base"
                  placeholder="Digite seu nome completo"
                />
              </div>
              <div>
                <Label htmlFor="client-email" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="client-email"
                  type="email"
                  value={clientEmail}
                  onChange={(e) => onClientEmailChange(e.target.value)}
                  className="mt-1 h-12 text-base"
                  placeholder="Digite seu email"
                />
              </div>
            </div>

            <Separator />

            {/* Signature Canvas */}
            <div>
              <Label className="text-sm font-medium mb-2 block">
                Assinatura Digital
              </Label>
              <SignatureCanvas
                onSignatureChange={onSignatureChange}
                hasDrawnSignature={hasDrawnSignature}
                onHasDrawnSignatureChange={onHasDrawnSignatureChange}
              />
            </div>

            {/* Action Button */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 -mx-6 -mb-6 md:static md:border-0 md:p-0 md:m-0">
              <Button
                onClick={onSubmit}
                disabled={!hasDrawnSignature || !clientName.trim() || !clientEmail.trim() || isSubmitting}
                className="w-full h-12 md:h-10 text-base md:text-sm bg-rose-600 hover:bg-rose-700"
              >
                {isSubmitting ? 'Assinando...' : 'Assinar Contrato'}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Contrato Assinado com Sucesso!
            </h3>
            <p className="text-gray-600 mb-4">
              Este contrato foi assinado em {contract.signed_at ? new Date(contract.signed_at).toLocaleString('pt-BR') : ''}
            </p>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Assinado
            </Badge>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ContractSignatureSection;
