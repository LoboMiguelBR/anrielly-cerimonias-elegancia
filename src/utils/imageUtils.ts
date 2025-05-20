
/**
 * Utility functions for handling and normalizing image URLs
 */

/**
 * Normaliza uma URL para corrigir segmentos de caminho duplicados, lida com URLs absolutas e caminhos relativos
 * @param url A URL para normalizar
 * @returns A URL normalizada ou string vazia se url for null/undefined
 */
export const normalizeImageUrl = (url: string | null | undefined): string => {
  // Retorna vazio para URLs nulas/indefinidas
  if (!url) {
    console.log('[normalizeImageUrl] URL vazia recebida');
    return '';
  }

  console.log('[normalizeImageUrl] URL original:', url);
  
  // Trata caminhos relativos (começando com /)
  if (url.startsWith('/')) {
    console.log('[normalizeImageUrl] Processando caminho relativo:', url);
    // Para caminhos relativos, apenas retornamos o caminho original
    // Não é necessário fazer mais validações
    return url;
  }
  
  // Trata URLs absolutas (começando com http:// ou https://)
  if (url.startsWith('http://') || url.startsWith('https://')) {
    try {
      // Corrige problema comum com segmentos de caminho duplicados
      // ex: /v1/object/public/v1/object/public/ -> /v1/object/public/
      const fixedPathUrl = url.replace(/(\/v1\/object\/public\/)+/g, '/v1/object/public/');
      
      // Tenta validar a URL absoluta
      new URL(fixedPathUrl);
      console.log('[normalizeImageUrl] URL absoluta normalizada:', fixedPathUrl);
      return fixedPathUrl;
    } catch (error) {
      // Se a análise da URL falhou, tenta corrigir URLs do Supabase
      if (url.includes('/v1/object/public/')) {
        const fixedUrl = url.replace(/(\/v1\/object\/public\/)+/g, '/v1/object/public/');
        console.log('[normalizeImageUrl] Análise da URL falhou, mas caminho corrigido:', fixedUrl);
        return fixedUrl;
      }
      
      // Para URLs absolutas inválidas, registra o erro e retorna original
      console.error('[normalizeImageUrl] Formato de URL inválido:', url, error);
      return url;
    }
  }
  
  // Para todos os outros formatos (nem relativo nem absoluto), retorna o original
  console.log('[normalizeImageUrl] Formato de URL não reconhecido, retornando original:', url);
  return url;
};
