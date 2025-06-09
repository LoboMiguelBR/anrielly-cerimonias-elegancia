
import { normalizeImageUrl } from './imageUtils';

// Lista de imagens de assinatura disponíveis no projeto
const availableSignatureImages = [
  '/lovable-uploads/2fff881d-0a84-498f-bea5-b9adc67af1bd.png',
  '/lovable-uploads/322b9c8a-c27a-42c2-bbfd-b8fbcfd2c449.png',
  '/lovable-uploads/38a84af5-3e22-4ae4-bcea-ef49e9e81209.png',
  '/lovable-uploads/51ec6ddc-43be-45c4-9c33-1f407dba1411.png',
  '/lovable-uploads/5c2761cc-ac8b-403d-9dba-85a4f27b4b6e.png',
  '/lovable-uploads/62838623-bcd2-428f-92ba-d4408e445d73.png',
  '/lovable-uploads/99442f1a-9c10-4e95-a063-bd0bda0a998c.png',
  '/lovable-uploads/a1e9c8bb-3ef0-4768-8b5e-9fac87c9d598.png',
  '/lovable-uploads/c2283906-77d8-4d1c-a901-5453ea6dd515.png',
  '/lovable-uploads/c8bfe776-c594-4d05-bc65-9472d76d5323.png',
  '/lovable-uploads/d856da09-1255-4e7d-a9d6-0a2a04edac9d.png',
  '/lovable-uploads/e722dd38-54b1-498a-adeb-7a5a126035fd.png',
  '/lovable-uploads/ea42111a-a240-43c5-84f8-067b63793694.png'
];

/**
 * Verifica se uma imagem pode ser carregada
 */
export const checkImageAvailability = (url: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = normalizeImageUrl(url);
  });
};

/**
 * Obtém a URL da assinatura da Anrielly com fallback
 */
export const getAnriellySignatureUrl = async (): Promise<string> => {
  // URL principal da assinatura
  const primarySignatureUrl = '/lovable-uploads/2fff881d-0a84-498f-bea5-b9adc67af1bd.png';
  
  // Verificar se a imagem principal está disponível
  const isAvailable = await checkImageAvailability(primarySignatureUrl);
  
  if (isAvailable) {
    console.log('Assinatura principal da Anrielly encontrada');
    return normalizeImageUrl(primarySignatureUrl);
  }
  
  // Tentar encontrar uma assinatura alternativa
  console.warn('Assinatura principal não encontrada, procurando alternativas...');
  
  for (const imageUrl of availableSignatureImages) {
    const isImageAvailable = await checkImageAvailability(imageUrl);
    if (isImageAvailable) {
      console.log(`Usando assinatura alternativa: ${imageUrl}`);
      return normalizeImageUrl(imageUrl);
    }
  }
  
  // Se nenhuma imagem estiver disponível, retornar placeholder
  console.error('Nenhuma assinatura disponível, usando placeholder');
  return '/placeholder.svg';
};

/**
 * Cria um elemento de assinatura com tratamento de erro
 */
export const createSignatureElement = (
  url: string,
  alt: string = 'Assinatura',
  className: string = 'max-h-full max-w-full object-contain'
): HTMLImageElement => {
  const img = document.createElement('img');
  img.src = normalizeImageUrl(url);
  img.alt = alt;
  img.className = className;
  
  img.onerror = () => {
    console.error(`Erro ao carregar assinatura: ${url}`);
    img.style.display = 'none';
  };
  
  img.onload = () => {
    console.log(`Assinatura carregada com sucesso: ${url}`);
  };
  
  return img;
};

/**
 * Valida se uma URL de assinatura é válida
 */
export const validateSignatureUrl = (url: string | null | undefined): string => {
  if (!url) {
    console.warn('URL de assinatura vazia, usando placeholder');
    return '/placeholder.svg';
  }
  
  return normalizeImageUrl(url);
};
