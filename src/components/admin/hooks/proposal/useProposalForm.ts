
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { ProposalFormData, ProposalData, QuoteRequest, Service } from './types';
import { defaultFormData } from './constants';
import { fetchProposal, saveProposal, deleteProposal, sendProposalByEmail, savePdfUrl } from './proposalApi';
import { proposalTemplatesApi, ProposalTemplateData } from './api/proposalTemplates';

export interface UseProposalFormReturn {
  selectedQuote: string;
  isLoading: boolean;
  isSaving: boolean;
  isDeleting: boolean;
  isSending: boolean;
  generatingPDF: boolean;
  proposal: ProposalData | null;
  formData: ProposalFormData;
  isEditMode: boolean;
  proposalId: string | undefined;
  selectedTemplate: ProposalTemplateData | null;
  isSubmitting: boolean;
  setSelectedQuote: React.Dispatch<React.SetStateAction<string>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSaving: React.Dispatch<React.SetStateAction<boolean>>;
  setGeneratingPDF: React.Dispatch<React.SetStateAction<boolean>>;
  setProposal: React.Dispatch<React.SetStateAction<ProposalData | null>>;
  setFormData: React.Dispatch<React.SetStateAction<ProposalFormData>>;
  setSelectedTemplate: React.Dispatch<React.SetStateAction<ProposalTemplateData | null>>;
  handleQuoteSelect: (quoteId: string) => void;
  handleFormChange: (field: keyof ProposalFormData, value: any) => void;
  handleServiceChange: (index: number, checked: boolean) => void;
  handleCustomServiceAdd: () => void;
  saveProposal: () => Promise<string | null>;
  deleteProposal: () => Promise<boolean>;
  sendProposalEmail: () => Promise<boolean>;
  saveProposalPdfUrl: (url: string) => Promise<boolean>;
  resetForm: () => void;
  setProposalId: React.Dispatch<React.SetStateAction<string | undefined>>;
  handleSubmit: () => Promise<boolean>;
  addService: () => void;
  removeService: (index: number) => void;
  updateService: (index: number, updates: Partial<Service>) => void;
}

export function useProposalForm(
  initialProposalId?: string, 
  selectedQuoteId?: string | null, 
  quoteRequests?: Array<QuoteRequest>
): UseProposalFormReturn {
  const [selectedQuote, setSelectedQuote] = useState<string>(selectedQuoteId || "");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [generatingPDF, setGeneratingPDF] = useState<boolean>(false);
  const [proposal, setProposal] = useState<ProposalData | null>(null);
  const [proposalId, setProposalId] = useState<string | undefined>(initialProposalId);
  const [isEditMode, setIsEditMode] = useState<boolean>(!!initialProposalId);
  const [selectedTemplate, setSelectedTemplate] = useState<ProposalTemplateData | null>(null);
  
  const [formData, setFormData] = useState<ProposalFormData>({...defaultFormData});

  // Calculate total price whenever services change
  useEffect(() => {
    const total = formData.services.reduce((sum, service) => {
      return service.included ? sum + (service.price || 0) : sum;
    }, 0);
    
    if (formData.total_price !== total.toString()) {
      setFormData(prev => ({ ...prev, total_price: total.toString() }));
    }
  }, [formData.services, formData.total_price]);

  // Load default template on mount
  useEffect(() => {
    const loadDefaultTemplate = async () => {
      try {
        console.log('Loading default template...');
        const defaultTemplate = await proposalTemplatesApi.getDefaultProposalTemplate();
        if (defaultTemplate) {
          console.log('Default template loaded:', defaultTemplate);
          setSelectedTemplate(defaultTemplate);
          setFormData(prev => ({ ...prev, template_id: defaultTemplate.id }));
        } else {
          console.log('No default template found, will use first available');
          const templates = await proposalTemplatesApi.fetchProposalTemplates();
          if (templates.length > 0) {
            const firstTemplate = templates[0];
            console.log('Using first template:', firstTemplate);
            setSelectedTemplate(firstTemplate);
            setFormData(prev => ({ ...prev, template_id: firstTemplate.id }));
          }
        }
      } catch (error) {
        console.error('Error loading default template:', error);
        // Set formData without template_id to avoid foreign key error
        setFormData(prev => ({ ...prev, template_id: null }));
      }
    };
    
    if (!selectedTemplate && !initialProposalId) {
      loadDefaultTemplate();
    }
  }, [selectedTemplate, initialProposalId]);

  // Load proposal data if in edit mode
  useEffect(() => {
    const loadProposal = async () => {
      if (!proposalId) return;
      
      setIsLoading(true);
      console.log('Loading proposal data for ID:', proposalId);
      const data = await fetchProposal(proposalId);
      
      if (data) {
        console.log('Loaded proposal:', data);
        setFormData({
          client_name: data.client_name,
          client_email: data.client_email,
          client_phone: data.client_phone,
          event_type: data.event_type,
          event_date: data.event_date,
          event_location: data.event_location,
          validity_date: data.validity_date,
          services: data.services,
          customService: "",
          total_price: data.total_price.toString(),
          payment_terms: data.payment_terms,
          notes: data.notes || "",
          quote_request_id: data.quote_request_id,
          template_id: data.template_id || null,
          status: data.status
        });
        
        if (data.quote_request_id) {
          setSelectedQuote(data.quote_request_id);
        }
        
        // Load template if exists
        if (data.template_id) {
          try {
            const template = await proposalTemplatesApi.fetchProposalTemplateById(data.template_id);
            if (template) {
              setSelectedTemplate(template);
            }
          } catch (error) {
            console.error('Error loading template:', error);
          }
        }
        
        // Store PDF URL if available
        if (data.pdf_url) {
          setProposal({...data});
        }
      } else {
        console.error('Failed to load proposal data');
        toast.error('Erro ao carregar dados da proposta');
      }
      
      setIsLoading(false);
    };
    
    if (proposalId) {
      loadProposal();
      setIsEditMode(true);
    } else {
      setIsEditMode(false);
      setFormData({...defaultFormData});
    }
  }, [proposalId]);

  // Update form data when a quote request is selected
  useEffect(() => {
    if (selectedQuote && quoteRequests?.length && !isEditMode) {
      const selectedQuoteData = quoteRequests.find(q => q.id === selectedQuote);
      
      if (selectedQuoteData) {
        console.log('Selected quote data:', selectedQuoteData);
        
        setFormData(prev => ({
          ...prev,
          client_name: selectedQuoteData.name || '',
          client_email: selectedQuoteData.email || '',
          client_phone: selectedQuoteData.phone || '',
          event_type: selectedQuoteData.event_type || '',
          event_date: selectedQuoteData.event_date || '',
          event_location: selectedQuoteData.event_location || '',
          quote_request_id: selectedQuote,
        }));
      }
    }
  }, [selectedQuote, quoteRequests, isEditMode]);

  // Handle template changes
  useEffect(() => {
    if (selectedTemplate && selectedTemplate.id !== 'default') {
      console.log('Template selected:', selectedTemplate);
      // Update form data with selected template ID
      setFormData(prev => ({ 
        ...prev, 
        template_id: selectedTemplate.id 
      }));
    }
  }, [selectedTemplate]);

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
    if (!formData.customService || formData.customService.trim() === "") return;
    
    setFormData({
      ...formData,
      services: [...formData.services, { name: formData.customService, included: true, price: 0 }],
      customService: "",
    });
  };

  const addService = () => {
    const newService: Service = {
      name: 'Novo Serviço',
      description: '',
      price: 0,
      included: true
    };
    setFormData(prev => ({
      ...prev,
      services: [...prev.services, newService]
    }));
  };

  const removeService = (index: number) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
    }));
  };

  const updateService = (index: number, updates: Partial<Service>) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.map((service, i) => 
        i === index ? { ...service, ...updates } : service
      )
    }));
  };

  const resetForm = () => {
    setFormData({...defaultFormData});
    setSelectedQuote("");
    setProposalId(undefined);
    setIsEditMode(false);
    setProposal(null);
    setSelectedTemplate(null);
  };

  const saveProposalHandler = async (): Promise<string | null> => {
    setIsSaving(true);
    
    try {
      console.log('Saving proposal with data:', formData);
      console.log('Selected template:', selectedTemplate);
      
      // Convert string values to appropriate types and format for the API
      // Use the correct template_id from the HTML template table
      const proposalData = {
        ...formData,
        total_price: parseFloat(formData.total_price) || 0,
        template_id: selectedTemplate?.id || null
      };
      
      console.log('Processed proposal data for saving:', proposalData);
      
      const savedId = await saveProposal(proposalData);
      
      if (!savedId) {
        toast.error('Não foi possível salvar a proposta');
        throw new Error('Não foi possível salvar a proposta');
      }
      
      console.log("Proposal saved with ID:", savedId);
      toast.success('Proposta salva com sucesso!');
      
      if (!isEditMode) {
        setProposalId(savedId);
        setIsEditMode(true);
      }
      
      return savedId;
    } catch (error: any) {
      console.error('Error saving proposal:', error);
      toast.error(`Erro ao salvar proposta: ${error.message}`);
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async (): Promise<boolean> => {
    const savedId = await saveProposalHandler();
    return !!savedId;
  };

  const deleteProposalHandler = async (): Promise<boolean> => {
    if (!proposalId) return false;
    
    setIsDeleting(true);
    const success = await deleteProposal(proposalId);
    
    if (success) {
      resetForm();
    }
    
    setIsDeleting(false);
    return success;
  };

  const sendProposalEmailHandler = async (): Promise<boolean> => {
    if (!proposal) return false;
    
    setIsSending(true);
    const success = await sendProposalByEmail(proposal);
    setIsSending(false);
    
    return success;
  };

  const saveProposalPdfUrl = async (url: string): Promise<boolean> => {
    if (!proposalId) return false;
    
    console.log('Saving PDF URL to proposal:', url);
    const success = await savePdfUrl(proposalId, url);
    
    // Update local proposal object with the PDF URL
    if (success && proposal) {
      setProposal({...proposal, pdf_url: url});
    }
    
    return success;
  };

  return {
    selectedQuote,
    isLoading,
    isSaving,
    isDeleting,
    isSending,
    generatingPDF,
    proposal,
    formData,
    isEditMode,
    proposalId,
    selectedTemplate,
    isSubmitting: isSaving,
    setSelectedQuote,
    setIsLoading,
    setIsSaving,
    setGeneratingPDF,
    setProposal,
    setFormData,
    setSelectedTemplate,
    handleQuoteSelect,
    handleFormChange,
    handleServiceChange,
    handleCustomServiceAdd,
    saveProposal: saveProposalHandler,
    deleteProposal: deleteProposalHandler,
    sendProposalEmail: sendProposalEmailHandler,
    saveProposalPdfUrl,
    resetForm,
    setProposalId,
    handleSubmit,
    addService,
    removeService,
    updateService
  };
}
