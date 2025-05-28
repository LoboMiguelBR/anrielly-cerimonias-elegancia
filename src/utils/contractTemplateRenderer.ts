
import { ContractData } from '@/components/admin/hooks/contract/types';

/**
 * Substitui todas as variáveis do template pelos dados reais do contrato
 */
export const replaceTemplateVariables = (content: string, contract: ContractData): string => {
  if (!content || !contract) return content;

  const formatCurrency = (value: number | undefined | null): string => {
    if (!value) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string | undefined | null): string => {
    if (!dateString) return 'A definir';
    try {
      return new Date(dateString).toLocaleDateString('pt-BR');
    } catch {
      return 'Data inválida';
    }
  };

  const formatTime = (timeString: string | undefined | null): string => {
    if (!timeString) return 'A definir';
    return timeString;
  };

  // Mapeamento de todas as variáveis possíveis
  const variables: Record<string, string> = {
    '{NOME_CLIENTE}': contract.client_name || '',
    '{EMAIL_CLIENTE}': contract.client_email || '',
    '{TELEFONE_CLIENTE}': contract.client_phone || '',
    '{ENDERECO_CLIENTE}': contract.client_address || '',
    '{PROFISSAO_CLIENTE}': contract.client_profession || '',
    '{ESTADO_CIVIL}': contract.civil_status || '',
    '{TIPO_EVENTO}': contract.event_type || '',
    '{DATA_EVENTO}': formatDate(contract.event_date),
    '{HORARIO_EVENTO}': formatTime(contract.event_time),
    '{LOCAL_EVENTO}': contract.event_location || '',
    '{VALOR_TOTAL}': formatCurrency(contract.total_price),
    '{ENTRADA}': formatCurrency(contract.down_payment),
    '{DATA_ENTRADA}': formatDate(contract.down_payment_date),
    '{VALOR_RESTANTE}': formatCurrency(contract.remaining_amount),
    '{DATA_PAGAMENTO_RESTANTE}': formatDate(contract.remaining_payment_date),
    '{VERSAO}': `v${contract.version || 1}`,
    '{DATA_VERSAO}': formatDate(contract.version_timestamp || contract.created_at),
    '{OBSERVACOES}': contract.notes || '',
    '{DATA_ASSINATURA}': contract.signed_at ? formatDate(contract.signed_at) : 'Não assinado',
    '{NOME_EMPRESA}': 'Anrielly Gomes - Mestre de Cerimônia',
    '{TELEFONE_EMPRESA}': '(24) 99268-9947',
    '{EMAIL_EMPRESA}': 'contato@anriellygomes.com.br'
  };

  // Substituir todas as variáveis
  let processedContent = content;
  Object.entries(variables).forEach(([variable, value]) => {
    const regex = new RegExp(variable.replace(/[{}]/g, '\\$&'), 'g');
    processedContent = processedContent.replace(regex, value);
  });

  return processedContent;
};

/**
 * Combina HTML content com CSS para renderização completa
 */
export const combineTemplateWithStyles = (htmlContent: string, cssContent?: string): string => {
  if (!cssContent) {
    return htmlContent;
  }

  // Criar CSS com escopo isolado
  const scopedCss = `
    <style scoped>
      .contract-content {
        max-width: 100%;
        overflow-wrap: break-word;
        word-wrap: break-word;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        line-height: 1.6;
        color: #333;
      }
      .contract-content * {
        max-width: 100%;
      }
      ${cssContent}
    </style>
  `;

  // Se já existe uma tag <style>, substituir
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
 * Renderiza o template completo com dados e estilos
 */
export const renderContractTemplate = (
  htmlContent: string,
  cssContent: string | undefined,
  contract: ContractData
): string => {
  // Primeiro substituir variáveis
  const contentWithVariables = replaceTemplateVariables(htmlContent, contract);
  
  // Depois aplicar estilos
  return combineTemplateWithStyles(contentWithVariables, cssContent);
};
