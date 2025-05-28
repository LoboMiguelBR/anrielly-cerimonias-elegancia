
import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ContractFormData } from '../../hooks/contract/types';

interface FinancialDataSectionProps {
  register: UseFormRegister<ContractFormData>;
  errors: FieldErrors<ContractFormData>;
}

const FinancialDataSection: React.FC<FinancialDataSectionProps> = ({
  register,
  errors
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Informações Financeiras</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="total_price">Valor Total * (R$)</Label>
          <Input
            id="total_price"
            type="number"
            step="0.01"
            min="0"
            {...register('total_price', { valueAsNumber: true })}
            className={errors.total_price ? 'border-red-500' : ''}
          />
          {errors.total_price && (
            <p className="text-red-500 text-sm mt-1">{errors.total_price.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="down_payment">Valor da Entrada (R$)</Label>
          <Input
            id="down_payment"
            type="number"
            step="0.01"
            min="0"
            {...register('down_payment', { valueAsNumber: true })}
          />
        </div>

        <div>
          <Label htmlFor="down_payment_date">Data da Entrada</Label>
          <Input
            id="down_payment_date"
            type="date"
            {...register('down_payment_date')}
            placeholder="Deixe vazio se não definido"
          />
        </div>

        <div>
          <Label htmlFor="remaining_amount">Valor Restante (R$)</Label>
          <Input
            id="remaining_amount"
            type="number"
            step="0.01"
            min="0"
            {...register('remaining_amount', { valueAsNumber: true })}
            readOnly
            className="bg-gray-50"
          />
        </div>

        <div>
          <Label htmlFor="remaining_payment_date">Data do Saldo</Label>
          <Input
            id="remaining_payment_date"
            type="date"
            {...register('remaining_payment_date')}
            placeholder="Deixe vazio se não definido"
          />
        </div>
      </div>
    </div>
  );
};

export default FinancialDataSection;
