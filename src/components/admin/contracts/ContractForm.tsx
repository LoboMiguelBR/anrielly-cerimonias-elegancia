
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ContractFormData, ContractData } from '../hooks/contract/types';
import { contractTemplatesApi } from '../hooks/contract/api/contractTemplates';
import { contractVersioningApi } from '../hooks/contract/api/contractVersioning';
import { useAuditData } from './hooks/useAuditData';
import {
  ClientDataSection,
  EventDataSection,
  FinancialDataSection,
  TemplateNotesSection,
  FormActions,
  LeadProfessionalSelection,
  ContractVersionInfo
} from './form';
import { toast } from 'sonner';

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
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(initialData?.template_id || '');
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
      down_payment: initialData.down_payment || 0,
      down_payment_date: initialData.down_payment_date || '',
      remaining_amount: initialData.remaining_amount || 0,
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
        
        if (initialData?.template_id) {
          setSelectedTemplateId(initialData.template_id);
          setValue('template_id', initialData.template_id);
        } else if (templatesData.length > 0) {
          const defaultTemplate = templatesData.find(t => t.is_default) || templatesData[0];
          setSelectedTemplateId(defaultTemplate.id);
          setValue('template_id', defaultTemplate.id);
        }
      } catch (error) {
        console.error('Error fetching templates:', error);
        toast.error('Erro ao carregar templates');
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
    try {
      // Clean up empty strings for date/time fields before submission
      const cleanedData = {
        ...formData,
        event_date: formData.event_date === '' ? undefined : formData.event_date,
        event_time: formData.event_time === '' ? undefined : formData.event_time,
        down_payment_date: formData.down_payment_date === '' ? undefined : formData.down_payment_date,
        remaining_payment_date: formData.remaining_payment_date === '' ? undefined : formData.remaining_payment_date,
        template_id: selectedTemplateId || formData.template_id,
        // Add audit data
        ip_address: auditData.ip_address,
        user_agent: auditData.user_agent,
      };

      // Se estamos editando um contrato, incrementar a versão
      if (initialData) {
        await contractVersioningApi.incrementContractVersion(initialData.id);
        toast.success('Versão do contrato atualizada');
      }

      await onSubmit(cleanedData);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Erro ao salvar contrato');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6 pb-32">
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
          <div className="p-6 border-b border-neutral-200">
            <h1 className="text-2xl font-bold text-gray-900">
              {initialData ? 'Editar Contrato' : 'Novo Contrato'}
            </h1>
            <p className="text-gray-600 mt-1">
              Preencha os dados abaixo para {initialData ? 'atualizar o' : 'criar um novo'} contrato.
            </p>
          </div>
          
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8 p-6">
            {/* Informações de Versão (somente para edição) */}
            {initialData && (
              <ContractVersionInfo contract={initialData} />
            )}

            {/* Seleção de Lead/Cliente */}
            {!initialData && (
              <LeadProfessionalSelection
                onLeadSelect={handleLeadSelect}
                onProfessionalSelect={handleProfessionalSelect}
                selectedLeadId={selectedLeadId}
                selectedProfessionalId={selectedProfessionalId}
              />
            )}

            {/* Dados do Cliente */}
            <ClientDataSection
              register={register}
              errors={errors}
              setValue={setValue}
              isManualEntry={isManualEntry}
              selectedLeadId={selectedLeadId}
            />

            {/* Dados do Evento */}
            <EventDataSection
              register={register}
              errors={errors}
            />

            {/* Informações Financeiras */}
            <FinancialDataSection
              register={register}
              errors={errors}
              watch={watch}
              setValue={setValue}
            />

            {/* Template e Observações */}
            <TemplateNotesSection
              register={register}
              setValue={setValue}
              templates={templates}
              isLoadingTemplates={isLoadingTemplates}
              selectedTemplateId={selectedTemplateId}
            />

            {/* Ações */}
            <FormActions
              initialData={initialData}
              isLoading={isLoading}
              onCancel={onCancel}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContractForm;
