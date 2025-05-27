
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contractApi } from './contractApi';
import { ContractFormData } from './types';
import { toast } from 'sonner';

export const useContracts = () => {
  const queryClient = useQueryClient();

  const {
    data: contracts = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['contracts'],
    queryFn: contractApi.getContracts
  });

  const createMutation = useMutation({
    mutationFn: contractApi.createContract,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      toast.success('Contrato criado com sucesso');
    },
    onError: (error) => {
      console.error('Erro ao criar contrato:', error);
      toast.error('Erro ao criar contrato');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ContractFormData> }) =>
      contractApi.updateContract(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      toast.success('Contrato atualizado com sucesso');
    },
    onError: (error) => {
      console.error('Erro ao atualizar contrato:', error);
      toast.error('Erro ao atualizar contrato');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: contractApi.deleteContract,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      toast.success('Contrato deletado com sucesso');
    },
    onError: (error) => {
      console.error('Erro ao deletar contrato:', error);
      toast.error('Erro ao deletar contrato');
    }
  });

  return {
    contracts,
    isLoading,
    error,
    refetch,
    createContract: async (data: ContractFormData): Promise<string> => {
      const result = await createMutation.mutateAsync(data);
      return result.id;
    },
    updateContract: async (id: string, data: Partial<ContractFormData>): Promise<boolean> => {
      try {
        await updateMutation.mutateAsync({ id, data });
        return true;
      } catch (error) {
        return false;
      }
    },
    deleteContract: async (id: string): Promise<boolean> => {
      try {
        await deleteMutation.mutateAsync(id);
        return true;
      } catch (error) {
        return false;
      }
    },
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending
  };
};
