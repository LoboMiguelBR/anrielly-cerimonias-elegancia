
import { supabase } from '@/integrations/supabase/client';

/**
 * Faz upload da assinatura da Anrielly para o storage seguro
 */
export const uploadAnriellySignature = async (): Promise<string> => {
  try {
    // URL da imagem da Anrielly no projeto
    const anriellyImageUrl = '/lovable-uploads/2fff881d-0a84-498f-bea5-b9adc67af1bd.png';
    
    console.log('Fazendo upload da assinatura da Anrielly...');
    
    // Fetch da imagem local
    const response = await fetch(anriellyImageUrl);
    if (!response.ok) {
      throw new Error('Erro ao buscar imagem da Anrielly');
    }
    
    const blob = await response.blob();
    const fileName = 'anrielly-signature.png';
    
    // Upload para o storage
    const { data, error } = await supabase.storage
      .from('signatures')
      .upload(fileName, blob, {
        contentType: 'image/png',
        upsert: true
      });

    if (error) {
      console.error('Erro ao fazer upload da assinatura da Anrielly:', error);
      throw error;
    }

    // Obter URL pública
    const { data: urlData } = supabase.storage
      .from('signatures')
      .getPublicUrl(fileName);

    console.log('Assinatura da Anrielly enviada com sucesso:', urlData.publicUrl);
    return urlData.publicUrl;
  } catch (error) {
    console.error('Erro no upload da assinatura da Anrielly:', error);
    // Fallback para a URL local
    return '/lovable-uploads/2fff881d-0a84-498f-bea5-b9adc67af1bd.png';
  }
};
