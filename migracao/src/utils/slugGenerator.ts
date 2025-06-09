
// Função para gerar slug personalizado para contratos
export const generateContractSlug = (clientName: string, eventDate?: string): string => {
  // Normalizar nome do cliente
  const normalizedName = clientName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
    .replace(/\s+/g, '-') // Substitui espaços por hífens
    .replace(/-+/g, '-') // Remove hífens duplos
    .trim();

  // Normalizar data do evento se disponível
  let dateSlug = '';
  if (eventDate) {
    const date = new Date(eventDate);
    if (!isNaN(date.getTime())) {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      dateSlug = `-${day}-${month}-${year}`;
    }
  }

  return `${normalizedName}${dateSlug}`;
};

// Função para validar se slug é único
export const validateSlugUniqueness = async (slug: string, contractId?: string): Promise<boolean> => {
  const { supabase } = await import('@/integrations/supabase/client');
  
  let query = supabase
    .from('contracts')
    .select('id')
    .eq('public_slug', slug);
  
  if (contractId) {
    query = query.neq('id', contractId);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error validating slug uniqueness:', error);
    return false;
  }
  
  return data.length === 0;
};

// Função para gerar slug único com sufixo se necessário
export const generateUniqueSlug = async (clientName: string, eventDate?: string, contractId?: string): Promise<string> => {
  let baseSlug = generateContractSlug(clientName, eventDate);
  let slug = baseSlug;
  let counter = 1;
  
  while (!(await validateSlugUniqueness(slug, contractId))) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  return slug;
};
