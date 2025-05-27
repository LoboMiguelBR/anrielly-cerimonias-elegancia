
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ContractData } from '../../hooks/contract/types';
import ContractStatusBadge from '../ContractStatusBadge';
import ContractActions from '../ContractActions';
import ContractPDFGenerator from '../pdf/ContractPDFGenerator';
import { Eye, Edit, Trash2 } from 'lucide-react';

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
    <TableRow key={contract.id}>
      <TableCell>
        <div>
          <p className="font-medium">{contract.client_name}</p>
          <p className="text-sm text-gray-500">{contract.client_email}</p>
        </div>
      </TableCell>
      <TableCell>
        <div>
          <p className="font-medium">{contract.event_type}</p>
          <p className="text-sm text-gray-500">{contract.event_location}</p>
        </div>
      </TableCell>
      <TableCell>
        {contract.event_date ? (
          <div>
            <p>{new Date(contract.event_date).toLocaleDateString('pt-BR')}</p>
            {contract.event_time && (
              <p className="text-sm text-gray-500">{contract.event_time}</p>
            )}
          </div>
        ) : (
          <span className="text-gray-400">-</span>
        )}
      </TableCell>
      <TableCell>
        <p className="font-medium">
          {new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }).format(contract.total_price)}
        </p>
      </TableCell>
      <TableCell>
        <ContractStatusBadge status={contract.status} />
      </TableCell>
      <TableCell>
        {new Date(contract.created_at).toLocaleDateString('pt-BR')}
      </TableCell>
      <TableCell>
        <div className="flex items-center justify-end gap-2 flex-wrap">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onView(contract)}
            title="Visualizar"
          >
            <Eye className="h-4 w-4" />
          </Button>
          
          {contract.status !== 'signed' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(contract)}
              title="Editar"
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
          
          {contract.status === 'signed' && (
            <ContractPDFGenerator contract={contract} />
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(contract)}
            title="Excluir"
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          
          <ContractActions 
            contract={contract} 
            onStatusUpdate={onRefresh}
          />
        </div>
      </TableCell>
    </TableRow>
  );
};

export default ContractsTableRow;
