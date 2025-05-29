
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { ProposalData, Service, QuoteRequest } from './types';
import { proposalTemplatesApi } from './api/proposalTemplates';
import type { ProposalTemplateData } from './api/proposalTemplates';
import { fetchProposal, saveProposal } from './proposalApi';

interface Professional {
  id: string;
  name: string;
  email: string;
  phone: string;
  category: string;
  city: string;
}

export const useProposalFormEnhanced = (
  initialProposalId?: string,
  quoteRequests: QuoteRequest[] = [],
  professionals: Professional[] = []
) => {
  // Form state
  const [formData, setFormData] = useState<ProposalData>({
    client_name: '',
    client_email: '',
    client_phone: '',
    event_type: '',
    event_date: '',
    event_location: '',
    services: [],
    total_price: 0,
    payment_terms: '',
    notes: '',
    validity_date: '',
    template_id: null,
    status: 'draft'
  });

  // Selection state
  const [selectedClientType, setSelectedClientType] = useState<'lead' | 'professional' | ''>('');
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  
  // Financial state
  const [totalPrice, setTotalPrice] = useState<string>('0');
  const [discount, setDiscount] = useState<string>('0');
  const [finalPrice, setFinalPrice] = useState<string>('0');
  
  // Template state
  const [selectedTemplate, setSelectedTemplate] = useState<ProposalTemplateData | null>(null);
  
  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Proposal state
  const [proposal, setProposal] = useState<ProposalData | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Calculate final price
  useEffect(() => {
    const total = parseFloat(totalPrice) || 0;
    const discountAmount = parseFloat(discount) || 0;
    const final = Math.max(0, total - discountAmount);
    setFinalPrice(final.toFixed(2));
  }, [totalPrice, discount]);

  // Load existing proposal if editing
  useEffect(() => {
    if (initialProposalId) {
      setIsLoading(true);
      setIsEditMode(true);
      
      fetchProposal(initialProposalId)
        .then((proposalData) => {
          if (proposalData) {
            setProposal(proposalData);
            setFormData(proposalData);
            setTotalPrice(proposalData.total_price.toString());
            
            // Load template if exists
            if (proposalData.template_id) {
              proposalTemplatesApi.fetchProposalTemplateById(proposalData.template_id)
                .then(template => {
                  if (template) {
                    setSelectedTemplate(template);
                  }
                });
            }
          }
        })
        .catch((error) => {
          console.error('Error loading proposal:', error);
          toast.error('Erro ao carregar proposta');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [initialProposalId]);

  // Form handlers
  const handleFormChange = useCallback((field: keyof ProposalData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // Fixed client type setter to match expected interface
  const handleClientTypeChange = useCallback((type: string) => {
    setSelectedClientType(type as 'lead' | 'professional' | '');
  }, []);

  // Service handlers - Updated to use serviceId (string) instead of index (number)
  const handleServiceToggle = useCallback((serviceId: string) => {
    const index = parseInt(serviceId);
    setFormData(prev => ({
      ...prev,
      services: prev.services.map((service, i) => 
        i === index ? { ...service, included: !service.included } : service
      )
    }));
  }, []);

  const handleServiceUpdate = useCallback((serviceId: string, updates: any) => {
    const index = parseInt(serviceId);
    setFormData(prev => ({
      ...prev,
      services: prev.services.map((service, i) => 
        i === index ? { ...service, ...updates } : service
      )
    }));
  }, []);

  const handleAddService = useCallback(() => {
    const newService: Service = {
      name: '',
      description: '',
      price: 0,
      quantity: 1,
      included: true
    };
    
    setFormData(prev => ({
      ...prev,
      services: [...prev.services, newService]
    }));
  }, []);

  const handleRemoveService = useCallback((serviceId: string) => {
    const index = parseInt(serviceId);
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
    }));
  }, []);

  // Submit handler
  const handleSubmit = useCallback(async (): Promise<boolean> => {
    try {
      setIsSaving(true);
      
      // Validation
      if (!formData.client_name || !formData.client_email || !formData.client_phone) {
        toast.error('Preencha todos os campos obrigatórios do cliente');
        return false;
      }
      
      if (!formData.event_type || !formData.event_location) {
        toast.error('Preencha todos os campos obrigatórios do evento');
        return false;
      }
      
      if (!formData.payment_terms || !formData.validity_date) {
        toast.error('Preencha todos os campos obrigatórios dos termos');
        return false;
      }

      // Prepare proposal data
      const proposalData: ProposalData = {
        ...formData,
        total_price: parseFloat(finalPrice) || 0,
        template_id: selectedTemplate?.id || null,
        id: proposal?.id
      };

      // Save proposal
      const savedId = await saveProposal(proposalData);
      
      if (savedId) {
        toast.success(isEditMode ? 'Proposta atualizada com sucesso!' : 'Proposta criada com sucesso!');
        
        // Update proposal state if editing
        if (isEditMode) {
          setProposal({ ...proposalData, id: savedId });
        }
        
        return true;
      } else {
        toast.error('Erro ao salvar proposta');
        return false;
      }
    } catch (error) {
      console.error('Error submitting proposal:', error);
      toast.error('Erro ao salvar proposta');
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [formData, finalPrice, selectedTemplate, proposal, isEditMode]);

  return {
    // Form data
    formData,
    
    // Selection state
    selectedClientType,
    selectedClientId,
    
    // Financial state
    totalPrice,
    discount,
    finalPrice,
    
    // Template state
    selectedTemplate,
    
    // Loading states
    isLoading,
    isSaving,
    
    // Proposal state
    proposal,
    isEditMode,
    
    // Setters
    setSelectedClientType: handleClientTypeChange,
    setSelectedClientId,
    setTotalPrice,
    setDiscount,
    setSelectedTemplate,
    
    // Handlers
    handleFormChange,
    handleServiceToggle,
    handleServiceUpdate,
    handleAddService,
    handleRemoveService,
    handleSubmit
  };
};
