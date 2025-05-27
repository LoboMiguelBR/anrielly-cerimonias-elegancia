
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ContractData } from '../../hooks/contract/types';
import ContractsTableRow from './ContractsTableRow';

interface ContractsTableContentProps {
  contracts: ContractData[];
  onView: (contract: ContractData) => void;
  onEdit: (contract: ContractData) => void;
  onDownload: (contract: ContractData) => void;
  onDelete: (contract: ContractData) => void;
  onRefresh?: () => void;
}

const ContractsTableContent = ({
  contracts,
  onView,
  onEdit,
  onDownload,
  onDelete,
  onRefresh
}: ContractsTableContentProps) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cliente</TableHead>
            <TableHead>Evento</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Criado em</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contracts.map((contract) => (
            <ContractsTableRow
              key={contract.id}
              contract={contract}
              onView={onView}
              onEdit={onEdit}
              onDownload={onDownload}
              onDelete={onDelete}
              onRefresh={onRefresh}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ContractsTableContent;
