
import { useState, useEffect } from 'react';
import { ProposalFormData, ProposalData } from './types';
import { defaultFormData } from './constants';
import { fetchProposal, saveProposalToDb, deleteProposalFromDb } from './proposalApi';

export interface UseProposalFormReturn {
  selectedQuote: string;
  isLoading: boolean;
  isSaving: boolean;
  isDeleting: boolean;
  generatingPDF: boolean;
  proposal: ProposalData | null;
  formData: ProposalFormData;
  isEditMode: boolean;
  proposalId: string | undefined;
  setSelectedQuote: React.Dispatch<React.SetStateAction<string>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSaving: React.Dispatch<React.SetStateAction<boolean>>;
  setGeneratingPDF: React.Dispatch<React.SetStateAction<boolean>>;
  setProposal: React.Dispatch<React.SetStateAction<ProposalData | null>>;
  setFormData: React.Dispatch<React.SetStateAction<ProposalFormData>>;
  handleQuoteSelect: (quoteId: string) => void;
  handleFormChange: (field: keyof ProposalFormData, value: any) => void;
  handleServiceChange: (index: number, checked: boolean) => void;
  handleCustomServiceAdd: () => void;
  saveProposal: () => Promise<string | null>;
  deleteProposal: () => Promise<boolean>;
  resetForm: () => void;
  setProposalId: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export function useProposalForm(initialProposalId?: string, selectedQuoteId?: string | null): UseProposalFormReturn {
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
    const loadProposal = async () => {
      if (!proposalId) return;
      
      setIsLoading(true);
      const data = await fetchProposal(proposalId);
      
      if (data) {
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
          quote_request_id: data.quote_request_id
        });
        
        if (data.quote_request_id) {
          setSelectedQuote(data.quote_request_id);
        }
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
    setIsSaving(true);
    const savedId = await saveProposalToDb(formData, isEditMode ? proposalId : undefined);
    
    if (savedId && !isEditMode) {
      setProposalId(savedId);
      setIsEditMode(true);
    }
    
    setIsSaving(false);
    return savedId;
  };

  const deleteProposal = async (): Promise<boolean> => {
    if (!proposalId) return false;
    
    setIsDeleting(true);
    const success = await deleteProposalFromDb(proposalId);
    
    if (success) {
      resetForm();
    }
    
    setIsDeleting(false);
    return success;
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
}
