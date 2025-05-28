
import React from 'react';
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react';
import { ContractData } from '../../hooks/contract/types';

interface FormActionsProps {
  initialData?: ContractData;
  isLoading: boolean;
  onCancel: () => void;
}

const FormActions: React.FC<FormActionsProps> = ({
  initialData,
  isLoading,
  onCancel
}) => {
  return (
    <div className="flex gap-4 pt-6">
      <Button
        type="submit"
        disabled={isLoading}
        className="flex-1"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Salvando...
          </>
        ) : (
          initialData ? 'Atualizar Contrato' : 'Criar Contrato'
        )}
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isLoading}
      >
        Cancelar
      </Button>
    </div>
  );
};

export default FormActions;
