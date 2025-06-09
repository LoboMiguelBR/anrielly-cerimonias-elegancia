
import { useState } from 'react';
import { ContractData, ContractFormData } from '../../hooks/contract/types';
import { toast } from 'sonner';

interface UseContractActionsProps {
  createContract: (data: ContractFormData) => Promise<string | null>;
  updateContract: (id: string, data: Partial<ContractFormData>) => Promise<boolean>;
  deleteContract: (id: string) => Promise<boolean>;
}

export const useContractActions = ({ createContract, updateContract, deleteContract }: UseContractActionsProps) => {
  const [currentView, setCurrentView] = useState<'list' | 'create' | 'edit' | 'view'>('list');
  const [selectedContract, setSelectedContract] = useState<ContractData | null>(null);
  const [contractToDelete, setContractToDelete] = useState<ContractData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = () => {
    setSelectedContract(null);
    setCurrentView('create');
  };

  const handleEdit = (contract: ContractData) => {
    setSelectedContract(contract);
    setCurrentView('edit');
  };

  const handleView = (contract: ContractData) => {
    setSelectedContract(contract);
    setCurrentView('view');
  };

  const handleDownload = (contract: ContractData) => {
    if (contract.pdf_url) {
      window.open(contract.pdf_url, '_blank');
    } else {
      toast.error('PDF não disponível para este contrato');
    }
  };

  const handleDelete = (contract: ContractData) => {
    setContractToDelete(contract);
  };

  const confirmDelete = async () => {
    if (contractToDelete) {
      const success = await deleteContract(contractToDelete.id);
      if (success) {
        setContractToDelete(null);
      }
    }
  };

  const handleSubmit = async (formData: ContractFormData) => {
    setIsSubmitting(true);
    try {
      let success = false;
      
      if (currentView === 'create') {
        const contractId = await createContract(formData);
        success = !!contractId;
      } else if (currentView === 'edit' && selectedContract) {
        success = await updateContract(selectedContract.id, formData);
      }

      if (success) {
        setCurrentView('list');
        setSelectedContract(null);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setCurrentView('list');
    setSelectedContract(null);
  };

  return {
    currentView,
    selectedContract,
    contractToDelete,
    isSubmitting,
    handleCreate,
    handleEdit,
    handleView,
    handleDownload,
    handleDelete,
    confirmDelete,
    handleSubmit,
    handleCancel,
    setContractToDelete
  };
};
