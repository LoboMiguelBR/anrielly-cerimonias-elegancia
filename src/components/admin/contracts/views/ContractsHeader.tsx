
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";

interface ContractsHeaderProps {
  onCreate?: () => void;
  onRefresh?: () => void;
}

const ContractsHeader = ({ onCreate, onRefresh }: ContractsHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Contratos</h1>
        <p className="text-gray-600 mt-1">
          Gerencie todos os contratos digitais dos seus clientes
        </p>
      </div>
      
      <div className="flex gap-2">
        {onRefresh && (
          <Button
            variant="outline"
            onClick={onRefresh}
            title="Atualizar lista"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        )}
        
        {onCreate && (
          <Button onClick={onCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Contrato
          </Button>
        )}
      </div>
    </div>
  );
};

export default ContractsHeader;
