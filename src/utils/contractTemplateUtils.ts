
import { ContractData } from '@/components/admin/hooks/contract/types';

/**
 * Combina HTML content com CSS para renderização completa do template
 * Versão simplificada sem dependências externas
 */
export const combineHtmlWithCss = (htmlContent: string, cssContent?: string): string => {
  if (!cssContent) {
    return htmlContent;
  }

  // Criar CSS com escopo isolado para evitar conflitos
  const scopedCss = `
    <style scoped>
      .contract-content {
        max-width: 100%;
        overflow-wrap: break-word;
        word-wrap: break-word;
      }
      .contract-content * {
        max-width: 100%;
      }
      ${cssContent}
    </style>
  `;

  // Se já existe uma tag <style>, substituir o conteúdo
  if (htmlContent.includes('<style>')) {
    return htmlContent.replace(
      /<style[^>]*>[\s\S]*?<\/style>/gi,
      scopedCss
    );
  }

  // Adicionar CSS e wrapper no conteúdo
  return `${scopedCss}<div class="contract-content">${htmlContent}</div>`;
};

/**
 * Substitui variáveis do contrato no template
 * Versão simplificada sem dependências externas
 */
export const replaceContractVariables = (content: string, contract: ContractData): string => {
  return content
    .replace(/{NOME_CLIENTE}/g, contract.client_name || '')
    .replace(/{EMAIL_CLIENTE}/g, contract.client_email || '')
    .replace(/{TELEFONE_CLIENTE}/g, contract.client_phone || '')
    .replace(/{ENDERECO_CLIENTE}/g, contract.client_address || '')
    .replace(/{PROFISSAO_CLIENTE}/g, contract.client_profession || '')
    .replace(/{ESTADO_CIVIL}/g, contract.civil_status || '')
    .replace(/{TIPO_EVENTO}/g, contract.event_type || '')
    .replace(/{DATA_EVENTO}/g, contract.event_date ? new Date(contract.event_date).toLocaleDateString('pt-BR') : '')
    .replace(/{HORARIO_EVENTO}/g, contract.event_time || '')
    .replace(/{LOCAL_EVENTO}/g, contract.event_location || '')
    .replace(/{VALOR_TOTAL}/g, contract.total_price ? `R$ ${contract.total_price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '')
    .replace(/{ENTRADA}/g, contract.down_payment ? `R$ ${contract.down_payment.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '')
    .replace(/{DATA_ENTRADA}/g, contract.down_payment_date ? new Date(contract.down_payment_date).toLocaleDateString('pt-BR') : '')
    .replace(/{VALOR_RESTANTE}/g, contract.remaining_amount ? `R$ ${contract.remaining_amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '')
    .replace(/{DATA_PAGAMENTO_RESTANTE}/g, contract.remaining_payment_date ? new Date(contract.remaining_payment_date).toLocaleDateString('pt-BR') : '')
    .replace(/{VERSAO}/g, `v${contract.version || 1}`)
    .replace(/{DATA_VERSAO}/g, contract.version_timestamp ? new Date(contract.version_timestamp).toLocaleDateString('pt-BR') : new Date().toLocaleDateString('pt-BR'))
    .replace(/{OBSERVACOES}/g, contract.notes || '');
};
