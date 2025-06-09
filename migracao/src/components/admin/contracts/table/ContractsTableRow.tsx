
import { TableCell, TableRow } from "@/components/ui/table";
import { ContractData } from '../../hooks/contract/types';
import ContractStatusBadge from '../ContractStatusBadge';
import ContractsTableActions from './ContractsTableActions';

interface ContractsTableRowProps {
  contract: ContractData;
  onView: (contract: ContractData) => void;
  onEdit: (contract: ContractData) => void;
  onDownload: (contract: ContractData) => void;
  onDelete: (contract: ContractData) => void;
  onRefresh?: () => void;
}

const ContractsTableRow = ({
  contract,
  onView,
  onEdit,
  onDownload,
  onDelete,
  onRefresh
}: ContractsTableRowProps) => {
  return (
    <TableRow key={contract.id} className="hover:bg-gray-50/50">
      <TableCell className="py-3">
        <div className="min-w-[180px]">
          <p className="font-medium text-gray-900 truncate">{contract.client_name}</p>
          <p className="text-sm text-gray-500 truncate">{contract.client_email}</p>
        </div>
      </TableCell>
      <TableCell className="py-3">
        <div className="min-w-[160px]">
          <p className="font-medium text-gray-900 truncate">{contract.event_type}</p>
          <p className="text-sm text-gray-500 truncate">{contract.event_location}</p>
        </div>
      </TableCell>
      <TableCell className="py-3">
        <div className="min-w-[120px]">
          {contract.event_date ? (
            <>
              <p className="text-gray-900">{new Date(contract.event_date).toLocaleDateString('pt-BR')}</p>
              {contract.event_time && (
                <p className="text-sm text-gray-500">{contract.event_time}</p>
              )}
            </>
          ) : (
            <span className="text-gray-400">-</span>
          )}
        </div>
      </TableCell>
      <TableCell className="py-3">
        <div className="min-w-[100px]">
          <p className="font-medium text-gray-900">
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(contract.total_price)}
          </p>
        </div>
      </TableCell>
      <TableCell className="py-3">
        <div className="min-w-[120px]">
          <ContractStatusBadge status={contract.status} />
        </div>
      </TableCell>
      <TableCell className="py-3">
        <div className="min-w-[100px]">
          <p className="text-gray-900">
            {new Date(contract.created_at).toLocaleDateString('pt-BR')}
          </p>
        </div>
      </TableCell>
      <TableCell className="py-3">
        <div className="w-[100px] flex justify-end">
          <ContractsTableActions
            contract={contract}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
            onRefresh={onRefresh}
          />
        </div>
      </TableCell>
    </TableRow>
  );
};

export default ContractsTableRow;
