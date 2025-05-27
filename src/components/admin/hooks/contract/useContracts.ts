
import { useState, useEffect } from 'react';
import { contractApi } from './contractApi';
import { ContractData, ContractFormData } from './types';
import { toast } from 'sonner';

export const useContracts = () => {
  const [contracts, setContracts] = useState<ContractData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchContracts = async () => {
    try {
      setIsLoading(true);
      const data = await contractApi.getContracts();
      setContracts(data);
    } catch (error) {
      console.error('Error fetching contracts:', error);
      toast.error('Erro ao carregar contratos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  const createContract = async (contractData: ContractFormData): Promise<string | null> => {
    try {
      const contractId = await contractApi.createContract(contractData);
      toast.success('Contrato criado com sucesso!');
      await fetchContracts(); // Refresh the list
      return contractId;
    } catch (error) {
      console.error('Error creating contract:', error);
      toast.error('Erro ao criar contrato');
      return null;
    }
  };

  const updateContract = async (id: string, contractData: Partial<ContractFormData>): Promise<boolean> => {
    try {
      await contractApi.updateContract(id, contractData);
      toast.success('Contrato atualizado com sucesso!');
      await fetchContracts(); // Refresh the list
      return true;
    } catch (error) {
      console.error('Error updating contract:', error);
      toast.error('Erro ao atualizar contrato');
      return false;
    }
  };

  const deleteContract = async (id: string): Promise<boolean> => {
    try {
      await contractApi.deleteContract(id);
      toast.success('Contrato excluído com sucesso!');
      await fetchContracts(); // Refresh the list
      return true;
    } catch (error) {
      console.error('Error deleting contract:', error);
      toast.error('Erro ao excluir contrato');
      return false;
    }
  };

  const updateContractStatus = async (id: string, status: string): Promise<boolean> => {
    try {
      await contractApi.updateContractStatus(id, status);
      toast.success('Status do contrato atualizado!');
      await fetchContracts(); // Refresh the list
      return true;
    } catch (error) {
      console.error('Error updating contract status:', error);
      toast.error('Erro ao atualizar status do contrato');
      return false;
    }
  };

  return {
    contracts,
    isLoading,
    createContract,
    updateContract,
    deleteContract,
    updateContractStatus,
    refetch: fetchContracts
  };
};
