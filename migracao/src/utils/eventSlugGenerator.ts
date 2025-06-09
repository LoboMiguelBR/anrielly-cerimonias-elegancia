
// Função para gerar slug personalizado para eventos de questionários
export const generateEventSlug = (nomeEvento: string, tipoEvento?: string): string => {
  // Normalizar nome do evento
  const normalizedName = nomeEvento
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
    .replace(/\s+/g, '-') // Substitui espaços por hífens
    .replace(/-+/g, '-') // Remove hífens duplos
    .trim();

  // Adicionar prefixo do tipo de evento se disponível
  let typePrefix = '';
  if (tipoEvento) {
    typePrefix = tipoEvento
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '')
      .substring(0, 10); // Limitar tamanho
    
    if (typePrefix) {
      typePrefix = typePrefix + '-';
    }
  }

  return `${typePrefix}${normalizedName}`;
};

// Função para validar se slug é único
export const validateEventSlugUniqueness = async (slug: string, questionarioId?: string): Promise<boolean> => {
  const { supabase } = await import('@/integrations/supabase/client');
  
  let query = supabase
    .from('questionarios_noivos')
    .select('id')
    .eq('link_publico', slug);
  
  if (questionarioId) {
    query = query.neq('id', questionarioId);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error validating event slug uniqueness:', error);
    return false;
  }
  
  return data.length === 0;
};

// Função para gerar slug único com sufixo se necessário
export const generateUniqueEventSlug = async (nomeEvento: string, tipoEvento?: string, questionarioId?: string): Promise<string> => {
  let baseSlug = generateEventSlug(nomeEvento, tipoEvento);
  let slug = baseSlug;
  let counter = 1;
  
  while (!(await validateEventSlugUniqueness(slug, questionarioId))) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  return slug;
};

// Tipos de evento predefinidos
export const TIPOS_EVENTO = [
  'Casamento',
  'Aniversário',
  'Formatura',
  'Batizado',
  'Primeira Comunhão',
  'Crisma',
  'Noivado',
  'Chá de Bebê',
  'Chá de Panela',
  'Renovação de Votos',
  'Bodas',
  'Eventos corporativos',
  'Outro'
] as const;

export type TipoEvento = typeof TIPOS_EVENTO[number];
