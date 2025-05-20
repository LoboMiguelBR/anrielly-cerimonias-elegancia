
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface Service {
  name: string;
  included: boolean;
}

export interface ProposalFormData {
  client_name: string;
  client_email: string;
  client_phone: string;
  event_type: string;
  event_date: string | null;
  event_location: string;
  validity_date: string;
  services: Service[];
  customService: string;
  total_price: string;
  payment_terms: string;
  notes: string;
  quote_request_id: string | null;
}

export interface QuoteRequest {
  id: string;
  name: string;
  eventType?: string;
  event_type?: string;
  email?: string;
  phone?: string;
  event_date?: string;
  event_location?: string;
}

export interface ProposalData {
  id?: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  event_type: string;
  event_date: string | null;
  event_location: string;
  services: Service[];
  total_price: number;
  payment_terms: string;
  notes: string | null;
  quote_request_id: string | null;
  validity_date: string;
  created_at?: string;
}

export const useProposalForm = (selectedQuoteId?: string | null) => {
  const [selectedQuote, setSelectedQuote] = useState<string>(selectedQuoteId || "");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [generatingPDF, setGeneratingPDF] = useState<boolean>(false);
  const [proposal, setProposal] = useState<ProposalData | null>(null);
  
  const [formData, setFormData] = useState<ProposalFormData>({
    client_name: "",
    client_email: "",
    client_phone: "",
    event_type: "",
    event_date: null,
    event_location: "",
    validity_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
    services: [
      { name: "Reuniões de planejamento", included: true },
      { name: "Visita técnica", included: true },
      { name: "Coordenação dos fornecedores", included: true },
      { name: "Condução da cerimônia", included: true },
      { name: "Coordenação da recepção", included: true }
    ],
    customService: "",
    total_price: "",
    payment_terms: "50% de sinal na assinatura do contrato, 50% restantes até 5 dias antes do evento.",
    notes: "",
    quote_request_id: null
  });

  const handleQuoteSelect = (quoteId: string) => {
    setSelectedQuote(quoteId);
  };

  const handleFormChange = (field: keyof ProposalFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleServiceChange = (index: number, checked: boolean) => {
    const updatedServices = [...formData.services];
    updatedServices[index] = { ...updatedServices[index], included: checked };
    setFormData({ ...formData, services: updatedServices });
  };

  const handleCustomServiceAdd = () => {
    if (formData.customService.trim() === "") return;
    
    setFormData({
      ...formData,
      services: [...formData.services, { name: formData.customService, included: true }],
      customService: "",
    });
  };

  const saveProposal = async (): Promise<string | null> => {
    try {
      setIsSaving(true);
      
      // Filtrar apenas os serviços incluídos
      const includedServices = formData.services.filter(service => service.included);
      
      const proposalData = {
        client_name: formData.client_name,
        client_email: formData.client_email,
        client_phone: formData.client_phone,
        event_type: formData.event_type,
        event_date: formData.event_date,
        event_location: formData.event_location,
        services: includedServices,
        total_price: parseFloat(formData.total_price) || 0,
        payment_terms: formData.payment_terms,
        notes: formData.notes || null,
        quote_request_id: formData.quote_request_id,
        validity_date: formData.validity_date
      };
      
      const { data, error } = await supabase
        .from('proposals')
        .insert(proposalData)
        .select('id')
        .single();
      
      if (error) throw error;
      
      // Atualizar o status do orçamento para "proposta"
      if (formData.quote_request_id) {
        const { error: quoteError } = await supabase
          .from('quote_requests')
          .update({ status: 'proposta' })
          .eq('id', formData.quote_request_id);
        
        if (quoteError) {
          console.error('Erro ao atualizar status do orçamento', quoteError);
        }
      }
      
      toast.success("Proposta salva com sucesso!");
      return data.id;
    } catch (error: any) {
      console.error('Erro ao salvar proposta:', error);
      toast.error(`Erro ao salvar proposta: ${error.message}`);
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    selectedQuote,
    isLoading,
    isSaving,
    generatingPDF,
    proposal,
    formData,
    setSelectedQuote,
    setIsLoading,
    setIsSaving,
    setGeneratingPDF,
    setProposal,
    setFormData,
    handleQuoteSelect,
    handleFormChange,
    handleServiceChange,
    handleCustomServiceAdd,
    saveProposal
  };
};
