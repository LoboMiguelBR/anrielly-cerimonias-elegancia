
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Save, X } from 'lucide-react';
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
    <div className="sticky bottom-0 bg-white border-t border-neutral-200 z-10">
      <Card className="rounded-none border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 max-w-4xl mx-auto">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 min-h-[48px] bg-rose-500 hover:bg-rose-600 text-white font-medium transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {initialData ? 'Atualizar Contrato' : 'Criar Contrato'}
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 sm:flex-none min-h-[48px] border-neutral-300 hover:bg-neutral-50 font-medium"
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FormActions;
