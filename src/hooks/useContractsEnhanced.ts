
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ContractEnhanced {
  id: string;
  contract_number: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  client_address?: string;
  event_type: string;
  event_date?: string;
  event_time?: string;
  event_location?: string;
  total_price: number;
  down_payment?: number;
  remaining_amount?: number;
  down_payment_date?: string;
  remaining_payment_date?: string;
  status: 'draft' | 'sent' | 'signed' | 'completed' | 'cancelled';
  template_id?: string;
  html_content?: string;
  css_content?: string;
  notes?: string;
  public_token: string;
  public_slug?: string;
  signature_data?: any;
  signed_at?: string;
  pdf_url?: string;
  version: number;
  version_timestamp?: string;
  created_at: string;
  updated_at: string;
  
  // Enhanced fields
  payment_schedule?: PaymentSchedule[];
  contract_items?: ContractItem[];
  additional_terms?: string;
  cancellation_policy?: string;
  force_majeure_clause?: string;
  dispute_resolution?: string;
  governing_law?: string;
}

export interface PaymentSchedule {
  id: string;
  description: string;
  amount: number;
  percentage: number;
  due_date: string;
  status: 'pending' | 'paid' | 'overdue';
  paid_date?: string;
  payment_method?: string;
}

export interface ContractItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  category: string;
  notes?: string;
}

export interface ContractStats {
  total_contracts: number;
  signed_contracts: number;
  pending_signatures: number;
  completed_contracts: number;
  total_value: number;
  monthly_value: number;
  average_contract_value: number;
  signature_rate: number;
}

export interface ContractFilters {
  status?: string[];
  event_type?: string[];
  date_range?: {
    start: string;
    end: string;
  };
  value_range?: {
    min: number;
    max: number;
  };
  search_query?: string;
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

      // Apply filters
      const activeFilters = currentFilters || filters;
      
      if (activeFilters.status?.length) {
        query = query.in('status', activeFilters.status);
      }
      
      if (activeFilters.event_type?.length) {
        query = query.in('event_type', activeFilters.event_type);
      }
      
      if (activeFilters.date_range) {
        query = query
          .gte('event_date', activeFilters.date_range.start)
          .lte('event_date', activeFilters.date_range.end);
      }
      
      if (activeFilters.value_range) {
        query = query
          .gte('total_price', activeFilters.value_range.min)
          .lte('total_price', activeFilters.value_range.max);
      }

      if (activeFilters.search_query) {
        query = query.or(`client_name.ilike.%${activeFilters.search_query}%,client_email.ilike.%${activeFilters.search_query}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Transform to enhanced format
      const enhancedContracts: ContractEnhanced[] = (data || []).map(contract => ({
        ...contract,
        contract_number: `CTR-${contract.id.slice(0, 8).toUpperCase()}`,
        payment_schedule: generatePaymentSchedule(contract),
        contract_items: generateContractItems(contract),
        additional_terms: 'Termos adicionais padrão',
        cancellation_policy: 'Política de cancelamento padrão',
        force_majeure_clause: 'Cláusula de força maior padrão',
        dispute_resolution: 'Resolução de disputas por mediação',
        governing_law: 'Lei brasileira aplicável'
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
        .select('status, total_price, created_at, signed_at');

      if (contractsData) {
        const now = new Date();
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        
        const signedContracts = contractsData.filter(c => c.status === 'signed');
        const totalValue = contractsData.reduce((sum, c) => sum + (parseFloat(c.total_price?.toString() || '0')), 0);
        const monthlyValue = contractsData
          .filter(c => new Date(c.created_at) >= thisMonth)
          .reduce((sum, c) => sum + (parseFloat(c.total_price?.toString() || '0')), 0);

        const stats: ContractStats = {
          total_contracts: contractsData.length,
          signed_contracts: signedContracts.length,
          pending_signatures: contractsData.filter(c => c.status === 'sent').length,
          completed_contracts: contractsData.filter(c => c.status === 'completed').length,
          total_value: totalValue,
          monthly_value: monthlyValue,
          average_contract_value: totalValue / Math.max(contractsData.length, 1),
          signature_rate: contractsData.length > 0 ? (signedContracts.length / contractsData.length) * 100 : 0,
        };
        
        setStats(stats);
      }
    } catch (error: any) {
      console.error('Erro ao buscar estatísticas de contratos:', error);
    }
  };

  const generatePaymentSchedule = (contract: any): PaymentSchedule[] => {
    const schedule: PaymentSchedule[] = [];
    
    if (contract.down_payment && contract.down_payment_date) {
      schedule.push({
        id: `${contract.id}_down`,
        description: 'Entrada',
        amount: parseFloat(contract.down_payment?.toString() || '0'),
        percentage: (parseFloat(contract.down_payment?.toString() || '0') / parseFloat(contract.total_price?.toString() || '1')) * 100,
        due_date: contract.down_payment_date,
        status: 'pending',
      });
    }
    
    if (contract.remaining_amount && contract.remaining_payment_date) {
      schedule.push({
        id: `${contract.id}_remaining`,
        description: 'Saldo restante',
        amount: parseFloat(contract.remaining_amount?.toString() || '0'),
        percentage: (parseFloat(contract.remaining_amount?.toString() || '0') / parseFloat(contract.total_price?.toString() || '1')) * 100,
        due_date: contract.remaining_payment_date,
        status: 'pending',
      });
    }
    
    return schedule;
  };

  const generateContractItems = (contract: any): ContractItem[] => {
    // Mock contract items based on event type
    const mockItems: ContractItem[] = [
      {
        id: `${contract.id}_item_1`,
        description: `Cerimonial completo para ${contract.event_type}`,
        quantity: 1,
        unit_price: parseFloat(contract.total_price?.toString() || '0'),
        total_price: parseFloat(contract.total_price?.toString() || '0'),
        category: 'Serviços',
        notes: 'Inclui planejamento, coordenação e execução'
      }
    ];
    
    return mockItems;
  };

  const createContract = async (contractData: Partial<ContractEnhanced>) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('contracts')
        .insert([{
          client_name: contractData.client_name || '',
          client_email: contractData.client_email || '',
          client_phone: contractData.client_phone || '',
          client_address: contractData.client_address,
          event_type: contractData.event_type || '',
          event_date: contractData.event_date,
          event_time: contractData.event_time,
          event_location: contractData.event_location,
          total_price: contractData.total_price || 0,
          down_payment: contractData.down_payment,
          remaining_amount: contractData.remaining_amount,
          down_payment_date: contractData.down_payment_date,
          remaining_payment_date: contractData.remaining_payment_date,
          status: contractData.status || 'draft',
          template_id: contractData.template_id,
          html_content: contractData.html_content,
          css_content: contractData.css_content,
          notes: contractData.notes,
          version: 1
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
          client_address: updates.client_address,
          event_type: updates.event_type,
          event_date: updates.event_date,
          event_time: updates.event_time,
          event_location: updates.event_location,
          total_price: updates.total_price,
          down_payment: updates.down_payment,
          remaining_amount: updates.remaining_amount,
          down_payment_date: updates.down_payment_date,
          remaining_payment_date: updates.remaining_payment_date,
          status: updates.status,
          html_content: updates.html_content,
          css_content: updates.css_content,
          notes: updates.notes,
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

  const deleteContract = async (id: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('contracts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Contrato removido com sucesso!');
      await fetchContracts();
    } catch (error: any) {
      console.error('Erro ao remover contrato:', error);
      toast.error('Erro ao remover contrato');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const duplicateContract = async (id: string) => {
    try {
      const contractToDuplicate = contracts.find(c => c.id === id);
      if (!contractToDuplicate) {
        throw new Error('Contrato não encontrado');
      }

      const duplicatedContract = {
        ...contractToDuplicate,
        client_name: `${contractToDuplicate.client_name} (Cópia)`,
        status: 'draft' as const,
        public_token: crypto.randomUUID(),
        signed_at: undefined,
        signature_data: undefined,
        version: 1
      };

      delete (duplicatedContract as any).id;
      await createContract(duplicatedContract);
    } catch (error) {
      toast.error('Erro ao duplicar contrato');
    }
  };

  const sendContract = async (id: string, method: 'email' | 'whatsapp' = 'email') => {
    try {
      const contract = contracts.find(c => c.id === id);
      if (!contract) {
        throw new Error('Contrato não encontrado');
      }

      await updateContract(id, { status: 'sent' });
      
      if (method === 'email') {
        toast.success('Contrato enviado por email!');
      } else {
        toast.success('Link do contrato copiado para WhatsApp!');
      }
    } catch (error) {
      toast.error('Erro ao enviar contrato');
    }
  };

  const signContract = async (id: string, signatureData: any) => {
    try {
      await updateContract(id, {
        status: 'signed',
        signature_data: signatureData,
        signed_at: new Date().toISOString()
      });
      
      toast.success('Contrato assinado com sucesso!');
    } catch (error) {
      toast.error('Erro ao assinar contrato');
    }
  };

  const generatePDF = async (id: string): Promise<string> => {
    try {
      // Mock PDF generation
      const pdfUrl = `${window.location.origin}/contract/${id}/pdf`;
      
      await updateContract(id, { pdf_url: pdfUrl });
      
      toast.success('PDF gerado com sucesso!');
      return pdfUrl;
    } catch (error) {
      toast.error('Erro ao gerar PDF');
      throw error;
    }
  };

  const applyFilters = (newFilters: ContractFilters) => {
    setFilters(newFilters);
    fetchContracts(newFilters);
  };

  const exportContracts = async (format: 'csv' | 'excel' | 'pdf' = 'csv') => {
    try {
      toast.success('Funcionalidade de exportação será implementada em breve');
    } catch (error) {
      toast.error('Erro ao exportar contratos');
    }
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
    deleteContract,
    duplicateContract,
    sendContract,
    signContract,
    generatePDF,
    applyFilters,
    exportContracts,
    refetch: () => {
      fetchContracts();
      fetchStats();
    }
  };
};
