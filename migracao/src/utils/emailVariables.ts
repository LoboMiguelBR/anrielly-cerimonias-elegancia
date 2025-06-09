
import { ContractData } from '@/components/admin/hooks/contract/types';

// Função para gerar hash SHA256 do conteúdo do contrato
export const generateContractHash = (contract: ContractData): string => {
  const contractContent = JSON.stringify({
    client_name: contract.client_name,
    client_email: contract.client_email,
    event_type: contract.event_type,
    event_date: contract.event_date,
    total_price: contract.total_price,
    created_at: contract.created_at
  });
  
  // Implementação simples de hash (em produção, usar crypto.subtle.digest)
  let hash = 0;
  for (let i = 0; i < contractContent.length; i++) {
    const char = contractContent.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(8, '0').toUpperCase();
};

// Função para gerar URL do contrato (prioriza slug)
export const generateContractUrl = (contract: ContractData): string => {
  const baseUrl = window.location.origin;
  
  // Usar slug se disponível, senão usar token público
  const identifier = contract.public_slug || contract.public_token;
  
  return `${baseUrl}/contrato/${identifier}`;
};

// Variáveis disponíveis para templates de email
export const emailTemplateVariables = [
  // Dados do Cliente
  { label: 'Nome do Cliente', value: '{NOME_CLIENTE}', variable: '{{NOME_CLIENTE}}' },
  { label: 'Email do Cliente', value: '{EMAIL_CLIENTE}', variable: '{{EMAIL_CLIENTE}}' },
  { label: 'Telefone do Cliente', value: '{TELEFONE_CLIENTE}', variable: '{{TELEFONE_CLIENTE}}' },
  { label: 'Endereço do Cliente', value: '{ENDERECO_CLIENTE}', variable: '{{ENDERECO_CLIENTE}}' },
  { label: 'Profissão do Cliente', value: '{PROFISSAO_CLIENTE}', variable: '{{PROFISSAO_CLIENTE}}' },
  { label: 'Estado Civil', value: '{ESTADO_CIVIL}', variable: '{{ESTADO_CIVIL}}' },
  
  // Dados do Evento
  { label: 'Tipo de Evento', value: '{TIPO_EVENTO}', variable: '{{TIPO_EVENTO}}' },
  { label: 'Data do Evento', value: '{DATA_EVENTO}', variable: '{{DATA_EVENTO}}' },
  { label: 'Horário do Evento', value: '{HORARIO_EVENTO}', variable: '{{HORARIO_EVENTO}}' },
  { label: 'Local do Evento', value: '{LOCAL_EVENTO}', variable: '{{LOCAL_EVENTO}}' },
  
  // Dados Financeiros
  { label: 'Valor Total', value: '{VALOR_TOTAL}', variable: '{{VALOR_TOTAL}}' },
  { label: 'Entrada', value: '{ENTRADA}', variable: '{{ENTRADA}}' },
  { label: 'Data da Entrada', value: '{DATA_ENTRADA}', variable: '{{DATA_ENTRADA}}' },
  { label: 'Valor Restante', value: '{VALOR_RESTANTE}', variable: '{{VALOR_RESTANTE}}' },
  { label: 'Data Pagamento Restante', value: '{DATA_PAGAMENTO_RESTANTE}', variable: '{{DATA_PAGAMENTO_RESTANTE}}' },
  
  // Dados de Versionamento (NOVAS VARIÁVEIS)
  { label: 'Versão do Contrato', value: '{VERSAO}', variable: '{{VERSAO}}' },
  { label: 'Data da Versão', value: '{DATA_VERSAO}', variable: '{{DATA_VERSAO}}' },
  
  // Links e URLs
  { label: 'Link do Contrato', value: '{LINK_CONTRATO}', variable: '{{LINK_CONTRATO}}' },
  
  // Dados de Auditoria e Segurança
  { label: 'IP do Assinante', value: '{IP_ASSINANTE}', variable: '{{IP_ASSINANTE}}' },
  { label: 'Navegador/Dispositivo', value: '{USER_AGENT}', variable: '{{USER_AGENT}}' },
  { label: 'Hash do Contrato', value: '{HASH_CONTRATO}', variable: '{{HASH_CONTRATO}}' },
  { label: 'Data de Assinatura', value: '{DATA_ASSINATURA}', variable: '{{DATA_ASSINATURA}}' },
  { label: 'Hora de Assinatura', value: '{HORA_ASSINATURA}', variable: '{{HORA_ASSINATURA}}' },
  
  // Dados da Empresa
  { label: 'Nome da Empresa', value: '{NOME_EMPRESA}', variable: '{{NOME_EMPRESA}}' },
  { label: 'Telefone da Empresa', value: '{TELEFONE_EMPRESA}', variable: '{{TELEFONE_EMPRESA}}' },
  { label: 'Email da Empresa', value: '{EMAIL_EMPRESA}', variable: '{{EMAIL_EMPRESA}}' },
  
  // Observações
  { label: 'Observações', value: '{OBSERVACOES}', variable: '{{OBSERVACOES}}' }
];

// Função para substituir variáveis em templates de email
export const replaceEmailVariables = (
  template: string,
  contract: ContractData,
  additionalData?: {
    contractUrl?: string;
    signerIp?: string;
    userAgent?: string;
    contractHash?: string;
    signedAt?: string;
  }
): string => {
  const contractHash = additionalData?.contractHash || generateContractHash(contract);
  const contractUrl = additionalData?.contractUrl || generateContractUrl(contract);
  const signedDate = additionalData?.signedAt ? new Date(additionalData.signedAt) : new Date();
  
  const variables = {
    // Dados do Cliente
    '{{NOME_CLIENTE}}': contract.client_name || '',
    '{{EMAIL_CLIENTE}}': contract.client_email || '',
    '{{TELEFONE_CLIENTE}}': contract.client_phone || '',
    '{{ENDERECO_CLIENTE}}': contract.client_address || '',
    '{{PROFISSAO_CLIENTE}}': contract.client_profession || '',
    '{{ESTADO_CIVIL}}': contract.civil_status || '',
    
    // Dados do Evento
    '{{TIPO_EVENTO}}': contract.event_type || '',
    '{{DATA_EVENTO}}': contract.event_date ? new Date(contract.event_date).toLocaleDateString('pt-BR') : '',
    '{{HORARIO_EVENTO}}': contract.event_time || '',
    '{{LOCAL_EVENTO}}': contract.event_location || '',
    
    // Dados Financeiros
    '{{VALOR_TOTAL}}': contract.total_price ? `R$ ${contract.total_price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '',
    '{{ENTRADA}}': contract.down_payment ? `R$ ${contract.down_payment.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '',
    '{{DATA_ENTRADA}}': contract.down_payment_date ? new Date(contract.down_payment_date).toLocaleDateString('pt-BR') : '',
    '{{VALOR_RESTANTE}}': contract.remaining_amount ? `R$ ${contract.remaining_amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '',
    '{{DATA_PAGAMENTO_RESTANTE}}': contract.remaining_payment_date ? new Date(contract.remaining_payment_date).toLocaleDateString('pt-BR') : '',
    
    // Dados de Versionamento (NOVAS VARIÁVEIS IMPORTANTES)
    '{{VERSAO}}': `v${contract.version || 1}`,
    '{{DATA_VERSAO}}': contract.version_timestamp ? new Date(contract.version_timestamp).toLocaleDateString('pt-BR') : new Date().toLocaleDateString('pt-BR'),
    
    // Links (usando slug personalizado)
    '{{LINK_CONTRATO}}': contractUrl,
    
    // Dados de Auditoria e Segurança
    '{{IP_ASSINANTE}}': additionalData?.signerIp || '',
    '{{USER_AGENT}}': additionalData?.userAgent || '',
    '{{HASH_CONTRATO}}': contractHash,
    '{{DATA_ASSINATURA}}': signedDate.toLocaleDateString('pt-BR'),
    '{{HORA_ASSINATURA}}': signedDate.toLocaleTimeString('pt-BR'),
    
    // Dados da Empresa
    '{{NOME_EMPRESA}}': 'Anrielly Gomes - Mestre de Cerimônia',
    '{{TELEFONE_EMPRESA}}': '(24) 99268-9947',
    '{{EMAIL_EMPRESA}}': 'contato@anriellygomes.com.br',
    
    // Observações
    '{{OBSERVACOES}}': contract.notes || ''
  };

  let result = template;
  
  // Substituir todas as variáveis
  Object.entries(variables).forEach(([variable, value]) => {
    result = result.replace(new RegExp(variable.replace(/[{}]/g, '\\$&'), 'g'), value);
  });
  
  return result;
};
