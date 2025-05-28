
import React from 'react';
import { UseFormRegister, FieldErrors, UseFormSetValue } from 'react-hook-form';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';
import { ContractFormData, CIVIL_STATUS_OPTIONS } from '../../hooks/contract/types';

interface ClientDataSectionProps {
  register: UseFormRegister<ContractFormData>;
  errors: FieldErrors<ContractFormData>;
  setValue: UseFormSetValue<ContractFormData>;
  isManualEntry: boolean;
  selectedLeadId?: string;
}

const ClientDataSection: React.FC<ClientDataSectionProps> = ({
  register,
  errors,
  setValue,
  isManualEntry,
  selectedLeadId
}) => {
  const formatPhone = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return value;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Dados do Cliente</h3>
      
      {!isManualEntry && selectedLeadId && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Dados preenchidos automaticamente do lead selecionado. Você pode editá-los se necessário.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="client_name">Nome Completo *</Label>
          <Input
            id="client_name"
            {...register('client_name')}
            className={errors.client_name ? 'border-red-500' : ''}
          />
          {errors.client_name && (
            <p className="text-red-500 text-sm mt-1">{errors.client_name.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="client_email">Email *</Label>
          <Input
            id="client_email"
            type="email"
            {...register('client_email')}
            className={errors.client_email ? 'border-red-500' : ''}
          />
          {errors.client_email && (
            <p className="text-red-500 text-sm mt-1">{errors.client_email.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="client_phone">Telefone *</Label>
          <Input
            id="client_phone"
            {...register('client_phone')}
            className={errors.client_phone ? 'border-red-500' : ''}
            placeholder="(11) 99999-9999"
            onChange={(e) => {
              const formatted = formatPhone(e.target.value);
              setValue('client_phone', formatted);
            }}
          />
          {errors.client_phone && (
            <p className="text-red-500 text-sm mt-1">{errors.client_phone.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="civil_status">Estado Civil</Label>
          <Select onValueChange={(value) => setValue('civil_status', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o estado civil" />
            </SelectTrigger>
            <SelectContent>
              {CIVIL_STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="client_profession">Profissão</Label>
          <Input id="client_profession" {...register('client_profession')} />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="client_address">Endereço Completo</Label>
          <Input id="client_address" {...register('client_address')} />
        </div>
      </div>
    </div>
  );
};

export default ClientDataSection;
