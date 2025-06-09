
import React from 'react';
import { UseFormRegister, FieldErrors, UseFormSetValue } from 'react-hook-form';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, User, Mail, Phone, MapPin, Briefcase } from 'lucide-react';
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
    <Card className="border-neutral-200 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <User className="h-5 w-5 text-gray-600" />
          Dados do Cliente
        </CardTitle>
        <Separator />
      </CardHeader>
      <CardContent className="space-y-6">
        {!isManualEntry && selectedLeadId && (
          <Alert className="border-blue-200 bg-blue-50">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              Dados preenchidos automaticamente do lead selecionado. Você pode editá-los se necessário.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="client_name" className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
              <User className="h-4 w-4" />
              Nome Completo *
            </Label>
            <Input
              id="client_name"
              {...register('client_name')}
              className={`min-h-[48px] border-neutral-300 focus:ring-rose-500 focus:border-rose-500 ${errors.client_name ? 'border-red-500' : ''}`}
              placeholder="Digite o nome completo"
            />
            {errors.client_name && (
              <p className="text-red-500 text-sm mt-1">{errors.client_name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="client_email" className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
              <Mail className="h-4 w-4" />
              Email *
            </Label>
            <Input
              id="client_email"
              type="email"
              {...register('client_email')}
              className={`min-h-[48px] border-neutral-300 focus:ring-rose-500 focus:border-rose-500 ${errors.client_email ? 'border-red-500' : ''}`}
              placeholder="exemplo@email.com"
            />
            {errors.client_email && (
              <p className="text-red-500 text-sm mt-1">{errors.client_email.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="client_phone" className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
              <Phone className="h-4 w-4" />
              Telefone *
            </Label>
            <Input
              id="client_phone"
              {...register('client_phone')}
              className={`min-h-[48px] border-neutral-300 focus:ring-rose-500 focus:border-rose-500 ${errors.client_phone ? 'border-red-500' : ''}`}
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
            <Label htmlFor="civil_status" className="text-sm font-medium text-gray-700 mb-2">
              Estado Civil
            </Label>
            <Select onValueChange={(value) => setValue('civil_status', value)}>
              <SelectTrigger className="min-h-[48px] border-neutral-300 focus:ring-rose-500">
                <SelectValue placeholder="Selecione o estado civil" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                {CIVIL_STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="client_profession" className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
              <Briefcase className="h-4 w-4" />
              Profissão <span className="text-gray-400">(opcional)</span>
            </Label>
            <Input 
              id="client_profession" 
              {...register('client_profession')} 
              className="min-h-[48px] border-neutral-300 focus:ring-rose-500 focus:border-rose-500"
              placeholder="Ex: Advogado, Médico, etc."
            />
          </div>

          <div>
            <Label htmlFor="client_address" className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              Endereço Completo
            </Label>
            <Input 
              id="client_address" 
              {...register('client_address')} 
              className="min-h-[48px] border-neutral-300 focus:ring-rose-500 focus:border-rose-500"
              placeholder="Rua, número, bairro, cidade - UF"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientDataSection;
