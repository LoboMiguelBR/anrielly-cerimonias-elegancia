
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { ProposalData } from '../../hooks/proposal';
import ProposalItem from './ProposalItem';

interface ProposalsTableProps {
  proposals: ProposalData[];
  onEdit: (proposal: ProposalData) => void;
  onDelete: (proposal: ProposalData) => void;
}

const ProposalsTable: React.FC<ProposalsTableProps> = ({ 
  proposals, 
  onEdit, 
  onDelete 
}) => {
  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cliente</TableHead>
            <TableHead>Tipo de Evento</TableHead>
            <TableHead>Data do Evento</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Criada em</TableHead>
            <TableHead className="w-[100px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {proposals.map((proposal) => (
            <ProposalItem
              key={proposal.id}
              proposal={proposal}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProposalsTable;
