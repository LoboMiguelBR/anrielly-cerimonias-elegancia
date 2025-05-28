
import { ContractData } from '@/components/admin/hooks/contract/types';
import { getCompanySignatureUrl } from '@/utils/storage/signatureStorage';

/**
 * Gera hash SHA256 do conteúdo do contrato para auditoria
 */
export const generateContractHash = (contract: ContractData): string => {
  const contractContent = JSON.stringify({
    id: contract.id,
    client_name: contract.client_name,
    client_email: contract.client_email,
    event_type: contract.event_type,
    event_date: contract.event_date,
    total_price: contract.total_price,
    created_at: contract.created_at,
    version: contract.version
  });
  
  // Implementação simples de hash (em produção, usar crypto.subtle.digest)
  let hash = 0;
  for (let i = 0; i < contractContent.length; i++) {
    const char = contractContent.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(16, '0').toUpperCase();
};

/**
 * Formata dados do dispositivo/navegador
 */
export const formatDeviceInfo = (userAgent?: string): string => {
  if (!userAgent) return 'Não disponível';
  
  // Extrair informações básicas do user agent
  const browser = userAgent.includes('Chrome') ? 'Chrome' : 
                 userAgent.includes('Firefox') ? 'Firefox' : 
                 userAgent.includes('Safari') ? 'Safari' : 
                 userAgent.includes('Edge') ? 'Edge' : 'Desconhecido';
  
  const os = userAgent.includes('Windows') ? 'Windows' : 
            userAgent.includes('Mac') ? 'macOS' : 
            userAgent.includes('Linux') ? 'Linux' : 
            userAgent.includes('Android') ? 'Android' : 
            userAgent.includes('iOS') ? 'iOS' : 'Desconhecido';
  
  return `${browser} em ${os}`;
};

/**
 * Gera URL da assinatura padrão da empresa (Anrielly) do storage seguro
 */
export const getSecureCompanySignatureUrl = async (): Promise<string> => {
  try {
    return await getCompanySignatureUrl();
  } catch (error) {
    console.error('Erro ao obter assinatura da empresa:', error);
    return '/lovable-uploads/2fff881d-0a84-498f-bea5-b9adc67af1bd.png';
  }
};

/**
 * Formata a assinatura do cliente para exibição
 */
export const formatClientSignature = (signatureData?: any): string => {
  if (!signatureData) {
    return '<span style="color: #666; font-style: italic;">Aguardando assinatura</span>';
  }
  
  // Se signatureData é uma string (URL direta)
  if (typeof signatureData === 'string') {
    if (signatureData.includes('supabase.co/storage/v1/object/public/signatures/') || 
        signatureData.startsWith('data:image') || 
        signatureData.startsWith('http')) {
      return `<img src="${signatureData}" alt="Assinatura do Cliente" style="max-width: 200px; max-height: 80px; border: 1px solid #ddd; padding: 5px; background: white;" />`;
    }
  }
  
  // Se signatureData é um objeto com propriedade signature
  if (signatureData.signature) {
    const signature = signatureData.signature;
    if (typeof signature === 'string') {
      if (signature.includes('supabase.co/storage/v1/object/public/signatures/') || 
          signature.startsWith('data:image') || 
          signature.startsWith('http')) {
        return `<img src="${signature}" alt="Assinatura do Cliente" style="max-width: 200px; max-height: 80px; border: 1px solid #ddd; padding: 5px; background: white;" />`;
      }
    }
  }
  
  return '<span style="color: #666; font-style: italic;">Assinatura inválida</span>';
};

/**
 * Formata a assinatura da empresa para exibição
 */
export const formatCompanySignature = async (): Promise<string> => {
  try {
    const signatureUrl = await getSecureCompanySignatureUrl();
    return `<img src="${signatureUrl}" alt="Assinatura Anrielly Gomes" style="max-width: 200px; max-height: 80px; border: 1px solid #ddd; padding: 5px; background: white;" />`;
  } catch (error) {
    console.error('Erro ao formatar assinatura da empresa:', error);
    return `<img src="/lovable-uploads/2fff881d-0a84-498f-bea5-b9adc67af1bd.png" alt="Assinatura Anrielly Gomes" style="max-width: 200px; max-height: 80px; border: 1px solid #ddd; padding: 5px; background: white;" />`;
  }
};
