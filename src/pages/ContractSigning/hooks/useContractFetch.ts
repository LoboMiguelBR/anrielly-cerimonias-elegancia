
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { ContractData } from '@/components/admin/hooks/contract/types';

export const useContractFetch = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [contract, setContract] = useState<ContractData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContract = async () => {
      if (!slug) {
        toast.error('Link de contrato inválido');
        navigate('/');
        return;
      }

      try {
        console.log('Fetching contract by slug:', slug);
        
        // Buscar contrato por slug primeiro
        const { data: contractData, error: contractError } = await supabase
          .from('contracts')
          .select('*')
          .eq('public_slug', slug)
          .single();

        if (contractError || !contractData) {
          console.error('Contract not found by slug, trying by token:', contractError);
          
          // Fallback: tentar buscar por token se slug não funcionar
          const { data: tokenData, error: tokenError } = await supabase
            .from('contracts')
            .select('*')
            .eq('public_token', slug)
            .single();

          if (tokenError || !tokenData) {
            console.error('Contract not found:', tokenError);
            toast.error('Contrato não encontrado');
            navigate('/');
            return;
          }
          
          setContract({
            ...tokenData,
            status: tokenData.status as ContractData['status']
          });
        } else {
          setContract({
            ...contractData,
            status: contractData.status as ContractData['status']
          });
        }
      } catch (error) {
        console.error('Error fetching contract:', error);
        toast.error('Erro ao carregar contrato');
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    fetchContract();
  }, [slug, navigate]);

  return { contract, setContract, isLoading };
};
