
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { contractSigningApi } from '@/components/admin/hooks/contract/api/contractSigning';
import { contractSlugApi } from '@/components/admin/hooks/contract/api/contractSlug';
import { ContractData } from '@/components/admin/hooks/contract/types';
import ContractSignatureSection from '@/components/admin/contracts/signing/ContractSignatureSection';
import SignatureCanvas from '@/components/admin/contracts/signing/SignatureCanvas';
import { replaceContractVariables, generateDocumentHash } from '@/utils/contractVariables';

const ContractSigning = () => {
  const { tokenOrSlug } = useParams<{ tokenOrSlug: string }>();
  const navigate = useNavigate();
  const [contract, setContract] = useState<ContractData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigning, setIsSigning] = useState(false);
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [contractContent, setContractContent] = useState<string>('');
  const [contractHash, setContractHash] = useState<string>('');

  useEffect(() => {
    const fetchContract = async () => {
      if (!tokenOrSlug) {
        toast.error('Token ou slug do contrato não fornecido');
        navigate('/');
        return;
      }

      try {
        setIsLoading(true);
        
        // Primeiro tenta buscar por slug, depois por token
        let contractData: ContractData | null = null;
        
        // Se contém apenas letras, números e hífens, provavelmente é um slug
        if (/^[a-z0-9-]+$/.test(tokenOrSlug)) {
          contractData = await contractSlugApi.getContractBySlug(tokenOrSlug);
        }
        
        // Se não encontrou por slug ou o formato não é de slug, tenta por token
        if (!contractData) {
          contractData = await contractSigningApi.getContractByToken(tokenOrSlug);
        }

        if (!contractData) {
          toast.error('Contrato não encontrado');
          navigate('/');
          return;
        }

        setContract(contractData);

        // Processar o conteúdo do contrato se existir template
        if (contractData.html_content) {
          const processedContent = replaceContractVariables(contractData.html_content, contractData);
          setContractContent(processedContent);
          setContractHash(generateDocumentHash(processedContent));
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
  }, [tokenOrSlug, navigate]);

  const handleSign = async () => {
    if (!contract || !signatureData) {
      toast.error('Assinatura é obrigatória');
      return;
    }

    setIsSigning(true);
    try {
      // Obter IP do usuário (simulado para desenvolvimento)
      const userIP = '127.0.0.1'; // Em produção, você pode usar um serviço para obter o IP real
      
      await contractSigningApi.signContract(
        contract.public_token,
        { signature: signatureData },
        userIP
      );

      toast.success('Contrato assinado com sucesso!');
      
      // Redirecionar para página de confirmação (pode ser criada no futuro)
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Error signing contract:', error);
      toast.error('Erro ao assinar contrato');
    } finally {
      setIsSigning(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <p>Carregando contrato...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <p>Contrato não encontrado</p>
            <Button onClick={() => navigate('/')} className="mt-4">
              Voltar ao Início
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Card>
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Assinatura de Contrato
              </h1>
              <p className="text-gray-600">
                Contrato para {contract.client_name} - {contract.event_type}
              </p>
            </div>

            {/* Conteúdo do Contrato */}
            {contractContent && (
              <div className="mb-8 p-6 bg-white border rounded-lg">
                <div 
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: contractContent }}
                />
              </div>
            )}

            {/* Canvas de Assinatura */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Sua Assinatura</h3>
              <SignatureCanvas onSignatureChange={setSignatureData} />
            </div>

            {/* Seção de Assinaturas */}
            <ContractSignatureSection 
              contract={contract} 
              contractHash={contractHash}
            />

            {/* Botão de Confirmação */}
            <div className="text-center mt-8">
              <Button
                onClick={handleSign}
                disabled={!signatureData || isSigning}
                size="lg"
                className="px-8 py-3"
              >
                {isSigning ? 'Assinando...' : 'Assinar Contrato'}
              </Button>
            </div>

            {/* Informações Legais */}
            <div className="mt-6 text-xs text-gray-500 text-center">
              <p>
                Ao assinar este contrato, você concorda com todos os termos e condições descritos acima.
                Esta assinatura tem validade jurídica conforme a Lei nº 14.063/2020.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContractSigning;
