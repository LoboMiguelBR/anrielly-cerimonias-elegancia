
import React, { useState, useEffect } from 'react';
import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DollarSign, Calculator, Calendar } from 'lucide-react';
import { ContractFormData } from '../../hooks/contract/types';
import { useMoneyFormat } from './hooks/useMoneyFormat';
import FinancialTooltip from './components/FinancialTooltip';

interface FinancialDataSectionProps {
  register: UseFormRegister<ContractFormData>;
  errors: FieldErrors<ContractFormData>;
  watch: UseFormWatch<ContractFormData>;
  setValue: UseFormSetValue<ContractFormData>;
}

const FinancialDataSection: React.FC<FinancialDataSectionProps> = ({
  register,
  errors,
  watch,
  setValue
}) => {
  const { formatMoney, parseMoney } = useMoneyFormat();
  const [totalPriceDisplay, setTotalPriceDisplay] = useState('');
  const [downPaymentDisplay, setDownPaymentDisplay] = useState('');
  
  const totalPrice = watch('total_price');
  const downPayment = watch('down_payment');

  // Auto-calcular valor restante
  useEffect(() => {
    if (totalPrice && downPayment) {
      const total = Number(totalPrice) || 0;
      const down = Number(downPayment) || 0;
      const remaining = total - down;
      setValue('remaining_amount', remaining > 0 ? remaining : 0);
    }
  }, [totalPrice, downPayment, setValue]);

  const handleTotalPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTotalPriceDisplay(value);
    const numericValue = parseMoney(value);
    setValue('total_price', numericValue);
  };

  const handleDownPaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDownPaymentDisplay(value);
    const numericValue = parseMoney(value);
    setValue('down_payment', numericValue);
  };

  const remainingAmount = totalPrice && downPayment ? Number(totalPrice) - Number(downPayment) : 0;

  return (
    <Card className="border-neutral-200 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <DollarSign className="h-5 w-5 text-green-600" />
          Informações Financeiras
        </CardTitle>
        <Separator />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="total_price" className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Valor Total *
              <FinancialTooltip content="Valor total do contrato de prestação de serviços" />
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                R$
              </span>
              <Input
                id="total_price"
                type="text"
                value={totalPriceDisplay}
                onChange={handleTotalPriceChange}
                className={`min-h-[48px] pl-12 border-neutral-300 focus:ring-green-500 focus:border-green-500 ${errors.total_price ? 'border-red-500' : ''}`}
                placeholder="0,00"
              />
            </div>
            {errors.total_price && (
              <p className="text-red-500 text-sm mt-1">{errors.total_price.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="down_payment" className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Valor da Entrada
              <FinancialTooltip content="Valor pago antecipadamente pelo cliente" />
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                R$
              </span>
              <Input
                id="down_payment"
                type="text"
                value={downPaymentDisplay}
                onChange={handleDownPaymentChange}
                className="min-h-[48px] pl-12 border-neutral-300 focus:ring-green-500 focus:border-green-500"
                placeholder="0,00"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="down_payment_date" className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Data da Entrada
            </Label>
            <Input
              id="down_payment_date"
              type="date"
              {...register('down_payment_date')}
              className="min-h-[48px] border-neutral-300 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div>
            <Label htmlFor="remaining_amount" className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Valor Restante
              <FinancialTooltip content="Calculado automaticamente: Valor Total - Entrada = Restante" />
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                R$
              </span>
              <Input
                id="remaining_amount"
                type="text"
                value={formatMoney(remainingAmount)}
                readOnly
                className="min-h-[48px] pl-12 bg-gray-50 border-neutral-300 text-gray-700"
              />
            </div>
          </div>

          <div className="lg:col-span-1">
            <Label htmlFor="remaining_payment_date" className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Data do Saldo
            </Label>
            <Input
              id="remaining_payment_date"
              type="date"
              {...register('remaining_payment_date')}
              className="min-h-[48px] border-neutral-300 focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancialDataSection;
