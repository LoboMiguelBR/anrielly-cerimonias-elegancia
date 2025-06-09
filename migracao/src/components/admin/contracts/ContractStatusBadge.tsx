
import { Badge } from "@/components/ui/badge";
import { ContractStatus } from '../hooks/contract/types';

interface ContractStatusBadgeProps {
  status: ContractStatus;
}

const ContractStatusBadge = ({ status }: ContractStatusBadgeProps) => {
  const getStatusConfig = (status: ContractStatus) => {
    switch (status) {
      case 'signed':
        return { label: 'Assinado', variant: 'default' as const, className: 'bg-green-100 text-green-800' };
      case 'sent':
        return { label: 'Enviado', variant: 'secondary' as const, className: 'bg-yellow-100 text-yellow-800' };
      case 'draft':
        return { label: 'Rascunho', variant: 'outline' as const, className: 'bg-gray-100 text-gray-800' };
      case 'cancelled':
        return { label: 'Cancelado', variant: 'destructive' as const, className: 'bg-red-100 text-red-800' };
      case 'expired':
        return { label: 'Expirado', variant: 'destructive' as const, className: 'bg-red-100 text-red-800' };
      default:
        return { label: 'Desconhecido', variant: 'outline' as const, className: 'bg-gray-100 text-gray-800' };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  );
};

export default ContractStatusBadge;
