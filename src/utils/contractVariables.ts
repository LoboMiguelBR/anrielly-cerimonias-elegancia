
import { ContractData } from '@/components/admin/hooks/contract/types';
import { numberToText } from './numberToText';

// Função para obter dados do usuário/navegador
export const getBrowserInfo = () => {
  return {
    ip_address: '', // Será preenchido via API
    user_agent: navigator.userAgent,
    current_time: new Date().toLocaleTimeString('pt-BR'),
    current_date: new Date().toLocaleDateString('pt-BR')
  };
};

// Função para gerar hash do documento
export const generateDocumentHash = (content: string): string => {
  // Implementação simples de hash (pode ser melhorada com uma biblioteca)
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Converter para 32-bit integer
  }
  return Math.abs(hash).toString(16);
};

// Função para substituir variáveis no template
export const replaceContractVariables = (
  template: string,
  contract: ContractData,
  additionalData?: {
    ip_address?: string;
    client_signature?: string;
    company_signature?: string;
    document_hash?: string;
  }
): string => {
  const browserInfo = getBrowserInfo();
  
  const variables = {
    // Dados básicos do cliente
    '{{client_name}}': contract.client_name || '',
    '{{client_email}}': contract.client_email || '',
    '{{client_phone}}': contract.client_phone || '',
    '{{client_address}}': contract.client_address || '',
    '{{client_profession}}': contract.client_profession || '',
    '{{civil_status}}': contract.civil_status || '',
    
    // Dados do evento
    '{{event_type}}': contract.event_type || '',
    '{{event_date}}': contract.event_date ? new Date(contract.event_date).toLocaleDateString('pt-BR') : '',
    '{{event_time}}': contract.event_time || '',
    '{{event_location}}': contract.event_location || '',
    
    // Dados financeiros
    '{{total_price}}': contract.total_price ? `R$ ${contract.total_price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '',
    '{{total_price_extenso}}': contract.total_price ? numberToText(contract.total_price) : '',
    '{{down_payment}}': contract.down_payment ? `R$ ${contract.down_payment.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '',
    '{{down_payment_date}}': contract.down_payment_date ? new Date(contract.down_payment_date).toLocaleDateString('pt-BR') : '',
    '{{remaining_amount}}': contract.remaining_amount ? `R$ ${contract.remaining_amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '',
    '{{remaining_payment_date}}': contract.remaining_payment_date ? new Date(contract.remaining_payment_date).toLocaleDateString('pt-BR') : '',
    
    // Dados de versionamento (NOVAS VARIÁVEIS)
    '{{version}}': `v${contract.version || 1}`,
    '{{version_date}}': contract.version_timestamp ? new Date(contract.version_timestamp).toLocaleDateString('pt-BR') : new Date().toLocaleDateString('pt-BR'),
    
    // Dados de assinatura e auditoria
    '{{current_date}}': browserInfo.current_date,
    '{{current_time}}': browserInfo.current_time,
    '{{ip_address}}': additionalData?.ip_address || contract.signer_ip || '',
    '{{user_agent}}': browserInfo.user_agent,
    '{{client_signature}}': additionalData?.client_signature || '',
    '{{company_signature}}': additionalData?.company_signature || '',
    '{{document_hash}}': additionalData?.document_hash || '',
    
    // Observações
    '{{notes}}': contract.notes || ''
  };

  let result = template;
  
  // Substituir todas as variáveis
  Object.entries(variables).forEach(([variable, value]) => {
    result = result.replace(new RegExp(variable.replace(/[{}]/g, '\\$&'), 'g'), value);
  });
  
  return result;
};

// Lista de variáveis disponíveis para o editor
export const getAvailableVariables = () => [
  // Dados do Cliente
  '{{client_name}}', '{{client_email}}', '{{client_phone}}', '{{client_address}}',
  '{{client_profession}}', '{{civil_status}}',
  
  // Dados do Evento
  '{{event_type}}', '{{event_date}}', '{{event_time}}', '{{event_location}}',
  
  // Dados Financeiros
  '{{total_price}}', '{{total_price_extenso}}', '{{down_payment}}', '{{down_payment_date}}',
  '{{remaining_amount}}', '{{remaining_payment_date}}',
  
  // Dados de Versionamento (NOVAS VARIÁVEIS)
  '{{version}}', '{{version_date}}',
  
  // Dados de Assinatura
  '{{current_date}}', '{{current_time}}', '{{ip_address}}', '{{user_agent}}',
  '{{client_signature}}', '{{company_signature}}', '{{document_hash}}',
  
  // Observações
  '{{notes}}'
];
