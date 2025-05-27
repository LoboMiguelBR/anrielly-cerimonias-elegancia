
import { Badge } from "@/components/ui/badge";
import { ContractStatus } from '../hooks/contract/types';

interface ContractStatusBadgeProps {
  status: ContractStatus;
}

const ContractStatusBadge = ({ status }: ContractStatusBadgeProps) => {
  const getStatusConfig = (status: ContractStatus) => {
    switch (status) {
      case 'draft':
        return { label: 'Rascunho', variant: 'secondary' as const };
      case 'sent':
        return { label: 'Enviado', variant: 'default' as const };
      case 'signed':
        return { label: 'Assinado', variant: 'outline' as const };
      case 'cancelled':
        return { label: 'Cancelado', variant: 'destructive' as const };
      default:
        return { label: 'Desconhecido', variant: 'secondary' as const };
    }
  };

  const { label, variant } = getStatusConfig(status);

  return (
    <Badge variant={variant} className={`text-xs ${status === 'signed' ? 'bg-green-100 text-green-800 border-green-300' : ''}`}>
      {label}
    </Badge>
  );
};

export default ContractStatusBadge;
