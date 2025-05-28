
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
    <div className="overflow-x-auto border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50/50">
            <TableHead className="font-semibold text-gray-700 w-[200px]">
              Cliente
            </TableHead>
            <TableHead className="font-semibold text-gray-700 w-[180px]">
              Evento
            </TableHead>
            <TableHead className="font-semibold text-gray-700 w-[140px]">
              Data
            </TableHead>
            <TableHead className="font-semibold text-gray-700 w-[120px]">
              Valor
            </TableHead>
            <TableHead className="font-semibold text-gray-700 w-[140px]">
              Status
            </TableHead>
            <TableHead className="font-semibold text-gray-700 w-[120px]">
              Criado em
            </TableHead>
            <TableHead className="font-semibold text-gray-700 w-[100px] text-right">
              Ações
            </TableHead>
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
