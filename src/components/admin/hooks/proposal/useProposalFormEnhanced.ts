import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { ProposalFormData, ProposalData, QuoteRequest, Service } from './types';
import { fetchProposal, saveProposal, deleteProposal, sendProposalByEmail, savePdfUrl } from './proposalApi';
import { proposalTemplatesApi, ProposalTemplateData } from './api/proposalTemplates';

interface Professional {
  id: string;
  name: string;
  email: string;
  phone: string;
  category: string;
  city: string;
}

const defaultFormData: ProposalFormData = {
  client_name: '',
  client_email: '',
  client_phone: '',
  event_type: '',
  event_date: '',
  event_location: '',
  validity_date: '',
  services: [],
  total_price: '0',
  payment_terms: '',
  notes: '',
  quote_request_id: '',
  template_id: '',
  status: 'draft',
  customService: ''
};

export interface UseProposalFormEnhancedReturn {
  // Form state
  formData: ProposalFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProposalFormData>>;
  
  // Client selection
  selectedClientType: 'lead' | 'professional' | '';
  selectedClientId: string;
  setSelectedClientType: (type: 'lead' | 'professional') => void;
  setSelectedClientId: (id: string) => void;
  
  // Financial calculations
  totalPrice: string;
  discount: string;
  finalPrice: string;
  setTotalPrice: (value: string) => void;
  setDiscount: (value: string) => void;
  
  // Template
  selectedTemplate: ProposalTemplateData | null;
  setSelectedTemplate: (template: ProposalTemplateData) => void;
  
  // Loading states
  isLoading: boolean;
  isSaving: boolean;
  isDeleting: boolean;
  isSending: boolean;
  generatingPDF: boolean;
  
  // Form actions
  handleFormChange: (field: keyof ProposalFormData, value: any) => void;
  handleServiceToggle: (index: number, included: boolean) => void;
  handleServiceUpdate: (index: number, updates: Partial<Service>) => void;
  handleAddService: () => void;
  handleRemoveService: (index: number) => void;
  
  // CRUD operations
  saveProposal: () => Promise<string | null>;
  deleteProposal: () => Promise<boolean>;
  sendProposalEmail: () => Promise<boolean>;
  saveProposalPdfUrl: (url: string) => Promise<boolean>;
  handleSubmit: () => Promise<boolean>;
  resetForm: () => void;
  
  // Other states
  proposal: ProposalData | null;
  isEditMode: boolean;
  proposalId: string | undefined;
}

export function useProposalFormEnhanced(
  initialProposalId?: string,
  quoteRequests: QuoteRequest[] = [],
  professionals: Professional[] = []
): UseProposalFormEnhancedReturn {
  // Form state
  const [formData, setFormData] = useState<ProposalFormData>(defaultFormData);
  const [proposal, setProposal] = useState<ProposalData | null>(null);
  const [proposalId, setProposalId] = useState<string | undefined>(initialProposalId);
  const [isEditMode, setIsEditMode] = useState<boolean>(!!initialProposalId);
  
  // Client selection
  const [selectedClientType, setSelectedClientType] = useState<'lead' | 'professional' | ''>('');
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  
  // Financial state
  const [totalPrice, setTotalPrice] = useState<string>('0');
  const [discount, setDiscount] = useState<string>('0');
  const [finalPrice, setFinalPrice] = useState<string>('0');
  
  // Template
  const [selectedTemplate, setSelectedTemplate] = useState<ProposalTemplateData | null>(null);
  
  // Loading states
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [generatingPDF, setGeneratingPDF] = useState<boolean>(false);

  // Calculate final price when total or discount changes
  useEffect(() => {
    const total = parseFloat(totalPrice) || 0;
    const discountValue = parseFloat(discount) || 0;
    const final = Math.max(0, total - discountValue);
    setFinalPrice(final.toString());
    
    // Update form data
    setFormData(prev => ({ ...prev, total_price: final.toString() }));
  }, [totalPrice, discount]);

  // Load default template on mount
  useEffect(() => {
    const loadDefaultTemplate = async () => {
      try {
        const defaultTemplate = await proposalTemplatesApi.getDefaultProposalTemplate();
        if (defaultTemplate) {
          setSelectedTemplate(defaultTemplate);
          setFormData(prev => ({ ...prev, template_id: defaultTemplate.id }));
        }
      } catch (error) {
        console.error('Error loading default template:', error);
      }
    };
    
    if (!selectedTemplate) {
      loadDefaultTemplate();
    }
  }, [selectedTemplate]);

  // Load proposal data if in edit mode
  useEffect(() => {
    const loadProposal = async () => {
      if (!proposalId) return;
      
      setIsLoading(true);
      try {
        const data = await fetchProposal(proposalId);
        
        if (data) {
          setFormData({
            client_name: data.client_name,
            client_email: data.client_email,
            client_phone: data.client_phone,
            event_type: data.event_type,
            event_date: data.event_date || '',
            event_location: data.event_location,
            validity_date: data.validity_date,
            services: data.services,
            total_price: data.total_price.toString(),
            payment_terms: data.payment_terms,
            notes: data.notes || '',
            quote_request_id: data.quote_request_id || '',
            template_id: data.template_id || '',
            status: data.status || 'draft',
            customService: ''
          });
          
          setTotalPrice(data.total_price.toString());
          setProposal(data);
          
          // Try to determine client type
          if (data.quote_request_id) {
            setSelectedClientType('lead');
            setSelectedClientId(data.quote_request_id);
          }
        }
      } catch (error) {
        console.error('Error loading proposal:', error);
        toast.error('Erro ao carregar proposta');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (proposalId) {
      loadProposal();
    }
  }, [proposalId]);

  const handleFormChange = (field: keyof ProposalFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleServiceToggle = (index: number, included: boolean) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.map((service, i) => 
        i === index ? { ...service, included } : service
      )
    }));
  };

  const handleServiceUpdate = (index: number, updates: Partial<Service>) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.map((service, i) => 
        i === index ? { ...service, ...updates } : service
      )
    }));
  };

  const handleAddService = () => {
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

  const handleRemoveService = (index: number) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
    }));
  };

  const saveProposalHandler = async (): Promise<string | null> => {
    setIsSaving(true);
    
    try {
      const proposalData = {
        ...formData,
        total_price: parseFloat(finalPrice) || 0,
        template_id: selectedTemplate?.id || null
      };
      
      const savedId = await saveProposal(proposalData);
      
      if (!savedId) {
        toast.error('Não foi possível salvar a proposta');
        return null;
      }
      
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

  const saveProposalPdfUrlHandler = async (url: string): Promise<boolean> => {
    if (!proposalId) return false;
    
    const success = await savePdfUrl(proposalId, url);
    
    if (success && proposal) {
      setProposal({...proposal, pdf_url: url});
    }
    
    return success;
  };

  const resetForm = () => {
    setFormData(defaultFormData);
    setSelectedClientType('');
    setSelectedClientId('');
    setTotalPrice('0');
    setDiscount('0');
    setFinalPrice('0');
    setProposalId(undefined);
    setIsEditMode(false);
    setProposal(null);
  };

  return {
    // Form state
    formData,
    setFormData,
    
    // Client selection
    selectedClientType,
    selectedClientId,
    setSelectedClientType,
    setSelectedClientId,
    
    // Financial calculations
    totalPrice,
    discount,
    finalPrice,
    setTotalPrice,
    setDiscount,
    
    // Template
    selectedTemplate,
    setSelectedTemplate,
    
    // Loading states
    isLoading,
    isSaving,
    isDeleting,
    isSending,
    generatingPDF,
    
    // Form actions
    handleFormChange,
    handleServiceToggle,
    handleServiceUpdate,
    handleAddService,
    handleRemoveService,
    
    // CRUD operations
    saveProposal: saveProposalHandler,
    deleteProposal: deleteProposalHandler,
    sendProposalEmail: sendProposalEmailHandler,
    saveProposalPdfUrl: saveProposalPdfUrlHandler,
    handleSubmit,
    resetForm,
    
    // Other states
    proposal,
    isEditMode,
    proposalId
  };
}
