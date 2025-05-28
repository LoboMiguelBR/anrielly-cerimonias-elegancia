
import React from 'react';
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Mail, 
  Clock, 
  FileSignature, 
  CheckCircle2,
  Copy,
  ExternalLink 
} from 'lucide-react';
import { ContractData } from '../../hooks/contract/types';

interface ContractEmailActionButtonsProps {
  contract: ContractData;
  onCopyToClipboard: () => void;
  onOpenContractLink: () => void;
  onSendReminder: () => void;
  onSendSignatureRequest: () => void;
  onSendConfirmation: () => void;
}

const ContractEmailActionButtons: React.FC<ContractEmailActionButtonsProps> = ({
  contract,
  onCopyToClipboard,
  onOpenContractLink,
  onSendReminder,
  onSendSignatureRequest,
  onSendConfirmation
}) => {
  const getEmailActions = () => {
    switch (contract.status) {
      case 'draft':
        return [
          {
            icon: FileSignature,
            label: 'Enviar para Assinatura',
            action: onSendSignatureRequest,
            variant: 'default' as const,
            className: 'bg-blue-600 hover:bg-blue-700'
          }
        ];
      
      case 'pending':
        return [
          {
            icon: Clock,
            label: 'Enviar Lembrete',
            action: onSendReminder,
            variant: 'outline' as const,
            className: 'border-yellow-300 text-yellow-700 hover:bg-yellow-50'
          },
          {
            icon: FileSignature,
            label: 'Reenviar Link de Assinatura',
            action: onSendSignatureRequest,
            variant: 'default' as const,
            className: 'bg-blue-600 hover:bg-blue-700'
          }
        ];
      
      case 'signed':
        return [
          {
            icon: CheckCircle2,
            label: 'Enviar Confirmação',
            action: onSendConfirmation,
            variant: 'outline' as const,
            className: 'border-green-300 text-green-700 hover:bg-green-50'
          }
        ];
      
      default:
        return [];
    }
  };

  const emailActions = getEmailActions();

  return (
    <TooltipProvider>
      <div className="flex gap-2">
        {/* Ações de Email */}
        {emailActions.map((emailAction, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <Button
                variant={emailAction.variant}
                size="sm"
                onClick={emailAction.action}
                className={emailAction.className}
              >
                <emailAction.icon className="h-4 w-4 mr-2" />
                {emailAction.label}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{emailAction.label}</p>
            </TooltipContent>
          </Tooltip>
        ))}

        {/* Ações Gerais */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm" onClick={onCopyToClipboard}>
              <Copy className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Copiar Link</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm" onClick={onOpenContractLink}>
              <ExternalLink className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Abrir Contrato</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};

export default ContractEmailActionButtons;
