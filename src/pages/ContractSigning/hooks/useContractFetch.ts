
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { contractSigningApi } from '@/components/admin/hooks/contract/api/contractSigning';
import { ContractData } from '@/components/admin/hooks/contract/types';
import { toast } from 'sonner';

export const useContractFetch = () => {
  const { token } = useParams<{ token: string }>();
  const [contract, setContract] = useState<ContractData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContract = async () => {
      if (!token) {
        console.error('No token provided in URL');
        setIsLoading(false);
        return;
      }

      console.log('useContractFetch: Starting fetch for token:', token);
      
      try {
        const contractData = await contractSigningApi.getContractByToken(token);
        
        if (contractData) {
          console.log('useContractFetch: Contract loaded successfully:', {
            id: contractData.id,
            client_name: contractData.client_name,
            status: contractData.status,
            has_html_content: !!contractData.html_content,
            has_css_content: !!contractData.css_content,
            template_id: contractData.template_id
          });
          
          // Log específico para debug do conteúdo
          if (!contractData.html_content) {
            console.warn('useContractFetch: Contract has no HTML content, will need to fetch template');
          }
          
          if (!contractData.css_content) {
            console.warn('useContractFetch: Contract has no CSS content, will need to fetch template CSS');
          }
          
          setContract(contractData);
        } else {
          console.error('useContractFetch: Contract not found for token:', token);
          toast.error('Contrato não encontrado');
        }
      } catch (error) {
        console.error('useContractFetch: Error fetching contract:', error);
        toast.error('Erro ao carregar contrato');
      } finally {
        setIsLoading(false);
      }
    };

    fetchContract();
  }, [token]);

  return {
    contract,
    setContract,
    isLoading
  };
};
