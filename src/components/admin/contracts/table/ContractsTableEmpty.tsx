
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';

interface ContractsTableEmptyProps {
  searchTerm: string;
  statusFilter: string;
  onCreate: () => void;
}

const ContractsTableEmpty = ({ searchTerm, statusFilter, onCreate }: ContractsTableEmptyProps) => {
  const hasFilters = searchTerm || statusFilter !== 'all';

  return (
    <div className="text-center py-8">
      <p className="text-gray-500 mb-4">
        {hasFilters 
          ? 'Nenhum contrato encontrado com os filtros aplicados.'
          : 'Nenhum contrato encontrado. Crie seu primeiro contrato!'
        }
      </p>
      {!hasFilters && (
        <Button onClick={onCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Criar Primeiro Contrato
        </Button>
      )}
    </div>
  );
};

export default ContractsTableEmpty;
