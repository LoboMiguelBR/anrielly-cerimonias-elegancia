
import { useState, useEffect } from 'react';
import { contractApi } from './contractApi';
import { ContractData, ContractFormData } from './types';
import { toast } from 'sonner';

export const useContracts = () => {
  const [contracts, setContracts] = useState<ContractData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContracts = async () => {
    try {
      setIsLoading(true);
      const data = await contractApi.getContracts();
      setContracts(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      toast.error('Erro ao carregar contratos');
    } finally {
      setIsLoading(false);
    }
  };

  const createContract = async (contractData: ContractFormData): Promise<string | null> => {
    try {
      const contractId = await contractApi.createContract(contractData);
      await fetchContracts();
      toast.success('Contrato criado com sucesso');
      return contractId;
    } catch (err: any) {
      toast.error('Erro ao criar contrato');
      console.error('Error creating contract:', err);
      return null;
    }
  };

  const updateContract = async (id: string, contractData: Partial<ContractFormData>): Promise<boolean> => {
    try {
      await contractApi.updateContract(id, contractData);
      await fetchContracts();
      toast.success('Contrato atualizado com sucesso');
      return true;
    } catch (err: any) {
      toast.error('Erro ao atualizar contrato');
      console.error('Error updating contract:', err);
      return false;
    }
  };

  const deleteContract = async (id: string): Promise<boolean> => {
    try {
      await contractApi.deleteContract(id);
      await fetchContracts();
      toast.success('Contrato excluído com sucesso');
      return true;
    } catch (err: any) {
      toast.error('Erro ao excluir contrato');
      console.error('Error deleting contract:', err);
      return false;
    }
  };

  const updateContractStatus = async (id: string, status: string): Promise<boolean> => {
    try {
      await contractApi.updateContractStatus(id, status);
      await fetchContracts();
      toast.success('Status do contrato atualizado');
      return true;
    } catch (err: any) {
      toast.error('Erro ao atualizar status do contrato');
      console.error('Error updating contract status:', err);
      return false;
    }
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  return {
    contracts,
    isLoading,
    error,
    createContract,
    updateContract,
    deleteContract,
    updateContractStatus,
    refetch: fetchContracts
  };
};
