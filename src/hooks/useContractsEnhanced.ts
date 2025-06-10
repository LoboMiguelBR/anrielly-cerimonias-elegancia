
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface PaymentSchedule {
  id: string;
  contract_id: string;
  installment_number: number;
  amount: number;
  due_date: string;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  payment_method?: string;
  paid_at?: string;
  notes?: string;
}

export interface ContractItem {
  id: string;
  contract_id: string;
  service_name: string;
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  category: string;
}

export interface ContractEnhanced {
  id: string;
  contract_number: string;
  
  // Cliente
  client_name: string;
  client_email: string;
  client_phone: string;
  client_address?: string;
  client_profession?: string;
  civil_status?: string;
  
  // Evento
  event_type: string;
  event_date?: string;
  event_time?: string;
  event_location?: string;
  
  // Financeiro
  total_price: number;
  down_payment?: number;
  down_payment_date?: string;
  remaining_amount?: number;
  remaining_payment_date?: string;
  payment_schedule: PaymentSchedule[];
  
  // Itens do contrato
  contract_items: ContractItem[];
  
  // Status e versionamento
  status: 'draft' | 'sent' | 'signed' | 'completed' | 'cancelled';
  version: number;
  version_timestamp: string;
  
  // Conteúdo
  html_content?: string;
  css_content?: string;
  notes?: string;
  
  // Assinatura
  signature_data?: any;
  signed_at?: string;
  signature_drawn_at?: string;
  signer_ip?: string;
  
  // URLs e tokens
  pdf_url?: string;
  public_token: string;
  public_slug?: string;
  preview_signature_url?: string;
  
  // Templates
  template_id?: string;
  
  // Referências
  proposal_id?: string;
  quote_request_id?: string;
  
  // Termos e condições
  additional_terms?: string;
  cancellation_policy?: string;
  
  // Metadados
  created_at: string;
  updated_at: string;
  ip_address?: string;
  user_agent?: string;
}

export interface ContractStats {
  total_contracts: number;
  draft_contracts: number;
  signed_contracts: number;
  completed_contracts: number;
  monthly_revenue: number;
  pending_signatures: number;
  overdue_payments: number;
}

export interface ContractFilters {
  status?: string[];
  event_type?: string[];
  date_range?: {
    start: string;
    end: string;
  };
  client_search?: string;
  amount_range?: {
    min: number;
    max: number;
  };
}

export const useContractsEnhanced = () => {
  const [contracts, setContracts] = useState<ContractEnhanced[]>([]);
  const [stats, setStats] = useState<ContractStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<ContractFilters>({});

  const fetchContracts = async (currentFilters?: ContractFilters) => {
    try {
      setLoading(true);
      let query = supabase
        .from('contracts')
        .select('*')
        .order('created_at', { ascending: false });

      const activeFilters = currentFilters || filters;
      
      if (activeFilters.status?.length) {
        query = query.in('status', activeFilters.status);
      }
      
      if (activeFilters.event_type?.length) {
        query = query.in('event_type', activeFilters.event_type);
      }
      
      if (activeFilters.client_search) {
        query = query.or(`client_name.ilike.%${activeFilters.client_search}%,client_email.ilike.%${activeFilters.client_search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      const enhancedContracts: ContractEnhanced[] = (data || []).map(contract => ({
        id: contract.id,
        contract_number: `CONT-${contract.id.substring(0, 8).toUpperCase()}`,
        client_name: contract.client_name,
        client_email: contract.client_email,
        client_phone: contract.client_phone,
        client_address: contract.client_address,
        client_profession: contract.client_profession,
        civil_status: contract.civil_status,
        event_type: contract.event_type,
        event_date: contract.event_date,
        event_time: contract.event_time,
        event_location: contract.event_location,
        total_price: parseFloat(contract.total_price?.toString() || '0'),
        down_payment: contract.down_payment ? parseFloat(contract.down_payment.toString()) : undefined,
        down_payment_date: contract.down_payment_date,
        remaining_amount: contract.remaining_amount ? parseFloat(contract.remaining_amount.toString()) : undefined,
        remaining_payment_date: contract.remaining_payment_date,
        payment_schedule: [], // Will be populated from related table
        contract_items: [], // Will be populated from related table
        status: contract.status as 'draft' | 'sent' | 'signed' | 'completed' | 'cancelled',
        version: contract.version,
        version_timestamp: contract.version_timestamp || contract.created_at,
        html_content: contract.html_content,
        css_content: contract.css_content,
        notes: contract.notes,
        signature_data: contract.signature_data,
        signed_at: contract.signed_at,
        signature_drawn_at: contract.signature_drawn_at,
        signer_ip: contract.signer_ip,
        pdf_url: contract.pdf_url,
        public_token: contract.public_token,
        public_slug: contract.public_slug,
        preview_signature_url: contract.preview_signature_url,
        template_id: contract.template_id,
        proposal_id: contract.proposal_id,
        quote_request_id: contract.quote_request_id,
        additional_terms: '',
        cancellation_policy: '',
        created_at: contract.created_at,
        updated_at: contract.updated_at,
        ip_address: contract.ip_address,
        user_agent: contract.user_agent,
      }));

      setContracts(enhancedContracts);
    } catch (error: any) {
      console.error('Erro ao buscar contratos:', error);
      toast.error('Erro ao carregar contratos');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data: contractsData } = await supabase
        .from('contracts')
        .select('status, total_price, created_at');

      if (contractsData) {
        const now = new Date();
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        
        const stats: ContractStats = {
          total_contracts: contractsData.length,
          draft_contracts: contractsData.filter(c => c.status === 'draft').length,
          signed_contracts: contractsData.filter(c => c.status === 'signed').length,
          completed_contracts: contractsData.filter(c => c.status === 'completed').length,
          monthly_revenue: contractsData
            .filter(c => c.status === 'signed' && new Date(c.created_at) >= thisMonth)
            .reduce((sum, c) => sum + parseFloat(c.total_price?.toString() || '0'), 0),
          pending_signatures: contractsData.filter(c => c.status === 'sent').length,
          overdue_payments: 0, // Calculate based on payment schedule
        };
        
        setStats(stats);
      }
    } catch (error: any) {
      console.error('Erro ao buscar estatísticas:', error);
    }
  };

  const createContract = async (contractData: Partial<ContractEnhanced>) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('contracts')
        .insert([{
          client_name: contractData.client_name,
          client_email: contractData.client_email,
          client_phone: contractData.client_phone,
          client_address: contractData.client_address,
          event_type: contractData.event_type,
          event_date: contractData.event_date,
          event_location: contractData.event_location,
          total_price: contractData.total_price,
          status: contractData.status || 'draft',
          notes: contractData.notes,
        }])
        .select()
        .single();

      if (error) throw error;

      toast.success('Contrato criado com sucesso!');
      await fetchContracts();
      return data;
    } catch (error: any) {
      console.error('Erro ao criar contrato:', error);
      toast.error('Erro ao criar contrato');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateContract = async (id: string, updates: Partial<ContractEnhanced>) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('contracts')
        .update({
          client_name: updates.client_name,
          client_email: updates.client_email,
          client_phone: updates.client_phone,
          event_type: updates.event_type,
          event_date: updates.event_date,
          event_location: updates.event_location,
          total_price: updates.total_price,
          status: updates.status,
          notes: updates.notes,
          html_content: updates.html_content,
        })
        .eq('id', id);

      if (error) throw error;

      toast.success('Contrato atualizado com sucesso!');
      await fetchContracts();
    } catch (error: any) {
      console.error('Erro ao atualizar contrato:', error);
      toast.error('Erro ao atualizar contrato');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signContract = async (id: string, signatureData: any) => {
    try {
      const { error } = await supabase
        .from('contracts')
        .update({
          status: 'signed',
          signature_data: signatureData,
          signed_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;

      toast.success('Contrato assinado com sucesso!');
      await fetchContracts();
    } catch (error: any) {
      console.error('Erro ao assinar contrato:', error);
      toast.error('Erro ao assinar contrato');
      throw error;
    }
  };

  const applyFilters = (newFilters: ContractFilters) => {
    setFilters(newFilters);
    fetchContracts(newFilters);
  };

  useEffect(() => {
    fetchContracts();
    fetchStats();
  }, []);

  return {
    contracts,
    stats,
    loading,
    filters,
    fetchContracts,
    createContract,
    updateContract,
    signContract,
    applyFilters,
    refetch: () => {
      fetchContracts();
      fetchStats();
    }
  };
};
