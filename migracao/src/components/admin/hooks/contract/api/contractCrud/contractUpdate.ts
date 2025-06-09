
import { supabase } from '@/integrations/supabase/client';
import { ContractData, ContractFormData, ContractStatus } from '../../types';
import { contractSlugApi } from '../contractSlug';
import { sanitizeDateTimeFields } from './utils';

export const contractUpdateApi = {
  // Update contract with improved validation and error handling
  async updateContract(id: string, contractData: Partial<ContractFormData>): Promise<ContractData> {
    // Validate ID
    if (!id) {
      throw new Error('ID do contrato é obrigatório para atualização');
    }

    // Validate payload
    if (!contractData || Object.keys(contractData).length === 0) {
      throw new Error('Payload vazio, nada a atualizar');
    }

    console.log('🔄 Atualizando contrato:', { id, payload: contractData });

    // Sanitize date/time fields and convert number fields to ensure proper types
    const sanitizedData = sanitizeDateTimeFields(contractData);
    
    const formattedData = {
      ...sanitizedData,
      total_price: contractData.total_price ? Number(contractData.total_price) : undefined,
      down_payment: contractData.down_payment ? Number(contractData.down_payment) : undefined,
      remaining_amount: contractData.remaining_amount ? Number(contractData.remaining_amount) : undefined,
      // Include audit data for updates
      ip_address: contractData.ip_address || undefined,
      user_agent: contractData.user_agent || undefined,
    };

    // Remove undefined fields to avoid sending them to Supabase
    const cleanedFormattedData = Object.fromEntries(
      Object.entries(formattedData).filter(([_, value]) => value !== undefined)
    );

    console.log('📤 Dados formatados para envio:', cleanedFormattedData);

    try {
      const { data, error } = await supabase
        .from('contracts')
        .update(cleanedFormattedData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('❌ Erro do Supabase ao atualizar contrato:', error);
        throw new Error(`Erro ao atualizar contrato: ${error.message}`);
      }

      if (!data) {
        throw new Error('Nenhum dado retornado após atualização');
      }

      console.log('✅ Contrato atualizado com sucesso:', data);

      // Update slug if client name or event date changed
      if (contractData.client_name || contractData.event_date) {
        try {
          const slug = await contractSlugApi.updateSlug(
            id, 
            contractData.client_name || data.client_name, 
            contractData.event_date || data.event_date
          );
          data.public_slug = slug;
          console.log('🔗 Slug atualizado para contrato:', slug);
        } catch (slugError) {
          console.warn('⚠️ Falha ao atualizar slug:', slugError);
        }
      }

      return {
        ...data,
        status: data.status as ContractStatus,
        token: data.token || data.id,
        total_price: Number(data.total_price),
        down_payment: data.down_payment ? Number(data.down_payment) : undefined,
        remaining_amount: data.remaining_amount ? Number(data.remaining_amount) : undefined
      } as ContractData; // Explicit cast to ensure type compatibility
    } catch (error: any) {
      console.error('💥 Erro completo na atualização do contrato:', error);
      
      // Provide more specific error messages
      if (error.message?.includes('violates check constraint')) {
        throw new Error('Dados inválidos: verifique se todos os campos estão preenchidos corretamente');
      } else if (error.message?.includes('violates foreign key constraint')) {
        throw new Error('Referência inválida: verifique se o template ou outras referências existem');
      } else if (error.message?.includes('violates not-null constraint')) {
        throw new Error('Campo obrigatório não preenchido');
      }
      
      throw error;
    }
  }
};
