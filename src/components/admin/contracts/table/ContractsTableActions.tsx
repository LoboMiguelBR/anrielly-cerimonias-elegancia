
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
import { Eye, Edit, Trash2, MoreHorizontal, Copy, ExternalLink, Send, Download, FileText } from 'lucide-react';
import { useContractActions } from '../actions';
import { useState } from 'react';

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
  const [pdfRef, setPdfRef] = useState<{ generatePDF: () => void; viewPDF: () => void } | null>(null);
  
  const {
    copyToClipboard,
    openContractLink,
    openEmailDialog
  } = useContractActions(contract, onRefresh);

  const isSignedContract = contract.status === 'signed';

  const handleDownloadPDF = () => {
    if (pdfRef) {
      pdfRef.generatePDF();
    }
  };

  const handleViewPDF = () => {
    if (pdfRef) {
      pdfRef.viewPDF();
    }
  };

  return (
    <div className="flex items-center justify-end gap-2">
      {/* Botão Ver - sempre visível */}
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
        <DropdownMenuContent align="end" className="w-48 bg-white border shadow-lg z-50">
          {/* Ações para contratos não-assinados */}
          {!isSignedContract && (
            <>
              <DropdownMenuItem onClick={() => onEdit(contract)} className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-50">
                <Edit className="h-4 w-4" />
                <span>Editar Contrato</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={copyToClipboard} className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-50">
                <Copy className="h-4 w-4" />
                <span>Copiar Link</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={openContractLink} className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-50">
                <ExternalLink className="h-4 w-4" />
                <span>Abrir Contrato</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={openEmailDialog} className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-50">
                <Send className="h-4 w-4" />
                <span>Enviar por Email</span>
              </DropdownMenuItem>
            </>
          )}

          {/* Ações para contratos assinados */}
          {isSignedContract && (
            <>
              <DropdownMenuItem onClick={handleViewPDF} className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-50">
                <FileText className="h-4 w-4" />
                <span>Ver PDF</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDownloadPDF} className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-50">
                <Download className="h-4 w-4" />
                <span>Download PDF</span>
              </DropdownMenuItem>
            </>
          )}

          {/* Ação de exclusão - sempre presente */}
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={() => onDelete(contract)}
            className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-red-50 text-red-600 focus:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
            <span>Excluir Contrato</span>
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

      {/* ContractPDFGenerator oculto para uso interno */}
      <div className="hidden">
        <ContractPDFGenerator
          contract={contract}
          compact={true}
          ref={(ref: any) => {
            if (ref) {
              setPdfRef({
                generatePDF: ref.generatePDF,
                viewPDF: ref.viewPDF
              });
            }
          }}
        />
      </div>
    </div>
  );
};

export default ContractsTableActions;
