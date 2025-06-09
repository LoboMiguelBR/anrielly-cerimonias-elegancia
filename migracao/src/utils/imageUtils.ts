
export const normalizeImageUrl = (url: string | null | undefined): string => {
  if (!url || url.trim() === '') {
    return '/placeholder.svg';
  }
  
  // Se a URL já é completa (http/https), retorna ela
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Se é uma URL do Supabase storage
  if (url.startsWith('/lovable-uploads/')) {
    return url;
  }
  
  // Se é uma URL relativa, adiciona o prefixo
  if (!url.startsWith('/')) {
    return `/lovable-uploads/${url}`;
  }
  
  return url;
};
