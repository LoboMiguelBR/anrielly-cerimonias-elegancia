import { useState, forwardRef, useImperativeHandle } from 'react';
import { Button } from "@/components/ui/button";
import { ContractData } from '../../hooks/contract/types';
import { Download, Eye, FileText, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ContractPDFGeneratorProps {
  contract: ContractData;
  onPDFGenerated?: (url: string) => void;
  compact?: boolean;
}

interface ContractPDFGeneratorRef {
  generatePDF: () => void;
  viewPDF: () => void;
}

const ContractPDFGenerator = forwardRef<ContractPDFGeneratorRef, ContractPDFGeneratorProps>(
  ({ contract, onPDFGenerated, compact = false }, ref) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [isViewing, setIsViewing] = useState(false);

    const generateContractHTML = (contract: ContractData) => {
      const clientSignature = contract.signature_data?.signature || contract.preview_signature_url;
      const signedAt = contract.signed_at || contract.signature_drawn_at;
      const auditData = contract.signature_data || {};
      
      // Formatar data e hora de assinatura
      const formatSignatureDateTime = () => {
        if (!signedAt) return { date: 'Não assinado', time: 'Não assinado' };
        try {
          const date = new Date(signedAt);
          return {
            date: date.toLocaleDateString('pt-BR'),
            time: date.toLocaleTimeString('pt-BR')
          };
        } catch {
          return { date: 'Data inválida', time: 'Hora inválida' };
        }
      };

      const { date: signatureDate, time: signatureTime } = formatSignatureDateTime();
      
      return `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <title>Contrato - ${contract.client_name}</title>
            <style>
              @page {
                size: A4;
                margin: 2cm 1.5cm;
              }

              body {
                font-family: 'Segoe UI', 'Arial', sans-serif;
                background-color: #FFFFFF;
                color: #222222;
                margin: 0;
                padding: 0;
                line-height: 1.4;
                font-size: 14px;
              }

              .contract {
                max-width: 100%;
                margin: 0;
                background-color: #FFFFFF;
                padding: 0;
              }

              /* === PÁGINA 1: CABEÇALHO E PARTES === */
              .page-header {
                text-align: center;
                margin-bottom: 25px;
                page-break-after: avoid;
              }

              .contract h1 {
                color: #C6257E;
                text-align: center;
                border-bottom: 3px solid #C6257E;
                padding-bottom: 10px;
                margin-bottom: 15px;
                font-weight: bold;
                font-size: 20px;
                page-break-after: avoid;
              }

              .contract-intro {
                margin-bottom: 20px;
                font-size: 14px;
                page-break-after: avoid;
              }

              /* === SEÇÕES DE PARTES === */
              .parties-section {
                margin-bottom: 25px;
                page-break-inside: avoid;
              }

              .contract h2 {
                color: #C6257E;
                margin-top: 20px;
                margin-bottom: 10px;
                border-left: 5px solid #E2C572;
                padding-left: 12px;
                font-size: 16px;
                page-break-after: avoid;
              }

              .contract p {
                line-height: 1.5;
                margin-bottom: 10px;
                color: #222222;
                font-size: 14px;
              }

              /* === QUEBRA ANTES DAS CLÁUSULAS === */
              .clauses-start {
                page-break-before: always;
                margin-top: 0;
              }

              /* === CLÁUSULAS === */
              .clause-section {
                margin-bottom: 20px;
                page-break-inside: avoid;
              }

              .clause-section h2 {
                margin-top: 15px;
                margin-bottom: 8px;
              }

              .contract ul {
                margin: 8px 0 15px 20px;
                padding-left: 0;
              }

              .contract ul li {
                margin-bottom: 4px;
                line-height: 1.4;
                font-size: 13px;
              }

              /* === SEÇÃO DE ASSINATURAS === */
              .signatures-section {
                page-break-before: auto;
                page-break-inside: avoid;
                margin-top: 30px;
                margin-bottom: 20px;
              }

              .signatures {
                display: flex;
                justify-content: space-between;
                margin-top: 25px;
                gap: 20px;
                page-break-inside: avoid;
              }

              .signature-box {
                width: 48%;
                text-align: center;
                border-top: 2px solid #C6257E;
                padding-top: 10px;
              }

              .signature-box p {
                margin: 4px 0;
                font-size: 12px;
              }

              .signature-image {
                margin-top: 10px;
                min-height: 60px;
                display: flex;
                align-items: center;
                justify-content: center;
              }

              .signature-image img {
                max-width: 180px;
                max-height: 60px;
                border: 1px solid #ccc;
                border-radius: 4px;
                background: #fafafa;
              }

              .signature-placeholder {
                width: 180px;
                height: 50px;
                border: 1px dashed #ccc;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #666;
                font-size: 11px;
                margin: 0 auto;
              }

              /* === SEÇÃO DE AUDITORIA === */
              .auth-footer {
                margin-top: 25px;
                padding: 12px;
                background-color: #FAFAFC;
                border: 1px solid #E2C572;
                border-radius: 6px;
                font-size: 11px;
                color: #666;
                page-break-inside: avoid;
              }

              .auth-footer p {
                margin: 3px 0;
                font-size: 11px;
              }

              .auth-footer .version-info {
                margin-top: 8px;
                color: #999;
                font-size: 10px;
                border-top: 1px solid #E2C572;
                padding-top: 8px;
              }

              /* === CONTROLE DE QUEBRAS ESPECÍFICAS === */
              .no-break {
                page-break-inside: avoid;
              }

              .break-before {
                page-break-before: always;
              }

              .break-after {
                page-break-after: always;
              }

              /* === IMPRESSÃO === */
              @media print {
                body { 
                  margin: 0;
                  padding: 0;
                  font-size: 13px;
                }
                
                .contract {
                  margin: 0;
                  padding: 0;
                  box-shadow: none;
                  border: none;
                }
                
                .signatures, .auth-footer, .clause-section {
                  page-break-inside: avoid;
                }
                
                .clauses-start {
                  page-break-before: always;
                }
                
                h1, h2 {
                  page-break-after: avoid;
                }
                
                p {
                  orphans: 2;
                  widows: 2;
                }
              }

              /* === RESPONSIVIDADE === */
              @media (max-width: 768px) {
                .contract {
                  padding: 10px;
                }
                .contract h1 {
                  font-size: 18px;
                }
                .signatures {
                  flex-direction: column;
                  gap: 15px;
                }
                .signature-box {
                  width: 100%;
                }
                .signature-image img {
                  max-width: 150px;
                  max-height: 50px;
                }
              }
            </style>
          </head>
          <body>
            <div class="contract">
              <!-- PÁGINA 1: CABEÇALHO E PARTES -->
              <div class="page-header">
                <h1>CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE MESTRE DE CERIMÔNIA</h1>
                <div class="contract-intro">
                  <p>Pelo presente instrumento particular, as partes abaixo qualificadas:</p>
                </div>
              </div>

              <div class="parties-section no-break">
                <h2>CONTRATANTE</h2>
                <p>
                  Nome: <strong>${contract.client_name}</strong><br>
                  Estado Civil: <strong>${contract.civil_status || 'Não informado'}</strong><br>
                  Profissão: <strong>${contract.client_profession || 'Não informado'}</strong><br>
                  Endereço: <strong>${contract.client_address || 'Não informado'}</strong><br>
                  Telefone: <strong>${contract.client_phone}</strong><br>
                  E-mail: <strong>${contract.client_email}</strong>
                </p>
              </div>

              <div class="parties-section no-break">
                <h2>CONTRATADA</h2>
                <p>
                  Nome: <strong>Anrielly Cristina Costa Gomes</strong><br>
                  Profissão: <strong>Mestre de Cerimônia</strong><br>
                  CPF: <strong>092.005.807-85</strong><br>
                  Endereço: <strong>Rua Artur Luiz Correia, nº 973, Bairro San Remo, Volta Redonda - RJ</strong><br>
                  Telefone: <strong>(24) 99268-9947</strong><br>
                  E-mail: <strong>contato@anriellygomes.com.br</strong>
                </p>
              </div>

              <!-- PÁGINA 2: CLÁUSULAS 1-4 -->
              <div class="clause-section clauses-start">
                <h2>CLÁUSULA 1ª – DO OBJETO</h2>
                <p>
                  Prestação de serviços de Mestre de Cerimônia para o evento do(a) CONTRATANTE, no dia 
                  <strong>${contract.event_date ? new Date(contract.event_date).toLocaleDateString('pt-BR') : 'A definir'}</strong>, 
                  às <strong>${contract.event_time || 'A definir'}</strong>, 
                  no local <strong>${contract.event_location || 'A definir'}</strong>.
                </p>
              </div>

              <div class="clause-section no-break">
                <h2>CLÁUSULA 2ª – DOS SERVIÇOS</h2>
                <p>Serviços inclusos:</p>
                <ul>
                  <li>💍 Condução da cerimônia;</li>
                  <li>🤝 Recepção dos convidados;</li>
                  <li>👰‍♀️🤵‍♂️ Apresentação dos noivos;</li>
                  <li>📜 Leitura dos votos;</li>
                  <li>💑 Troca de alianças;</li>
                  <li>🎤 Pronunciamento dos noivos;</li>
                  <li>💖 Declaração oficial do casamento;</li>
                  <li>🙏 Agradecimentos finais;</li>
                  <li>🎉 Interação com os convidados;</li>
                  <li>⏱️ Gerenciamento do tempo e andamento da cerimônia;</li>
                  <li>📝 Atender às solicitações específicas do CONTRATANTE.</li>
                </ul>
              </div>

              <div class="clause-section no-break">
                <h2>CLÁUSULA 3ª – DO VALOR E PAGAMENTO</h2>
                <p>
                  Valor total: <strong>R$ ${contract.total_price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>.
                </p>
                <ul>
                  <li>Entrada: <strong>R$ ${contract.down_payment ? contract.down_payment.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '0,00'}</strong> até <strong>${contract.down_payment_date ? new Date(contract.down_payment_date).toLocaleDateString('pt-BR') : 'A definir'}</strong>;</li>
                  <li>Saldo restante: <strong>R$ ${contract.remaining_amount ? contract.remaining_amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '0,00'}</strong> até <strong>${contract.remaining_payment_date ? new Date(contract.remaining_payment_date).toLocaleDateString('pt-BR') : 'A definir'}</strong>.</li>
                </ul>
              </div>

              <div class="clause-section no-break">
                <h2>CLÁUSULA 4ª – DA RESCISÃO</h2>
                <p>
                  Qualquer das partes pode rescindir este contrato com 30 dias de antecedência. 
                  Se por parte do CONTRATANTE, multa de <strong>50%</strong> do valor total. 
                  Se por parte da CONTRATADA, devolução integral dos valores pagos.
                </p>
              </div>

              <!-- PÁGINA 3: CLÁUSULAS 5-7, ASSINATURAS E AUDITORIA -->
              <div class="clause-section break-before">
                <h2>CLÁUSULA 5ª – DAS DISPOSIÇÕES GERAIS</h2>
                <ul>
                  <li>🔒 Sigilo total sobre informações do CONTRATANTE;</li>
                  <li>👔 Compromisso com vestimenta adequada e profissional;</li>
                  <li>⏰ Chegada ao local com antecedência mínima de 1 hora;</li>
                  <li>📑 O CONTRATANTE deve fornecer informações precisas e local adequado para a realização da cerimônia;</li>
                  ${contract.notes ? `<li>📝 Observações adicionais: ${contract.notes}</li>` : ''}
                </ul>
              </div>

              <div class="clause-section no-break">
                <h2>CLÁUSULA 6ª – DO FORO</h2>
                <p>
                  Foro da Comarca de Volta Redonda - RJ para dirimir qualquer litígio.
                </p>
              </div>

              <div class="clause-section no-break">
                <h2>CLÁUSULA 7ª – ASSINATURA ELETRÔNICA E VALIDADE JURÍDICA</h2>
                <p>
                  Este contrato é assinado eletronicamente, com validade jurídica, conforme a 
                  <strong>Lei nº 14.063/2020</strong>, o <strong>Marco Civil da Internet (Lei nº 12.965/2014)</strong> 
                  e o <strong>Código Civil Brasileiro</strong>.
                </p>
                ${contract.status === 'signed' ? `
                  <p>Dados coletados na assinatura:</p>
                  <ul>
                    <li><strong>IP:</strong> ${auditData.signer_ip || contract.signer_ip || 'Não disponível'}</li>
                    <li><strong>Data e Hora:</strong> ${signatureDate} às ${signatureTime}</li>
                    <li><strong>Dispositivo:</strong> ${auditData.user_agent || contract.user_agent || 'Não disponível'}</li>
                    <li><strong>Hash do Documento:</strong> ${contract.id}</li>
                  </ul>
                ` : ''}
                <p>As partes firmam este instrumento, que passa a ter validade legal.</p>
              </div>

              <!-- SEÇÃO DE ASSINATURAS -->
              <div class="signatures-section no-break">
                <div class="signatures">
                  <div class="signature-box">
                    <p>Local e data: ${contract.event_location || 'Local do evento'}, ${signatureDate}</p>
                    <p><strong>CONTRATANTE:</strong></p>
                    <p>${contract.client_name}</p>
                    <div class="signature-image">
                      ${clientSignature ? 
                        `<img src="${clientSignature}" alt="Assinatura do Cliente" />` : 
                        '<div class="signature-placeholder">Aguardando assinatura</div>'
                      }
                    </div>
                  </div>

                  <div class="signature-box">
                    <p><strong>CONTRATADA:</strong></p>
                    <p>Anrielly Cristina Costa Gomes</p>
                    <div class="signature-image">
                      <img src="/lovable-uploads/2fff881d-0a84-498f-bea5-b9adc67af1bd.png" alt="Assinatura da Contratada" />
                    </div>
                  </div>
                </div>
              </div>

              <!-- SEÇÃO DE AUDITORIA -->
              ${contract.status === 'signed' ? `
                <div class="auth-footer no-break">
                  <p><strong>IP:</strong> ${auditData.signer_ip || contract.signer_ip || 'Não disponível'}</p>
                  <p><strong>Data:</strong> ${signatureDate} às ${signatureTime}</p>
                  <p><strong>Dispositivo:</strong> ${auditData.user_agent || contract.user_agent || 'Não disponível'}</p>
                  <p><strong>Hash do Documento:</strong> ${contract.id}</p>
                  <div class="version-info">
                    <strong>Versão do Contrato:</strong> v${contract.version || 1} |
                    <strong>Data da Versão:</strong> ${contract.version_timestamp ? new Date(contract.version_timestamp).toLocaleDateString('pt-BR') : new Date(contract.created_at).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              ` : ''}
            </div>
          </body>
        </html>
      `;
    };

    const generatePDF = async () => {
      setIsGenerating(true);
      try {
        const htmlContent = generateContractHTML(contract);
        
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        
        const printWindow = window.open(url, '_blank');
        if (printWindow) {
          printWindow.onload = () => {
            setTimeout(() => {
              printWindow.print();
            }, 500);
          };
        }
        
        onPDFGenerated?.(url);
        toast.success('PDF gerado com sucesso!');
      } catch (error) {
        console.error('Erro ao gerar PDF:', error);
        toast.error('Erro ao gerar PDF');
      } finally {
        setIsGenerating(false);
      }
    };

    const viewPDF = async () => {
      setIsViewing(true);
      try {
        const htmlContent = generateContractHTML(contract);
        
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        
        window.open(url, '_blank');
        
        toast.success('PDF aberto para visualização!');
      } catch (error) {
        console.error('Erro ao visualizar PDF:', error);
        toast.error('Erro ao visualizar PDF');
      } finally {
        setIsViewing(false);
      }
    };

    useImperativeHandle(ref, () => ({
      generatePDF,
      viewPDF
    }));

    if (compact) {
      return (
        <div className="flex items-center gap-2 w-full">
          <FileText className="h-4 w-4" />
          <span onClick={generatePDF} className="cursor-pointer">
            {isGenerating ? 'Gerando...' : 'Download PDF'}
          </span>
        </div>
      );
    }

    return (
      <div className="flex gap-3">
        <Button
          onClick={viewPDF}
          disabled={isViewing}
          variant="outline"
          className="flex items-center gap-2"
        >
          {isViewing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
          Ver PDF
        </Button>
        
        <Button
          onClick={generatePDF}
          disabled={isGenerating}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
        >
          {isGenerating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          Download PDF
        </Button>
      </div>
    );
  }
);

ContractPDFGenerator.displayName = 'ContractPDFGenerator';

export default ContractPDFGenerator;
