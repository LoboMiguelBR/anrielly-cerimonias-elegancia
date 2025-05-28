
import { ContractData } from '@/components/admin/hooks/contract/types';

/**
 * Formats currency values for contract display
 */
export const formatCurrency = (value: number | undefined | null): string => {
  if (!value) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

/**
 * Formats date strings for contract display
 */
export const formatDate = (dateString: string | undefined | null): string => {
  if (!dateString) return 'A definir';
  try {
    return new Date(dateString).toLocaleDateString('pt-BR');
  } catch {
    return 'Data inválida';
  }
};

/**
 * Formats time strings for contract display
 */
export const formatTime = (timeString: string | undefined | null): string => {
  if (!timeString) return 'A definir';
  return timeString;
};

/**
 * Creates a mapping of template variables to their values
 */
export const createVariableMapping = (contract: ContractData): Record<string, string> => {
  return {
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
};

/**
 * Substitui todas as variáveis do template pelos dados reais do contrato
 */
export const replaceTemplateVariables = (content: string, contract: ContractData): string => {
  if (!content || !contract) return content;

  const variables = createVariableMapping(contract);

  // Substituir todas as variáveis
  let processedContent = content;
  Object.entries(variables).forEach(([variable, value]) => {
    const regex = new RegExp(variable.replace(/[{}]/g, '\\$&'), 'g');
    processedContent = processedContent.replace(regex, value);
  });

  return processedContent;
};
