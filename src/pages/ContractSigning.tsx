
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { ContractData } from '@/components/admin/hooks/contract/types';
import ContractHeader from '@/components/admin/contracts/signing/ContractHeader';
import { ContractSignatureSection } from '@/components/admin/contracts/signing';
import { AlertCircle } from 'lucide-react';

const ContractSigning = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [contract, setContract] = useState<ContractData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signature, setSignature] = useState('');
  const [hasDrawnSignature, setHasDrawnSignature] = useState(false);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');

  useEffect(() => {
    const fetchContract = async () => {
      if (!token) {
        toast.error('Token de contrato não encontrado');
        navigate('/');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('contracts')
          .select('*')
          .eq('public_token', token)
          .single();

        if (error) {
          console.error('Error fetching contract:', error);
          toast.error('Contrato não encontrado');
          navigate('/');
          return;
        }

        const contractData: ContractData = {
          ...data,
          status: data.status as ContractData['status']
        };

        setContract(contractData);
        setClientName(contractData.client_name);
        setClientEmail(contractData.client_email);
      } catch (error) {
        console.error('Error:', error);
        toast.error('Erro ao carregar contrato');
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    fetchContract();
  }, [token, navigate]);

  const handleSignContract = async () => {
    if (!contract || !signature || !hasDrawnSignature) {
      toast.error('Por favor, assine o contrato antes de continuar');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke('contract-signed', {
        body: {
          contractId: contract.id,
          signature,
          clientName,
          clientEmail,
          ipAddress: await fetch('https://api.ipify.org?format=json')
            .then(res => res.json())
            .then(data => data.ip)
            .catch(() => 'unknown')
        }
      });

      if (error) throw error;

      toast.success('Contrato assinado com sucesso!');
      
      // Refresh contract data
      const { data: updatedData } = await supabase
        .from('contracts')
        .select('*')
        .eq('id', contract.id)
        .single();

      if (updatedData) {
        const updatedContract: ContractData = {
          ...updatedData,
          status: updatedData.status as ContractData['status']
        };
        setContract(updatedContract);
      }
    } catch (error) {
      console.error('Error signing contract:', error);
      toast.error('Erro ao assinar contrato');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-rose-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm sm:text-base">Carregando contrato...</p>
        </div>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md mx-auto shadow-lg">
          <CardContent className="text-center py-6 sm:py-8">
            <AlertCircle className="h-8 w-8 sm:h-12 sm:w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
              Contrato não encontrado
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mb-4 px-4">
              O contrato solicitado não foi encontrado ou o link pode ter expirado.
            </p>
            <Button 
              onClick={() => navigate('/')}
              className="w-full sm:w-auto"
            >
              Voltar ao Site
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isAlreadySigned = contract.status === 'signed';

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 md:py-8">
      <ContractHeader contract={contract} isAlreadySigned={isAlreadySigned} />
      
      <ContractSignatureSection
        contract={contract}
        signature={signature}
        onSignatureChange={setSignature}
        hasDrawnSignature={hasDrawnSignature}
        onHasDrawnSignatureChange={setHasDrawnSignature}
        clientName={clientName}
        onClientNameChange={setClientName}
        clientEmail={clientEmail}
        onClientEmailChange={setClientEmail}
        isSubmitting={isSubmitting}
        onSubmit={handleSignContract}
      />
    </div>
  );
};

export default ContractSigning;
