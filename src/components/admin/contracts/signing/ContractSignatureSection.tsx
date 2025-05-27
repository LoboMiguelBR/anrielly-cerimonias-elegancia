
import { Card, CardContent } from "@/components/ui/card";
import { ContractData } from '../../hooks/contract/types';
import SignatureCanvas from './SignatureCanvas';

interface ContractSignatureSectionProps {
  contract: ContractData;
  contractHash: string;
}

const ContractSignatureSection = ({ contract, contractHash }: ContractSignatureSectionProps) => {
  // URL da assinatura da Anrielly (imagem fornecida)
  const anriellySignatureUrl = '/lovable-uploads/2fff881d-0a84-498f-bea5-b9adc67af1bd.png';

  return (
    <Card className="mt-6">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Assinaturas do Contrato</h3>
        
        {/* Assinatura da Anrielly */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-2">Prestadora de Serviços</h4>
          <div className="flex items-center gap-4">
            <div>
              <p className="text-sm font-medium">Anrielly Cristina Costa Gomes</p>
              <p className="text-xs text-gray-600">Mestre de Cerimônia</p>
              <p className="text-xs text-gray-600">CPF: 092.005.807-85</p>
            </div>
            <div className="ml-auto">
              <img 
                src={anriellySignatureUrl} 
                alt="Assinatura Anrielly Gomes"
                className="h-16 w-auto border border-gray-200 bg-white p-2 rounded"
              />
            </div>
          </div>
        </div>

        {/* Linha separadora */}
        <hr className="my-6" />

        {/* Área do Cliente */}
        <div>
          <h4 className="font-medium mb-4">Contratante</h4>
          <div className="mb-4">
            <p className="text-sm font-medium">{contract.client_name}</p>
            <p className="text-xs text-gray-600">{contract.client_email}</p>
            <p className="text-xs text-gray-600">{contract.client_phone}</p>
          </div>
          
          {/* Canvas de assinatura será inserido aqui via props do componente pai */}
        </div>

        {/* Informações de validação jurídica */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h5 className="text-sm font-semibold text-blue-800 mb-2">📋 Validade Jurídica</h5>
          <div className="text-xs text-blue-700 space-y-1">
            <p>• Lei nº 14.063/2020 (Marco Legal das Assinaturas Eletrônicas)</p>
            <p>• Lei nº 12.965/2014 (Marco Civil da Internet)</p>
            <p>• Código Civil Brasileiro</p>
            <p><strong>Hash do documento:</strong> {contractHash.substring(0, 32)}...</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContractSignatureSection;
