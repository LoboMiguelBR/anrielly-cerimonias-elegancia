
import { supabase } from '@/integrations/supabase/client';
import { generateUniqueSlug } from '@/utils/slugGenerator';

export const contractSlugApi = {
  // Gerar e salvar slug para contrato
  async generateAndSaveSlug(contractId: string, clientName: string, eventDate?: string): Promise<string> {
    const slug = await generateUniqueSlug(clientName, eventDate, contractId);
    
    const { error } = await supabase
      .from('contracts')
      .update({ public_slug: slug })
      .eq('id', contractId);

    if (error) {
      console.error('Error saving contract slug:', error);
      throw error;
    }

    return slug;
  },

  // Buscar contrato por slug
  async getContractBySlug(slug: string) {
    const { data, error } = await supabase
      .from('contracts')
      .select('*')
      .eq('public_slug', slug)
      .maybeSingle();

    if (error) {
      console.error('Error fetching contract by slug:', error);
      throw error;
    }

    return data;
  },

  // Atualizar slug existente
  async updateSlug(contractId: string, clientName: string, eventDate?: string): Promise<string> {
    return this.generateAndSaveSlug(contractId, clientName, eventDate);
  }
};
