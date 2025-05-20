
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';

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

// Updated to ensure id is required to match ProposalPDFData
export interface ProposalData {
  id: string;
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

const defaultFormData: ProposalFormData = {
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
};

export const useProposalForm = (initialProposalId?: string, selectedQuoteId?: string | null) => {
  const [selectedQuote, setSelectedQuote] = useState<string>(selectedQuoteId || "");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [generatingPDF, setGeneratingPDF] = useState<boolean>(false);
  const [proposal, setProposal] = useState<ProposalData | null>(null);
  const [proposalId, setProposalId] = useState<string | undefined>(initialProposalId);
  const [isEditMode, setIsEditMode] = useState<boolean>(!!initialProposalId);
  
  const [formData, setFormData] = useState<ProposalFormData>({...defaultFormData});

  // Load proposal data if in edit mode
  useEffect(() => {
    const fetchProposal = async () => {
      if (!proposalId) return;
      
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('proposals')
        .select('*')
        .eq('id', proposalId)
        .single();
      
      if (error) {
        console.error('Erro ao carregar proposta:', error);
        toast.error("Erro ao carregar proposta");
        setIsLoading(false);
        return;
      }
      
      if (data) {
        // Convert the data to the format expected by the form
        setFormData({
          client_name: data.client_name,
          client_email: data.client_email,
          client_phone: data.client_phone,
          event_type: data.event_type,
          event_date: data.event_date,
          event_location: data.event_location,
          validity_date: data.validity_date,
          services: data.services as Service[],
          customService: "",
          total_price: data.total_price.toString(),
          payment_terms: data.payment_terms,
          notes: data.notes || "",
          quote_request_id: data.quote_request_id
        });
        
        if (data.quote_request_id) {
          setSelectedQuote(data.quote_request_id);
        }
      }
      
      setIsLoading(false);
    };
    
    if (proposalId) {
      fetchProposal();
      setIsEditMode(true);
    } else {
      setIsEditMode(false);
      setFormData({...defaultFormData});
    }
  }, [proposalId]);

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

  const resetForm = () => {
    setFormData({...defaultFormData});
    setSelectedQuote("");
    setProposalId(undefined);
    setIsEditMode(false);
    setProposal(null);
  };

  const saveProposal = async (): Promise<string | null> => {
    try {
      setIsSaving(true);
      
      // Filter only included services
      const includedServices = formData.services.filter(service => service.included);
      
      const proposalData = {
        client_name: formData.client_name,
        client_email: formData.client_email,
        client_phone: formData.client_phone,
        event_type: formData.event_type,
        event_date: formData.event_date,
        event_location: formData.event_location,
        services: includedServices as unknown as Json, // Type cast to satisfy Supabase's Json type
        total_price: parseFloat(formData.total_price) || 0,
        payment_terms: formData.payment_terms,
        notes: formData.notes || null,
        quote_request_id: formData.quote_request_id,
        validity_date: formData.validity_date
      };
      
      let data;
      let error;
      
      if (isEditMode && proposalId) {
        // Update existing proposal
        const result = await supabase
          .from('proposals')
          .update(proposalData)
          .eq('id', proposalId)
          .select('id')
          .single();
          
        data = result.data;
        error = result.error;
      } else {
        // Insert new proposal
        const result = await supabase
          .from('proposals')
          .insert(proposalData)
          .select('id')
          .single();
          
        data = result.data;
        error = result.error;
      }
      
      if (error) throw error;
      
      // Update quote request status if it's a new proposal
      if (!isEditMode && formData.quote_request_id) {
        const { error: quoteError } = await supabase
          .from('quote_requests')
          .update({ status: 'proposta' })
          .eq('id', formData.quote_request_id);
        
        if (quoteError) {
          console.error('Erro ao atualizar status do orçamento', quoteError);
        }
      }
      
      toast.success(isEditMode ? "Proposta atualizada com sucesso!" : "Proposta criada com sucesso!");
      
      if (data && !isEditMode) {
        setProposalId(data.id);
        setIsEditMode(true);
      }
      
      return data?.id || proposalId || null;
    } catch (error: any) {
      console.error('Erro ao salvar proposta:', error);
      toast.error(`Erro ao salvar proposta: ${error.message}`);
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  const deleteProposal = async (): Promise<boolean> => {
    if (!proposalId) return false;
    
    try {
      setIsDeleting(true);
      
      const { error } = await supabase
        .from('proposals')
        .delete()
        .eq('id', proposalId);
        
      if (error) throw error;
      
      toast.success("Proposta excluída com sucesso!");
      resetForm();
      return true;
    } catch (error: any) {
      console.error('Erro ao excluir proposta:', error);
      toast.error(`Erro ao excluir proposta: ${error.message}`);
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    selectedQuote,
    isLoading,
    isSaving,
    isDeleting,
    generatingPDF,
    proposal,
    formData,
    isEditMode,
    proposalId,
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
    saveProposal,
    deleteProposal,
    resetForm,
    setProposalId
  };
};
