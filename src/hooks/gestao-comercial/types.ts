
export interface FunilItem {
  id: string;
  name: string;
  email: string;
  phone?: string;
  event_type: string;
  event_date?: string;
  event_location?: string;
  status: string;
  type: 'quote' | 'proposal' | 'contract';
  created_at: string;
  total_price?: number;
  originalId: string; // Para rastrear o ID original
  leadId?: string; // ID do lead original para rastreabilidade
}

export interface FinancialMetrics {
  orcamentosAbertos: number;
  contratosAndamento: number;
  contratosAssinados: number;
  valorOrcamentosAbertos: number;
  valorContratosAssinados: number;
  ticketMedio: number;
  taxaConversao: number;
}
