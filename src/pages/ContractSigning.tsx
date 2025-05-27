
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { contractApi } from '@/components/admin/hooks/contract';
import { ContractData } from '@/components/admin/hooks/contract/types';
import { toast } from 'sonner';
import { Loader2, CheckCircle, AlertTriangle, FileText } from 'lucide-react';

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
  const [contractHash, setContractHash] = useState<string>('');

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
          // Gerar hash do contrato para validade jurídica
          const contractContent = renderContractContent(contractData);
          const hash = await generateContractHash(contractContent);
          setContractHash(hash);
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

  // Função para gerar hash SHA-256 do contrato
  const generateContractHash = async (content: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(content);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  // Configurar canvas para assinatura
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, []);

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
    
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setSignature('');
    setHasDrawnSignature(false);
  };

  const handleSign = async () => {
    if (!hasAgreed) {
      toast.error('Você deve concordar com os termos do contrato');
      return;
    }

    if (!hasDrawnSignature) {
      toast.error('A assinatura desenhada é obrigatória para validação jurídica do contrato.');
      return;
    }

    if (!contract || !token) return;

    setIsSigning(true);
    try {
      // Get user's IP and user agent
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const { ip } = await ipResponse.json();
      const userAgent = navigator.userAgent;

      const signatureData = {
        agreed: hasAgreed,
        signature: signature,
        timestamp: new Date().toISOString(),
        client_name: contract.client_name,
        ip_address: ip,
        user_agent: userAgent,
        contract_hash: contractHash,
        legal_compliance: {
          lei_14063_2020: true,
          marco_civil_internet: true,
          codigo_civil_brasileiro: true
        }
      };

      await contractApi.signContract(token, signatureData, ip);
      
      setIsSigned(true);
      toast.success('Contrato assinado com sucesso! Você receberá uma cópia por email.');
      
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
        
        <p><strong>CONTRATADA:</strong> Anrielly Cristina Costa Gomes, Mestre de Cerimônia, CPF: 092.005.807-85, residente na Rua Artur Luiz Correia, nº 973, Bairro San Remo, Volta Redonda - RJ, CEP: 27267-050, Telefone: (24) 99268-9947, E-mail: contato@anriellygomes.com.br</p>
        
        <p><strong>CONTRATANTE:</strong> ${contract.client_name}, ${contract.civil_status || 'estado civil não informado'}, ${contract.client_profession || 'profissão não informada'}, residente em ${contract.client_address || 'endereço não informado'}, telefone ${contract.client_phone}, e-mail ${contract.client_email}.</p>
        
        <p>As partes acima qualificadas têm entre si justo e contratado o seguinte:</p>
        
        <h2>CLÁUSULA PRIMEIRA – DO OBJETO</h2>
        <p>O presente contrato tem como objeto a prestação de serviços profissionais de cerimonial para o evento "${contract.event_type}" a ser realizado no dia ${contract.event_date ? new Date(contract.event_date).toLocaleDateString('pt-BR') : '___/___/___'}, às ${contract.event_time || '__:__'}, no endereço ${contract.event_location || 'a ser definido'}.</p>
        
        <h2>CLÁUSULA SEGUNDA – DO PREÇO E CONDIÇÕES DE PAGAMENTO</h2>
        <p>O valor total dos serviços contratados é de R$ ${contract.total_price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}, a ser pago da seguinte forma:</p>
        <p>a) Entrada: R$ ${contract.down_payment ? contract.down_payment.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '0,00'}, a ser paga até ${contract.down_payment_date ? new Date(contract.down_payment_date).toLocaleDateString('pt-BR') : '___/___/___'};</p>
        <p>b) Saldo: R$ ${contract.remaining_amount ? contract.remaining_amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '0,00'}, a ser pago até ${contract.remaining_payment_date ? new Date(contract.remaining_payment_date).toLocaleDateString('pt-BR') : '___/___/___'}.</p>
        
        <h2>CLÁUSULA TERCEIRA – DAS OBRIGAÇÕES DA CONTRATADA</h2>
        <p>A CONTRATADA se compromete a prestar os serviços de cerimonial com profissionalismo, pontualidade e qualidade, incluindo:</p>
        <ul>
          <li>Condução completa da cerimônia de ${contract.event_type};</li>
          <li>Coordenação dos momentos protocolares;</li>
          <li>Assessoria durante todo o evento;</li>
          <li>Disponibilização de equipamentos necessários para o cerimonial.</li>
        </ul>
        
        <h2>CLÁUSULA QUARTA – DAS OBRIGAÇÕES DO CONTRATANTE</h2>
        <p>O CONTRATANTE se compromete a:</p>
        <ul>
          <li>Efetuar os pagamentos nas datas acordadas;</li>
          <li>Fornecer todas as informações necessárias para a realização do evento;</li>
          <li>Garantir acesso ao local do evento;</li>
          <li>Comunicar qualquer alteração com antecedência mínima de 15 dias.</li>
        </ul>
        
        <h2>CLÁUSULA QUINTA – DO CANCELAMENTO</h2>
        <p>Em caso de cancelamento pelo CONTRATANTE com antecedência superior a 30 dias, será devolvido 50% do valor pago. Cancelamentos com menos de 30 dias de antecedência não terão direito a reembolso.</p>
        
        <h2>CLÁUSULA SEXTA – DA FORÇA MAIOR</h2>
        <p>Em caso de impossibilidade de realização do evento por motivos de força maior (fenômenos naturais, pandemias, determinações governamentais), as partes acordarão nova data ou a devolução proporcional dos valores pagos.</p>
        
        <h2>CLÁUSULA SÉTIMA – DO FORO</h2>
        <p>Fica eleito o foro da comarca de Volta Redonda/RJ para dirimir quaisquer controvérsias oriundas do presente contrato.</p>
        
        <h2>CLÁUSULA OITAVA – DISPOSIÇÕES FINAIS</h2>
        <p>Este contrato é firmado em caráter irrevogável e irretratável, obrigando as partes e seus sucessores. Alterações só serão válidas se feitas por escrito e assinadas por ambas as partes.</p>
        
        <p>E por estarem assim justas e contratadas, as partes assinam o presente instrumento digitalmente.</p>
        
        <p><strong>Data:</strong> ${new Date().toLocaleDateString('pt-BR')}</p>
        
        ${contract.notes ? `<p><strong>Observações:</strong> ${contract.notes}</p>` : ''}
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
            <h2 className="text-xl font-semibold mb-2">Contrato Assinado com Sucesso!</h2>
            <p className="text-gray-600 mb-4">
              Seu contrato foi assinado digitalmente e tem validade jurídica conforme a legislação brasileira. 
              Você receberá uma cópia por email em instantes.
            </p>
            <div className="text-sm text-gray-500 space-y-1">
              <p>Assinado em: {contract?.signed_at ? new Date(contract.signed_at).toLocaleString('pt-BR') : new Date().toLocaleString('pt-BR')}</p>
              <p>Hash do contrato: {contractHash.substring(0, 16)}...</p>
              <p>Conforme Lei nº 14.063/2020</p>
            </div>
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
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <FileText className="h-8 w-8 text-blue-600 mr-2" />
              <CardTitle className="text-2xl">Assinatura Digital de Contrato</CardTitle>
            </div>
            <p className="text-gray-600">
              <strong>Cliente:</strong> {contract.client_name} | <strong>Evento:</strong> {contract.event_type}
            </p>
            <div className="text-sm text-gray-500 mt-2">
              <p>Hash do documento: {contractHash.substring(0, 32)}...</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Contract Content */}
            <div 
              className="prose max-w-none p-6 bg-white border rounded-lg text-sm"
              dangerouslySetInnerHTML={{ __html: renderContractContent(contract) }}
            />

            {/* Legal Notice */}
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Aviso Legal:</strong> Este contrato digital possui validade jurídica conforme a Lei nº 14.063/2020 
                (Marco Legal das Assinaturas Eletrônicas), Lei nº 12.965/2014 (Marco Civil da Internet) e Código Civil Brasileiro. 
                Sua assinatura será registrada com data, hora, IP e hash do documento para fins de auditoria.
              </AlertDescription>
            </Alert>

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
                  <strong>Declaro que:</strong> Li, compreendi e aceito integralmente os termos deste contrato. 
                  Este aceite tem validade jurídica conforme Lei nº 14.063/2020, Marco Civil da Internet 
                  (Lei nº 12.965/2014) e Código Civil Brasileiro. Confirmo que todas as informações 
                  fornecidas são verdadeiras e aceito as responsabilidades descritas neste documento.
                </label>
              </div>

              {/* Signature Canvas - Mandatory */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <span className="text-red-500">*</span>
                  Assinatura Digital (obrigatória - desenhe no campo abaixo):
                </label>
                {!hasDrawnSignature && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Assinatura obrigatória:</strong> Por favor, desenhe sua assinatura no campo abaixo. 
                      A assinatura desenhada é obrigatória para conferir validade jurídica ao contrato digital.
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
                <div className="flex gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={clearSignature}
                  >
                    Limpar Assinatura
                  </Button>
                  <span className="text-xs text-gray-500 flex items-center">
                    A assinatura será registrada com timestamp e IP para validade jurídica
                  </span>
                </div>
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
                    Processando Assinatura...
                  </>
                ) : (
                  'Assinar Contrato Digitalmente'
                )}
              </Button>
              
              {(!hasAgreed || !hasDrawnSignature) && (
                <Alert variant="destructive">
                  <AlertDescription>
                    {!hasAgreed && !hasDrawnSignature && "Você deve concordar com os termos e desenhar sua assinatura"}
                    {!hasAgreed && hasDrawnSignature && "Você deve concordar com os termos do contrato"}
                    {hasAgreed && !hasDrawnSignature && "Você deve desenhar sua assinatura para validação jurídica"}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Footer */}
            <div className="text-center text-sm text-gray-500 pt-4 border-t">
              <p className="font-semibold">Anrielly Cristina Costa Gomes - Mestre de Cerimônia</p>
              <p>CPF: 092.005.807-85</p>
              <p>contato@anriellygomes.com.br | (24) 99268-9947</p>
              <p className="mt-2 text-xs">
                Contrato com validade jurídica conforme legislação brasileira
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContractSigning;
