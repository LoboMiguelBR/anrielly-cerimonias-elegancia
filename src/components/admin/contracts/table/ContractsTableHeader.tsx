
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from 'lucide-react';

interface ContractsTableHeaderProps {
  totalContracts: number;
  onCreate: () => void;
}

const ContractsTableHeader = ({ totalContracts, onCreate }: ContractsTableHeaderProps) => {
  return (
    <CardHeader>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <CardTitle>Contratos ({totalContracts})</CardTitle>
        <Button onClick={onCreate} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Novo Contrato
        </Button>
      </div>
    </CardHeader>
  );
};

export default ContractsTableHeader;
