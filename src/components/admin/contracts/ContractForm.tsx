
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContractFormData, ContractData, CIVIL_STATUS_OPTIONS } from '../hooks/contract/types';
import { contractApi } from '../hooks/contract';
import { Loader2 } from 'lucide-react';

const contractSchema = z.object({
  client_name: z.string().min(1, 'Nome é obrigatório'),
  client_email: z.string().email('Email inválido'),
  client_phone: z.string().min(1, 'Telefone é obrigatório'),
  client_address: z.string().optional(),
  client_profession: z.string().optional(),
  civil_status: z.string().optional(),
  event_type: z.string().min(1, 'Tipo de evento é obrigatório'),
  event_date: z.string().optional(),
  event_time: z.string().optional(),
  event_location: z.string().optional(),
  total_price: z.string().min(1, 'Valor total é obrigatório'),
  down_payment: z.string().optional(),
  down_payment_date: z.string().optional(),
  remaining_amount: z.string().optional(),
  remaining_payment_date: z.string().optional(),
  template_id: z.string().optional(),
  notes: z.string().optional(),
  quote_request_id: z.string().optional(),
  proposal_id: z.string().optional(),
});

interface ContractFormProps {
  initialData?: ContractData;
  onSubmit: (data: ContractFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const ContractForm = ({ initialData, onSubmit, onCancel, isLoading = false }: ContractFormProps) => {
  const [templates, setTemplates] = useState<any[]>([]);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<ContractFormData>({
    resolver: zodResolver(contractSchema),
    defaultValues: initialData ? {
      client_name: initialData.client_name,
      client_email: initialData.client_email,
      client_phone: initialData.client_phone,
      client_address: initialData.client_address || '',
      client_profession: initialData.client_profession || '',
      civil_status: initialData.civil_status || '',
      event_type: initialData.event_type,
      event_date: initialData.event_date || '',
      event_time: initialData.event_time || '',
      event_location: initialData.event_location || '',
      total_price: initialData.total_price.toString(),
      down_payment: initialData.down_payment?.toString() || '',
      down_payment_date: initialData.down_payment_date || '',
      remaining_amount: initialData.remaining_amount?.toString() || '',
      remaining_payment_date: initialData.remaining_payment_date || '',
      template_id: initialData.template_id || '',
      notes: initialData.notes || '',
      quote_request_id: initialData.quote_request_id || '',
      proposal_id: initialData.proposal_id || '',
    } : {
      client_name: '',
      client_email: '',
      client_phone: '',
      client_address: '',
      client_profession: '',
      civil_status: '',
      event_type: '',
      event_date: '',
      event_time: '',
      event_location: '',
      total_price: '',
      down_payment: '',
      down_payment_date: '',
      remaining_amount: '',
      remaining_payment_date: '',
      template_id: '',
      notes: '',
    }
  });

  const totalPrice = watch('total_price');
  const downPayment = watch('down_payment');

  useEffect(() => {
    const fetchTemplates = async () => {
      setIsLoadingTemplates(true);
      try {
        const templatesData = await contractApi.getContractTemplates();
        setTemplates(templatesData);
        
        if (templatesData.length > 0 && !initialData) {
          const defaultTemplate = templatesData.find(t => t.is_default) || templatesData[0];
          setValue('template_id', defaultTemplate.id);
        }
      } catch (error) {
        console.error('Error fetching templates:', error);
      } finally {
        setIsLoadingTemplates(false);
      }
    };

    fetchTemplates();
  }, [setValue, initialData]);

  useEffect(() => {
    if (totalPrice && downPayment) {
      const total = parseFloat(totalPrice) || 0;
      const down = parseFloat(downPayment) || 0;
      const remaining = total - down;
      setValue('remaining_amount', remaining > 0 ? remaining.toString() : '');
    }
  }, [totalPrice, downPayment, setValue]);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>
          {initialData ? 'Editar Contrato' : 'Novo Contrato'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Client Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Dados do Cliente</h3>
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

          {/* Event Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Dados do Evento</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="event_type">Tipo de Evento *</Label>
                <Input
                  id="event_type"
                  {...register('event_type')}
                  className={errors.event_type ? 'border-red-500' : ''}
                />
                {errors.event_type && (
                  <p className="text-red-500 text-sm mt-1">{errors.event_type.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="event_date">Data do Evento</Label>
                <Input
                  id="event_date"
                  type="date"
                  {...register('event_date')}
                />
              </div>

              <div>
                <Label htmlFor="event_time">Horário</Label>
                <Input
                  id="event_time"
                  type="time"
                  {...register('event_time')}
                />
              </div>

              <div>
                <Label htmlFor="event_location">Local do Evento</Label>
                <Input id="event_location" {...register('event_location')} />
              </div>
            </div>
          </div>

          {/* Financial Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Informações Financeiras</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="total_price">Valor Total *</Label>
                <Input
                  id="total_price"
                  type="number"
                  step="0.01"
                  {...register('total_price')}
                  className={errors.total_price ? 'border-red-500' : ''}
                />
                {errors.total_price && (
                  <p className="text-red-500 text-sm mt-1">{errors.total_price.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="down_payment">Valor da Entrada</Label>
                <Input
                  id="down_payment"
                  type="number"
                  step="0.01"
                  {...register('down_payment')}
                />
              </div>

              <div>
                <Label htmlFor="down_payment_date">Data da Entrada</Label>
                <Input
                  id="down_payment_date"
                  type="date"
                  {...register('down_payment_date')}
                />
              </div>

              <div>
                <Label htmlFor="remaining_amount">Valor Restante</Label>
                <Input
                  id="remaining_amount"
                  type="number"
                  step="0.01"
                  {...register('remaining_amount')}
                  readOnly
                />
              </div>

              <div>
                <Label htmlFor="remaining_payment_date">Data do Saldo</Label>
                <Input
                  id="remaining_payment_date"
                  type="date"
                  {...register('remaining_payment_date')}
                />
              </div>
            </div>
          </div>

          {/* Template Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Template</h3>
            <div>
              <Label htmlFor="template_id">Template do Contrato</Label>
              <Select onValueChange={(value) => setValue('template_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um template" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              {...register('notes')}
              rows={3}
              placeholder="Observações adicionais sobre o contrato..."
            />
          </div>

          {/* Actions */}
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
        </form>
      </CardContent>
    </Card>
  );
};

export default ContractForm;
