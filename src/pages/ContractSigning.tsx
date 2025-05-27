
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { contractApi } from '@/components/admin/hooks/contract';
import { ContractData } from '@/components/admin/hooks/contract/types';
import { toast } from 'sonner';
import { Loader2, CheckCircle, AlertTriangle } from 'lucide-react';

const ContractSigning = () => {
  const { token } = useParams<{ token: string }>();
  const [contract, setContract] = useState<ContractData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigning, setIsSigning] = useState(false);
  const [hasAgreed, setHasAgreed] = useState(false);
  const [signature, setSignature] = useState<string>('');
  const [isSigned, setIsSigned] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawnSignature, setHasDrawnSignature] = useState(false);

  useEffect(() => {
    const fetchContract = async () => {
      if (!token) {
        setError('Token inválido');
        setIsLoading(false);
        return;
      }

      try {
        const contractData = await contractApi.getContractByToken(token);
        if (!contractData) {
          setError('Contrato não encontrado');
        } else if (contractData.status === 'signed') {
          setIsSigned(true);
          setContract(contractData);
        } else {
          setContract(contractData);
        }
      } catch (err: any) {
        setError('Erro ao carregar contrato');
        console.error('Error fetching contract:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContract();
  }, [token]);

  const handleSignatureStart = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setHasDrawnSignature(true);
  };

  const handleSignatureMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const handleSignatureEnd = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      setSignature(canvas.toDataURL());
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignature('');
    setHasDrawnSignature(false);
  };

  const handleSign = async () => {
    if (!hasAgreed) {
      toast.error('Você deve concordar com os termos do contrato');
      return;
    }

    if (!hasDrawnSignature) {
      toast.error('A assinatura é obrigatória. Por favor, desenhe sua assinatura no campo indicado.');
      return;
    }

    if (!contract || !token) return;

    setIsSigning(true);
    try {
      // Get user's IP
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const { ip } = await ipResponse.json();

      const signatureData = {
        agreed: hasAgreed,
        signature: signature,
        timestamp: new Date().toISOString(),
        client_name: contract.client_name
      };

      await contractApi.signContract(token, signatureData, ip);
      
      setIsSigned(true);
      toast.success('Contrato assinado com sucesso!');
      
    } catch (err: any) {
      toast.error('Erro ao assinar contrato');
      console.error('Error signing contract:', err);
    } finally {
      setIsSigning(false);
    }
  };

  const renderContractContent = (contract: ContractData) => {
    return `
      <div class="contract">
        <h1>CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE CERIMONIAL</h1>
        
        <p>Por este instrumento particular, de um lado:</p>
        
        <p><strong>CONTRATADA:</strong> Anrielly Cristina Costa Gomes, Mestre de Cerimônia, CPF: 092.005.807-85, residente na Rua Artur Luiz Correia, nº 973, Bairro San Remo, Volta Redonda - RJ, Telefone: (24) 99268-9947, E-mail: contato@anriellygomes.com.br</p>
        
        <p><strong>CONTRATANTE:</strong> ${contract.client_name}, ${contract.civil_status || ''}, ${contract.client_profession || ''}, residente em ${contract.client_address || ''}, telefone ${contract.client_phone}, e-mail ${contract.client_email}.</p>
        
        <p>As partes acima qualificadas têm entre si justo e contratado o seguinte:</p>
        
        <h2>CLÁUSULA PRIMEIRA – DO OBJETO</h2>
        <p>O presente contrato tem como objeto a prestação de serviços profissionais de cerimonial para o evento a ser realizado no dia ${contract.event_date ? new Date(contract.event_date).toLocaleDateString('pt-BR') : '___/___/___'}, às ${contract.event_time || '__:__'}, no endereço ${contract.event_location || ''}.</p>
        
        <h2>CLÁUSULA SEGUNDA – DO PREÇO E CONDIÇÕES DE PAGAMENTO</h2>
        <p>O valor total dos serviços contratados é de R$ ${contract.total_price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}, a ser pago da seguinte forma:</p>
        <p>a) Entrada: R$ ${contract.down_payment ? contract.down_payment.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '0,00'}, a ser paga em ${contract.down_payment_date ? new Date(contract.down_payment_date).toLocaleDateString('pt-BR') : '___/___/___'};</p>
        <p>b) Saldo: R$ ${contract.remaining_amount ? contract.remaining_amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '0,00'}, a ser pago em ${contract.remaining_payment_date ? new Date(contract.remaining_payment_date).toLocaleDateString('pt-BR') : '___/___/___'}.</p>
        
        <h2>CLÁUSULA DÉCIMA – DISPOSIÇÕES FINAIS</h2>
        <p>E por estarem assim justas e contratadas, as partes assinam o presente instrumento em duas vias de igual teor.</p>
      </div>
    `;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Carregando contrato...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isSigned) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Contrato Assinado!</h2>
            <p className="text-gray-600 mb-4">
              Seu contrato foi assinado com sucesso. Você receberá uma cópia por email em breve.
            </p>
            <p className="text-sm text-gray-500">
              Assinado em: {contract?.signed_at ? new Date(contract.signed_at).toLocaleString('pt-BR') : ''}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!contract) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              Assinatura Digital de Contrato
            </CardTitle>
            <p className="text-center text-gray-600">
              Cliente: {contract.client_name}
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Contract Content */}
            <div 
              className="prose max-w-none p-6 bg-white border rounded-lg"
              dangerouslySetInnerHTML={{ __html: renderContractContent(contract) }}
            />

            {/* Signature Section */}
            <div className="space-y-4 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold">Assinatura Digital</h3>
              
              {/* Agreement Checkbox */}
              <div className="flex items-start space-x-3">
                <Checkbox 
                  id="agree"
                  checked={hasAgreed}
                  onCheckedChange={(checked) => setHasAgreed(!!checked)}
                />
                <label htmlFor="agree" className="text-sm leading-relaxed">
                  Declaro que li e estou de acordo com todos os termos e condições 
                  deste contrato. Confirmo que todas as informações fornecidas são 
                  verdadeiras e aceito as responsabilidades descritas neste documento.
                </label>
              </div>

              {/* Signature Canvas - Required */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <span className="text-red-500">*</span>
                  Assinatura (obrigatória - desenhe no campo abaixo):
                </label>
                {!hasDrawnSignature && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Por favor, desenhe sua assinatura no campo abaixo. A assinatura é obrigatória para finalizar o contrato.
                    </AlertDescription>
                  </Alert>
                )}
                <div className="border-2 border-gray-300 rounded bg-white">
                  <canvas
                    ref={canvasRef}
                    width={400}
                    height={150}
                    className="w-full cursor-crosshair"
                    onMouseDown={handleSignatureStart}
                    onMouseMove={handleSignatureMove}
                    onMouseUp={handleSignatureEnd}
                    onMouseLeave={handleSignatureEnd}
                  />
                </div>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={clearSignature}
                >
                  Limpar Assinatura
                </Button>
              </div>

              {/* Sign Button */}
              <Button 
                onClick={handleSign}
                disabled={!hasAgreed || !hasDrawnSignature || isSigning}
                className="w-full"
                size="lg"
              >
                {isSigning ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Assinando...
                  </>
                ) : (
                  'Assinar Contrato'
                )}
              </Button>
              
              {(!hasAgreed || !hasDrawnSignature) && (
                <p className="text-sm text-red-600 text-center">
                  {!hasAgreed && !hasDrawnSignature && "Você deve concordar com os termos e desenhar sua assinatura"}
                  {!hasAgreed && hasDrawnSignature && "Você deve concordar com os termos do contrato"}
                  {hasAgreed && !hasDrawnSignature && "Você deve desenhar sua assinatura"}
                </p>
              )}
            </div>

            {/* Footer */}
            <div className="text-center text-sm text-gray-500 pt-4 border-t">
              <p>Anrielly Gomes - Mestre de Cerimônia</p>
              <p>contato@anriellygomes.com.br | (24) 99268-9947</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContractSigning;
