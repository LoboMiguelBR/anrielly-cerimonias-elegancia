
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ContractData } from '../../hooks/contract/types';
import ContractActions from '../ContractActions';
import { Eye, Edit, Trash2, MoreHorizontal, Copy, ExternalLink, Send, Download, FileText } from 'lucide-react';
import { useContractActions } from '../actions';
import { toast } from 'sonner';

interface ContractsTableActionsProps {
  contract: ContractData;
  onView: (contract: ContractData) => void;
  onEdit: (contract: ContractData) => void;
  onDelete: (contract: ContractData) => void;
  onRefresh?: () => void;
}

const ContractsTableActions = ({
  contract,
  onView,
  onEdit,
  onDelete,
  onRefresh
}: ContractsTableActionsProps) => {
  const {
    copyToClipboard,
    openContractLink,
    openEmailDialog
  } = useContractActions(contract, onRefresh);

  const isSignedContract = contract.status === 'signed';

  const handleDownloadPDF = async () => {
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
      
      toast.success('PDF gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast.error('Erro ao gerar PDF');
    }
  };

  const generateContractHTML = (contract: ContractData) => {
    const clientSignature = contract.signature_data?.signature || contract.preview_signature_url;
    const signedAt = contract.signed_at || contract.signature_drawn_at;
    const auditData = contract.signature_data || {};
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Contrato - ${contract.client_name}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              line-height: 1.6; 
              margin: 40px;
              color: #333;
            }
            .header { 
              text-align: center; 
              margin-bottom: 30px; 
              border-bottom: 2px solid #2563eb;
              padding-bottom: 20px;
            }
            .title { 
              font-size: 24px; 
              font-weight: bold; 
              color: #2563eb; 
              margin-bottom: 10px;
            }
            .section { 
              margin: 20px 0; 
            }
            .section-title { 
              font-size: 16px; 
              font-weight: bold; 
              color: #1e40af; 
              margin: 20px 0 10px 0;
            }
            .parties { 
              background: #f8fafc; 
              padding: 15px; 
              border-left: 4px solid #2563eb; 
              margin: 20px 0;
            }
            .signature-section { 
              margin-top: 50px; 
              display: flex; 
              justify-content: space-between;
              page-break-inside: avoid;
            }
            .signature-block { 
              text-align: center; 
              width: 45%; 
            }
            .signature-line { 
              border-top: 1px solid #000; 
              margin-top: 60px; 
              padding-top: 5px;
            }
            .signature-image {
              max-width: 200px;
              max-height: 80px;
              margin: 10px 0;
              border: 1px solid #ddd;
            }
            .audit-section {
              background: #fef3c7;
              border: 1px solid #fbbf24;
              border-radius: 8px;
              padding: 15px;
              margin: 30px 0;
            }
            .legal-section {
              background: #f0fdf4;
              border: 1px solid #16a34a;
              border-radius: 8px;
              padding: 15px;
              margin: 20px 0;
            }
            .footer { 
              margin-top: 40px; 
              text-align: center; 
              font-size: 12px; 
              color: #666;
              border-top: 1px solid #e5e7eb;
              padding-top: 20px;
            }
            @media print {
              body { margin: 20px; }
              .signature-section { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE CERIMONIAL</div>
            <p>Contrato Digital com Validade Jurídica</p>
            ${contract.status === 'signed' ? '<p style="color: #16a34a; font-weight: bold;">✅ CONTRATO ASSINADO DIGITALMENTE</p>' : ''}
          </div>

          <div class="parties">
            <p><strong>CONTRATADA:</strong> Anrielly Cristina Costa Gomes, Mestre de Cerimônia, CPF: 092.005.807-85, residente na Rua Artur Luiz Correia, nº 973, Bairro San Remo, Volta Redonda - RJ, CEP: 27267-050, Telefone: (24) 99268-9947, E-mail: contato@anriellygomes.com.br</p>
            
            <p><strong>CONTRATANTE:</strong> ${contract.client_name}, ${contract.civil_status || 'estado civil não informado'}, ${contract.client_profession || 'profissão não informada'}, residente em ${contract.client_address || 'endereço não informado'}, telefone ${contract.client_phone}, e-mail ${contract.client_email}.</p>
          </div>

          <div class="section">
            <div class="section-title">CLÁUSULA PRIMEIRA – DO OBJETO</div>
            <p>O presente contrato tem como objeto a prestação de serviços profissionais de cerimonial para o evento "${contract.event_type}" a ser realizado no dia ${contract.event_date ? new Date(contract.event_date).toLocaleDateString('pt-BR') : '___/___/___'}, às ${contract.event_time || '__:__'}, no endereço ${contract.event_location || 'a ser definido'}.</p>
          </div>

          <div class="section">
            <div class="section-title">CLÁUSULA SEGUNDA – DO PREÇO E CONDIÇÕES DE PAGAMENTO</div>
            <p>O valor total dos serviços contratados é de R$ ${contract.total_price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}, a ser pago da seguinte forma:</p>
            <p>a) Entrada: R$ ${contract.down_payment ? contract.down_payment.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '0,00'}, a ser paga até ${contract.down_payment_date ? new Date(contract.down_payment_date).toLocaleDateString('pt-BR') : '___/___/___'};</p>
            <p>b) Saldo: R$ ${contract.remaining_amount ? contract.remaining_amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '0,00'}, a ser pago até ${contract.remaining_payment_date ? new Date(contract.remaining_payment_date).toLocaleDateString('pt-BR') : '___/___/___'}.</p>
          </div>

          <div class="section">
            <div class="section-title">CLÁUSULA TERCEIRA – DAS OBRIGAÇÕES DA CONTRATADA</div>
            <p>A CONTRATADA se compromete a prestar os serviços de cerimonial com profissionalismo, pontualidade e qualidade, incluindo:</p>
            <ul>
              <li>Condução completa da cerimônia de ${contract.event_type};</li>
              <li>Coordenação dos momentos protocolares;</li>
              <li>Assessoria durante todo o evento;</li>
              <li>Disponibilização de equipamentos necessários para o cerimonial.</li>
            </ul>
          </div>

          <div class="section">
            <div class="section-title">CLÁUSULA QUARTA – DAS OBRIGAÇÕES DO CONTRATANTE</div>
            <p>O CONTRATANTE se compromete a:</p>
            <ul>
              <li>Efetuar os pagamentos nas datas acordadas;</li>
              <li>Fornecer todas as informações necessárias para a realização do evento;</li>
              <li>Garantir acesso ao local do evento;</li>
              <li>Comunicar qualquer alteração com antecedência mínima de 15 dias.</li>
            </ul>
          </div>

          <div class="section">
            <div class="section-title">CLÁUSULA QUINTA – DO CANCELAMENTO</div>
            <p>Em caso de cancelamento pelo CONTRATANTE com antecedência superior a 30 dias, será devolvido 50% do valor pago. Cancelamentos com menos de 30 dias de antecedência não terão direito a reembolso.</p>
          </div>

          <div class="section">
            <div class="section-title">CLÁUSULA SEXTA – DA FORÇA MAIOR</div>
            <p>Em caso de impossibilidade de realização do evento por motivos de força maior (fenômenos naturais, pandemias, determinações governamentais), as partes acordarão nova data ou a devolução proporcional dos valores pagos.</p>
          </div>

          <div class="section">
            <div class="section-title">CLÁUSULA SÉTIMA – DO FORO</div>
            <p>Fica eleito o foro da comarca de Volta Redonda/RJ para dirimir quaisquer controvérsias oriundas do presente contrato.</p>
          </div>

          <div class="section">
            <div class="section-title">CLÁUSULA OITAVA – DISPOSIÇÕES FINAIS</div>
            <p>Este contrato é firmado em caráter irrevogável e irretratável, obrigando as partes e seus sucessores. Alterações só serão válidas se feitas por escrito e assinadas por ambas as partes.</p>
          </div>

          ${contract.notes ? `<div class="section"><div class="section-title">OBSERVAÇÕES</div><p>${contract.notes}</p></div>` : ''}

          ${contract.status === 'signed' ? `
            <div class="audit-section">
              <div class="section-title" style="color: #92400e; margin-top: 0;">🔒 DADOS DE AUDITORIA E SEGURANÇA</div>
              <p><strong>Data/Hora da Assinatura:</strong> ${signedAt ? new Date(signedAt).toLocaleString('pt-BR') : 'Não disponível'}</p>
              <p><strong>IP do Assinante:</strong> ${auditData.signer_ip || contract.signer_ip || 'Não disponível'}</p>
              <p><strong>Dispositivo:</strong> ${auditData.user_agent || contract.user_agent || 'Não disponível'}</p>
              <p><strong>Fuso Horário:</strong> ${auditData.timezone || 'America/Sao_Paulo'}</p>
              <p><strong>Versão do Contrato:</strong> ${contract.version || 1}</p>
            </div>
          ` : ''}

          <div class="signature-section">
            <div class="signature-block">
              <img src="/lovable-uploads/2fff881d-0a84-498f-bea5-b9adc67af1bd.png" alt="Assinatura Anrielly" class="signature-image" />
              <div class="signature-line">
                <strong>Anrielly Cristina Costa Gomes</strong><br>
                Mestre de Cerimônia<br>
                CPF: 092.005.807-85
              </div>
            </div>
            
            <div class="signature-block">
              ${clientSignature ? `<img src="${clientSignature}" alt="Assinatura Cliente" class="signature-image" />` : '<div style="height: 80px; border: 1px dashed #ccc; margin: 10px 0; display: flex; align-items: center; justify-content: center; color: #666;">Aguardando assinatura</div>'}
              <div class="signature-line">
                <strong>${contract.client_name}</strong><br>
                Contratante<br>
                ${signedAt ? `Assinado em: ${new Date(signedAt).toLocaleString('pt-BR')}` : 'Aguardando assinatura'}
              </div>
            </div>
          </div>

          <div class="legal-section">
            <div class="section-title" style="color: #166534; margin-top: 0;">⚖️ VALIDADE JURÍDICA</div>
            <p>Este contrato digital possui <strong>validade jurídica plena</strong> conforme:</p>
            <ul>
              <li><strong>Lei nº 14.063/2020</strong> - Lei das Assinaturas Eletrônicas</li>
              <li><strong>Marco Civil da Internet</strong> - Lei nº 12.965/2014</li>
              <li><strong>Código Civil Brasileiro</strong> - Lei nº 10.406/2002</li>
            </ul>
            <p style="margin-top: 10px;"><strong>Certificação:</strong> Todos os dados de auditoria foram capturados automaticamente para garantir a autenticidade, integridade e não-repúdio do documento digital.</p>
          </div>

          <div class="footer">
            <p><strong>Anrielly Cristina Costa Gomes - Mestre de Cerimônia</strong></p>
            <p>CPF: 092.005.807-85 | contato@anriellygomes.com.br | (24) 99268-9947</p>
            <p>Documento gerado em: ${new Date().toLocaleString('pt-BR')}</p>
            <p style="font-size: 10px; color: #999;">ID do Contrato: ${contract.id}</p>
          </div>
        </body>
      </html>
    `;
  };

  return (
    <div className="flex items-center justify-end gap-2">
      {/* Botão Ver - sempre visível */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onView(contract)}
        title="Visualizar contrato"
        className="h-8 w-8 p-0"
      >
        <Eye className="h-4 w-4" />
      </Button>

      {/* Dropdown com outras ações */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            title="Mais ações"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 bg-white border shadow-lg">
          {/* Ações para contratos não-assinados */}
          {!isSignedContract && (
            <>
              <DropdownMenuItem onClick={() => onEdit(contract)} className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-50">
                <Edit className="h-4 w-4" />
                <span>Editar Contrato</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={copyToClipboard} className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-50">
                <Copy className="h-4 w-4" />
                <span>Copiar Link</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={openContractLink} className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-50">
                <ExternalLink className="h-4 w-4" />
                <span>Abrir Contrato</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={openEmailDialog} className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-50">
                <Send className="h-4 w-4" />
                <span>Enviar por Email</span>
              </DropdownMenuItem>
            </>
          )}

          {/* Ações para contratos assinados */}
          {isSignedContract && (
            <>
              <DropdownMenuItem onClick={handleDownloadPDF} className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-50">
                <FileText className="h-4 w-4" />
                <span>Ver PDF</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDownloadPDF} className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-50">
                <Download className="h-4 w-4" />
                <span>Download PDF</span>
              </DropdownMenuItem>
            </>
          )}

          {/* Ação de exclusão - sempre presente */}
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={() => onDelete(contract)}
            className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-red-50 text-red-600 focus:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
            <span>Excluir Contrato</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* ContractActions para funcionalidades de email (oculto) */}
      <div className="hidden">
        <ContractActions 
          contract={contract} 
          onStatusUpdate={onRefresh}
        />
      </div>
    </div>
  );
};

export default ContractsTableActions;
