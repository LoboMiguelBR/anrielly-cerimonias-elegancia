
import { ContractData } from '@/components/admin/hooks/contract/types';

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
 * Gera URL da assinatura padrão da empresa (Anrielly)
 */
export const getCompanySignatureUrl = (): string => {
  // URL da assinatura da Anrielly no storage público
  return 'https://oampddkpuybkbwqggrty.supabase.co/storage/v1/object/public/proposals/assinatura-anrielly.png';
};

/**
 * Formata a assinatura do cliente para exibição
 */
export const formatClientSignature = (signatureData?: any): string => {
  if (!signatureData || !signatureData.signature) {
    return '<span style="color: #666; font-style: italic;">Aguardando assinatura</span>';
  }
  
  // Se a assinatura é uma URL de imagem
  if (typeof signatureData.signature === 'string' && signatureData.signature.startsWith('data:image')) {
    return `<img src="${signatureData.signature}" alt="Assinatura do Cliente" style="max-width: 200px; max-height: 80px; border: 1px solid #ddd; padding: 5px;" />`;
  }
  
  // Se é uma URL externa
  if (typeof signatureData.signature === 'string' && signatureData.signature.startsWith('http')) {
    return `<img src="${signatureData.signature}" alt="Assinatura do Cliente" style="max-width: 200px; max-height: 80px; border: 1px solid #ddd; padding: 5px;" />`;
  }
  
  return '<span style="color: #666; font-style: italic;">Assinatura inválida</span>';
};

/**
 * Formata a assinatura da empresa para exibição
 */
export const formatCompanySignature = (): string => {
  const signatureUrl = getCompanySignatureUrl();
  return `<div style="text-align: center; margin: 10px 0;">
    <img src="${signatureUrl}" alt="Assinatura Anrielly Gomes" style="max-width: 200px; max-height: 80px;" />
    <div style="border-top: 1px solid #000; margin-top: 5px; padding-top: 5px; font-size: 14px;">
      <strong>Anrielly Gomes</strong><br>
      Mestre de Cerimônia<br>
      CNPJ: [CNPJ da empresa]
    </div>
  </div>`;
};
