
import React from 'react';
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { formatCurrency } from '@/lib/utils';
import { ProposalData } from '../../hooks/proposal';

interface ProposalItemProps {
  proposal: ProposalData;
  onEdit: (proposal: ProposalData) => void;
  onDelete: (proposal: ProposalData) => void;
}

const ProposalItem: React.FC<ProposalItemProps> = ({ 
  proposal, 
  onEdit, 
  onDelete 
}) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Data não definida';
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
  };

  return (
    <TableRow>
      <TableCell className="font-medium">{proposal.client_name}</TableCell>
      <TableCell>{proposal.event_type}</TableCell>
      <TableCell>{formatDate(proposal.event_date)}</TableCell>
      <TableCell>R$ {formatCurrency(proposal.total_price)}</TableCell>
      <TableCell>{proposal.created_at && formatDate(proposal.created_at)}</TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onEdit(proposal)}
            title="Editar proposta"
          >
            <Edit size={16} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onDelete(proposal)}
            className="text-red-500 hover:text-red-700"
            title="Excluir proposta"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default ProposalItem;
