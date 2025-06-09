import { ContractData } from '@/components/admin/hooks/contract/types';
import { 
  generateContractHash, 
  formatDeviceInfo, 
  formatClientSignature, 
  formatCompanySignature 
} from './contractAuditVariables';

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
 * Formata data e hora de assinatura
 */
export const formatSignatureDateTime = (signedAt?: string | null): { date: string; time: string } => {
  if (!signedAt) {
    return {
      date: 'Não assinado',
      time: 'Não assinado'
    };
  }
  
  try {
    const signatureDate = new Date(signedAt);
    return {
      date: signatureDate.toLocaleDateString('pt-BR'),
      time: signatureDate.toLocaleTimeString('pt-BR')
    };
  } catch {
    return {
      date: 'Data inválida',
      time: 'Hora inválida'
    };
  }
};

/**
 * Creates a mapping of template variables to their values
 */
export const createVariableMapping = async (contract: ContractData): Promise<Record<string, string>> => {
  const signatureDateTime = formatSignatureDateTime(contract.signed_at);
  const contractHash = generateContractHash(contract);
  
  // Aguardar a assinatura da empresa de forma async
  const companySignature = await formatCompanySignature();
  
  // Formatar assinatura do cliente usando a nova função que suporta preview
  const clientSignature = formatClientSignature(contract);
  
  return {
    // Dados básicos do cliente
    '{NOME_CLIENTE}': contract.client_name || '',
    '{EMAIL_CLIENTE}': contract.client_email || '',
    '{TELEFONE_CLIENTE}': contract.client_phone || '',
    '{ENDERECO_CLIENTE}': contract.client_address || '',
    '{PROFISSAO_CLIENTE}': contract.client_profession || '',
    '{ESTADO_CIVIL}': contract.civil_status || '',
    
    // Dados do evento
    '{TIPO_EVENTO}': contract.event_type || '',
    '{DATA_EVENTO}': formatDate(contract.event_date),
    '{HORARIO_EVENTO}': formatTime(contract.event_time),
    '{LOCAL_EVENTO}': contract.event_location || '',
    
    // Dados financeiros
    '{VALOR_TOTAL}': formatCurrency(contract.total_price),
    '{ENTRADA}': formatCurrency(contract.down_payment),
    '{DATA_ENTRADA}': formatDate(contract.down_payment_date),
    '{VALOR_RESTANTE}': formatCurrency(contract.remaining_amount),
    '{DATA_PAGAMENTO_RESTANTE}': formatDate(contract.remaining_payment_date),
    
    // Versionamento
    '{VERSAO}': `v${contract.version || 1}`,
    '{DATA_VERSAO}': formatDate(contract.version_timestamp || contract.created_at),
    '{OBSERVACOES}': contract.notes || '',
    
    // === NOVAS VARIÁVEIS DE AUDITORIA E ASSINATURA ===
    
    // Dados de auditoria e segurança
    '{IP}': contract.signer_ip || contract.ip_address || 'Não disponível',
    '{DATA_ASSINATURA}': signatureDateTime.date,
    '{HORA_ASSINATURA}': signatureDateTime.time,
    '{DISPOSITIVO}': formatDeviceInfo(contract.user_agent),
    '{HASH_DOCUMENTO}': contractHash,
    
    // Assinaturas (agora suportando preview e final)
    '{ASSINATURA_CLIENTE}': clientSignature,
    '{ASSINATURA_CONTRATADA}': companySignature,
    
    // Dados da empresa
    '{NOME_EMPRESA}': 'Anrielly Gomes - Mestre de Cerimônia',
    '{TELEFONE_EMPRESA}': '(24) 99268-9947',
    '{EMAIL_EMPRESA}': 'contato@anriellygomes.com.br'
  };
};

/**
 * Substitui todas as variáveis do template pelos dados reais do contrato
 */
export const replaceTemplateVariables = async (content: string, contract: ContractData): Promise<string> => {
  if (!content || !contract) return content;

  const variables = await createVariableMapping(contract);

  // Substituir todas as variáveis
  let processedContent = content;
  Object.entries(variables).forEach(([variable, value]) => {
    const regex = new RegExp(variable.replace(/[{}]/g, '\\$&'), 'g');
    processedContent = processedContent.replace(regex, value);
  });

  return processedContent;
};
