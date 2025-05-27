
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink, Send } from 'lucide-react';
import { ContractData } from '../../hooks/contract/types';

interface ContractActionButtonsProps {
  contract: ContractData;
  onCopyToClipboard: () => void;
  onOpenContractLink: () => void;
  onOpenEmailDialog: () => void;
}

const ContractActionButtons = ({ 
  contract, 
  onCopyToClipboard, 
  onOpenContractLink,
  onOpenEmailDialog 
}: ContractActionButtonsProps) => {
  if (contract.status === 'signed') {
    return null;
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onCopyToClipboard}
        title="Copiar link do contrato"
      >
        <Copy className="h-4 w-4" />
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onOpenContractLink}
        title="Abrir contrato"
      >
        <ExternalLink className="h-4 w-4" />
      </Button>
      
      <Button
        size="sm" 
        onClick={onOpenEmailDialog}
        title="Enviar contrato por email"
      >
        <Send className="h-4 w-4 mr-2" />
        Enviar Email
      </Button>
    </div>
  );
};

export default ContractActionButtons;
