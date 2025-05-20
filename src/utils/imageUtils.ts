
/**
 * Utility functions for handling and normalizing image URLs
 */

/**
 * Normaliza uma URL para corrigir segmentos de caminho duplicados, lida com URLs absolutas e caminhos relativos
 * @param url A URL para normalizar
 * @returns A URL normalizada ou uma URL padrão se url for inválida
 */
export const normalizeImageUrl = (url: string | null | undefined): string => {
  // Valor padrão caso a URL seja nula ou undefined
  if (!url) {
    console.warn('[normalizeImageUrl] URL vazia recebida, retornando placeholder');
    return '/placeholder.svg';
  }

  console.log('[normalizeImageUrl] Processando URL:', url);

  // Se for caminho relativo, retornar como está
  if (url.startsWith('/')) {
    console.log('[normalizeImageUrl] Caminho relativo detectado, retornando como está:', url);
    return url;
  }

  // Se for URL absoluta
  if (url.startsWith('http://') || url.startsWith('https://')) {
    try {
      // Normaliza múltiplas ocorrências de path duplicado
      let fixed = url;
      
      // Corrige duplicações específicas do Supabase Storage
      fixed = fixed.replace(/(\/v1\/object\/public\/)+/g, '/v1/object/public/');
      
      // Evita barras duplas no caminho (exceto no protocolo)
      const urlParts = fixed.split('://');
      if (urlParts.length > 1) {
        const protocol = urlParts[0];
        let path = urlParts[1];
        path = path.replace(/\/{2,}/g, '/');
        fixed = `${protocol}://${path}`;
      }

      console.log('[normalizeImageUrl] URL normalizada:', fixed);
      return fixed;
    } catch (err) {
      console.error('[normalizeImageUrl] Erro ao processar URL:', url, err);
      return '/placeholder.svg';
    }
  }

  // Verifica se é uma URL relativa sem barra inicial (adiciona a barra)
  if (!url.startsWith('http') && !url.startsWith('/') && !url.startsWith('data:')) {
    const fixedUrl = `/${url}`;
    console.log('[normalizeImageUrl] Adicionando / ao início da URL relativa:', fixedUrl);
    return fixedUrl;
  }

  // Formato não reconhecido ou URL de dados (data:image)
  console.log('[normalizeImageUrl] Formato não padronizado, retornando como está:', url);
  return url;
};
