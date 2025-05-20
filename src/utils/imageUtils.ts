
/**
 * Utility functions for handling and normalizing image URLs
 */

/**
 * Normaliza uma URL para corrigir segmentos de caminho duplicados, lida com URLs absolutas e caminhos relativos
 * @param url A URL para normalizar
 * @returns A URL normalizada ou string vazia se url for null/undefined
 */
export const normalizeImageUrl = (url: string | null | undefined): string => {
  if (!url) {
    console.warn('[normalizeImageUrl] URL vazia recebida');
    return '';
  }

  console.log('[normalizeImageUrl] URL original:', url);

  // Se for caminho relativo
  if (url.startsWith('/')) {
    console.log('[normalizeImageUrl] Caminho relativo detectado');
    return url;
  }

  // Se for URL absoluta
  if (url.startsWith('http://') || url.startsWith('https://')) {
    try {
      // Normaliza múltiplas ocorrências de path duplicado
      let fixed = url.replace(/(\/v1\/object\/public\/)+/g, '/v1/object/public/');
      
      // Evita barras duplas
      fixed = fixed.replace(/\/{2,}/g, '/');

      // Validação básica (opcional)
      const parsed = new URL(fixed);
      console.log('[normalizeImageUrl] URL normalizada:', parsed.href);
      return parsed.href;
    } catch (err) {
      console.error('[normalizeImageUrl] URL inválida após normalização:', url, err);
      return '';
    }
  }

  // Formato não reconhecido
  console.warn('[normalizeImageUrl] Formato de URL não reconhecido, retornando original:', url);
  return url;
};
