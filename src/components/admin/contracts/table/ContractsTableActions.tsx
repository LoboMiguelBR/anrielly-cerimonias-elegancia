
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ContractData } from '../../hooks/contract/types';
import ContractActions from '../ContractActions';
import ContractPDFGenerator from '../pdf/ContractPDFGenerator';
import { Eye, Edit, Trash2, MoreHorizontal, Copy, ExternalLink, Send } from 'lucide-react';
import { useContractActions } from '../actions';

interface ContractsTableActionsProps {
  contract: ContractData;
  onView: (contract: ContractData) => void;
  onEdit: (contract: ContractData) => void;
  onDelete: (contract: ContractData) => void;
  onRefresh?: () => void;
}

const ContractsTableActions = ({
  contract,
  onView,
  onEdit,
  onDelete,
  onRefresh
}: ContractsTableActionsProps) => {
  const {
    copyToClipboard,
    openContractLink,
    openEmailDialog
  } = useContractActions(contract, onRefresh);

  const isSignedContract = contract.status === 'signed';

  return (
    <div className="flex items-center justify-end gap-2">
      {/* Sempre visível: Botão Ver */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onView(contract)}
        title="Visualizar contrato"
        className="h-8 w-8 p-0"
      >
        <Eye className="h-4 w-4" />
      </Button>

      {/* Dropdown com outras ações */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            title="Mais ações"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {/* Ações de Edição */}
          {!isSignedContract && (
            <>
              <DropdownMenuItem onClick={() => onEdit(contract)}>
                <Edit className="h-4 w-4 mr-2" />
                Editar Contrato
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}

          {/* Ações de Compartilhamento */}
          {!isSignedContract && (
            <>
              <DropdownMenuItem onClick={copyToClipboard}>
                <Copy className="h-4 w-4 mr-2" />
                Copiar Link
              </DropdownMenuItem>
              <DropdownMenuItem onClick={openContractLink}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Abrir Contrato
              </DropdownMenuItem>
              <DropdownMenuItem onClick={openEmailDialog}>
                <Send className="h-4 w-4 mr-2" />
                Enviar por Email
              </DropdownMenuItem>
            </>
          )}

          {/* Download PDF para contratos assinados */}
          {isSignedContract && (
            <DropdownMenuItem asChild>
              <div className="flex items-center">
                <ContractPDFGenerator contract={contract} />
              </div>
            </DropdownMenuItem>
          )}

          {/* Ação de Exclusão */}
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={() => onDelete(contract)}
            className="text-red-600 focus:text-red-600"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Excluir Contrato
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* ContractActions para funcionalidades de email (oculto) */}
      <div className="hidden">
        <ContractActions 
          contract={contract} 
          onStatusUpdate={onRefresh}
        />
      </div>
    </div>
  );
};

export default ContractsTableActions;
