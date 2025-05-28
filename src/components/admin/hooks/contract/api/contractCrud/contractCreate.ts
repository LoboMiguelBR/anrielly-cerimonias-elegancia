
import { supabase } from '@/integrations/supabase/client';
import { ContractData, ContractFormData, ContractStatus } from '../../types';
import { contractSlugApi } from '../contractSlug';
import { sendContractForSignature } from '@/utils/email';
import { sanitizeDateTimeFields } from './utils';
import { toast } from 'sonner';

export const contractCreateApi = {
  // Create contract
  async createContract(contractData: ContractFormData): Promise<ContractData> {
    // Generate tokens for the contract
    const token = crypto.randomUUID();
    const publicToken = crypto.randomUUID();

    // Sanitize date/time fields and convert number fields to ensure proper types
    const sanitizedData = sanitizeDateTimeFields(contractData);
    
    const formattedData = {
      ...sanitizedData,
      total_price: Number(contractData.total_price),
      down_payment: contractData.down_payment ? Number(contractData.down_payment) : null,
      remaining_amount: contractData.remaining_amount ? Number(contractData.remaining_amount) : null,
      token,
      public_token: publicToken,
      status: 'draft' as ContractStatus,
      // Include audit data
      ip_address: contractData.ip_address || null,
      user_agent: contractData.user_agent || null,
    };

    console.log('Creating contract with data:', formattedData);

    const { data, error } = await supabase
      .from('contracts')
      .insert(formattedData)
      .select()
      .single();

    if (error) {
      console.error('Error creating contract:', error);
      throw error;
    }

    // Generate and save slug after contract creation
    try {
      const slug = await contractSlugApi.generateAndSaveSlug(
        data.id, 
        contractData.client_name, 
        contractData.event_date
      );
      data.public_slug = slug;
      console.log('Generated slug for contract:', slug);
    } catch (slugError) {
      console.warn('Failed to generate slug, continuing without it:', slugError);
    }

    const contractResult = {
      ...data,
      status: data.status as ContractStatus,
      token: data.token || data.id,
      total_price: Number(data.total_price),
      down_payment: data.down_payment ? Number(data.down_payment) : undefined,
      remaining_amount: data.remaining_amount ? Number(data.remaining_amount) : undefined
    } as ContractData;

    // Enviar email automaticamente após criação do contrato com slug amigável
    try {
      console.log('Sending automatic contract email...');
      const contractUrl = contractResult.public_slug 
        ? `${window.location.origin}/contrato/${contractResult.public_slug}`
        : `${window.location.origin}/contrato/${contractResult.public_token}`;
        
      const success = await sendContractForSignature(
        contractResult.client_name,
        contractResult.client_email,
        contractUrl,
        contractResult.event_type,
        contractResult
      );

      if (success) {
        console.log('Contract email sent successfully');
        toast.success('Contrato criado e email enviado com sucesso!');
      } else {
        console.warn('Contract created but email failed to send');
        toast.warning('Contrato criado, mas falha no envio do email');
      }
    } catch (emailError) {
      console.error('Error sending contract email:', emailError);
      toast.warning('Contrato criado, mas falha no envio do email');
    }

    return contractResult;
  }
};
