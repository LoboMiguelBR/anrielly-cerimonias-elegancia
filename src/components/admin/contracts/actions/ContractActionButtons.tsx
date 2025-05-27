
import { Button } from "@/components/ui/button";
import { Copy, Link, ExternalLink } from 'lucide-react';
import { ContractData } from '../../hooks/contract/types';

interface ContractActionButtonsProps {
  contract: ContractData;
  onCopyToClipboard: () => void;
  onOpenContractLink: () => void;
}

const ContractActionButtons = ({
  contract,
  onCopyToClipboard,
  onOpenContractLink
}: ContractActionButtonsProps) => {
  if (contract.status === 'signed') {
    return (
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={onOpenContractLink} title="Abrir contrato assinado">
          <ExternalLink className="h-4 w-4 mr-2" />
          Ver Assinado
        </Button>
        <Button variant="outline" size="sm" onClick={onCopyToClipboard} title="Copiar link">
          <Copy className="h-4 w-4 mr-2" />
          Copiar Link
        </Button>
      </div>
    );
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={onOpenContractLink} title="Abrir link público">
        <ExternalLink className="h-4 w-4 mr-2" />
        Abrir Link
      </Button>
      
      <Button variant="outline" size="sm" onClick={onCopyToClipboard} title="Copiar link público">
        <Link className="h-4 w-4 mr-2" />
        Copiar Link
      </Button>
    </>
  );
};

export default ContractActionButtons;
