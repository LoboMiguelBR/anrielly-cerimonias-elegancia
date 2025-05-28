
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { uploadAnriellySignature } from './anriellySignatureUpload';

/**
 * Converte base64 em Blob
 */
const base64ToBlob = (base64: string): Blob => {
  const byteCharacters = atob(base64.split(',')[1]);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: 'image/png' });
};

/**
 * Salva assinatura no storage e retorna URL pública
 */
export const saveSignatureToStorage = async (
  base64Signature: string,
  contractId?: string
): Promise<string> => {
  try {
    const blob = base64ToBlob(base64Signature);
    const fileName = `signature_${contractId || uuidv4()}_${Date.now()}.png`;
    
    console.log('Salvando assinatura no storage:', fileName);

    const { data, error } = await supabase.storage
      .from('signatures')
      .upload(fileName, blob, {
        contentType: 'image/png',
        upsert: true
      });

    if (error) {
      console.error('Erro ao fazer upload da assinatura:', error);
      throw error;
    }

    const { data: urlData } = supabase.storage
      .from('signatures')
      .getPublicUrl(fileName);

    console.log('Assinatura salva com sucesso:', urlData.publicUrl);
    return urlData.publicUrl;
  } catch (error) {
    console.error('Erro no saveSignatureToStorage:', error);
    throw error;
  }
};

/**
 * Obtém URL da assinatura da empresa (Anrielly)
 */
export const getCompanySignatureUrl = async (): Promise<string> => {
  try {
    // Primeiro tentar buscar assinatura existente no storage
    const { data: existingFile } = await supabase.storage
      .from('signatures')
      .list('', { search: 'anrielly-signature.png' });

    if (existingFile && existingFile.length > 0) {
      const { data: urlData } = supabase.storage
        .from('signatures')
        .getPublicUrl('anrielly-signature.png');
      
      console.log('Usando assinatura da empresa existente:', urlData.publicUrl);
      return urlData.publicUrl;
    }

    // Se não existe, fazer upload
    console.log('Assinatura não encontrada no storage, fazendo upload...');
    return await uploadAnriellySignature();
  } catch (error) {
    console.error('Erro ao obter assinatura da empresa:', error);
    // Fallback para a imagem local
    return '/lovable-uploads/2fff881d-0a84-498f-bea5-b9adc67af1bd.png';
  }
};

/**
 * Verifica se uma URL de assinatura é válida
 */
export const validateSignatureUrl = (url: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
};
