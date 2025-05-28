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
import { contractTemplatesApi } from '../hooks/contract/api/contractTemplates';
import { useAuditData } from './hooks/useAuditData';
import LeadSelector from './selectors/LeadSelector';
import ProfessionalSelector from './selectors/ProfessionalSelector';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

// Updated schema with better date/time validation
const contractSchema = z.object({
  client_name: z.string().min(1, 'Nome é obrigatório'),
  client_email: z.string().email('Email inválido'),
  client_phone: z.string().min(1, 'Telefone é obrigatório'),
  client_address: z.string().optional(),
  client_profession: z.string().optional(),
  civil_status: z.string().optional(),
  event_type: z.string().min(1, 'Tipo de evento é obrigatório'),
  event_date: z.string().optional().transform(val => val === '' ? undefined : val),
  event_time: z.string().optional().transform(val => val === '' ? undefined : val),
  event_location: z.string().optional(),
  total_price: z.number().min(0, 'Valor total deve ser positivo'),
  down_payment: z.number().optional(),
  down_payment_date: z.string().optional().transform(val => val === '' ? undefined : val),
  remaining_amount: z.number().optional(),
  remaining_payment_date: z.string().optional().transform(val => val === '' ? undefined : val),
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
  const [selectedLeadId, setSelectedLeadId] = useState<string | undefined>(initialData?.quote_request_id);
  const [selectedProfessionalId, setSelectedProfessionalId] = useState<string | undefined>();
  const [isManualEntry, setIsManualEntry] = useState(!initialData?.quote_request_id);
  const auditData = useAuditData();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
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
      total_price: initialData.total_price,
      down_payment: initialData.down_payment,
      down_payment_date: initialData.down_payment_date || '',
      remaining_amount: initialData.remaining_amount,
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
      total_price: 0,
      down_payment: 0,
      down_payment_date: '',
      remaining_amount: 0,
      remaining_payment_date: '',
      template_id: '',
      notes: '',
    }
  });

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

  // Carregar templates usando a API correta
  useEffect(() => {
    const fetchTemplates = async () => {
      setIsLoadingTemplates(true);
      try {
        const templatesData = await contractTemplatesApi.getContractTemplates();
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

  const handleLeadSelect = (lead: any) => {
    if (lead) {
      setIsManualEntry(false);
      setSelectedLeadId(lead.id);
      
      // Auto-preencher campos do formulário
      setValue('client_name', lead.name);
      setValue('client_email', lead.email);
      setValue('client_phone', lead.phone);
      setValue('event_type', lead.event_type);
      setValue('event_location', lead.event_location || '');
      setValue('quote_request_id', lead.id);
      
      if (lead.event_date) {
        setValue('event_date', lead.event_date);
      }
    } else {
      setIsManualEntry(true);
      setSelectedLeadId(undefined);
      setValue('quote_request_id', '');
      
      // Limpar campos do cliente para entrada manual
      setValue('client_name', '');
      setValue('client_email', '');
      setValue('client_phone', '');
      setValue('event_type', '');
      setValue('event_location', '');
      setValue('event_date', '');
    }
  };

  const handleProfessionalSelect = (professional: any) => {
    if (professional) {
      setSelectedProfessionalId(professional.id);
    } else {
      setSelectedProfessionalId(undefined);
    }
  };

  const handleFormSubmit = async (formData: ContractFormData) => {
    // Clean up empty strings for date/time fields before submission
    const cleanedData = {
      ...formData,
      event_date: formData.event_date === '' ? undefined : formData.event_date,
      event_time: formData.event_time === '' ? undefined : formData.event_time,
      down_payment_date: formData.down_payment_date === '' ? undefined : formData.down_payment_date,
      remaining_payment_date: formData.remaining_payment_date === '' ? undefined : formData.remaining_payment_date,
      // Add audit data
      ip_address: auditData.ip_address,
      user_agent: auditData.user_agent,
    };

    await onSubmit(cleanedData);
  };

  const formatPhone = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return value;
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>
          {initialData ? 'Editar Contrato' : 'Novo Contrato'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Seleção de Lead/Cliente */}
          {!initialData && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Selecionar Cliente</h3>
              <LeadSelector 
                onLeadSelect={handleLeadSelect}
                selectedLeadId={selectedLeadId}
              />
              
              {/* Seleção de Profissional */}
              <ProfessionalSelector 
                onProfessionalSelect={handleProfessionalSelect}
                selectedProfessionalId={selectedProfessionalId}
              />
            </div>
          )}

          {/* Dados do Cliente */}
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

          {/* Dados do Evento */}
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
                  placeholder="Deixe vazio se não definido"
                />
              </div>

              <div>
                <Label htmlFor="event_time">Horário</Label>
                <Input
                  id="event_time"
                  type="time"
                  {...register('event_time')}
                  placeholder="Deixe vazio se não definido"
                />
              </div>

              <div>
                <Label htmlFor="event_location">Local do Evento</Label>
                <Input id="event_location" {...register('event_location')} />
              </div>
            </div>
          </div>

          {/* Informações Financeiras */}
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

          {/* Template e Observações */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Template e Observações</h3>
            
            <div>
              <Label htmlFor="template_id">Template do Contrato</Label>
              <Select 
                onValueChange={(value) => setValue('template_id', value)}
                disabled={isLoadingTemplates}
              >
                <SelectTrigger>
                  <SelectValue placeholder={isLoadingTemplates ? "Carregando..." : "Selecione um template"} />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name} {template.is_default && "(Padrão)"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                {...register('notes')}
                rows={3}
                placeholder="Observações adicionais sobre o contrato..."
              />
            </div>
          </div>

          {/* Ações */}
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
