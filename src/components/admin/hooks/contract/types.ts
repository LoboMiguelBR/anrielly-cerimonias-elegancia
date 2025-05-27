
export interface ContractData {
  id: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  client_address?: string;
  client_profession?: string;
  civil_status?: string;
  
  event_type: string;
  event_date?: string;
  event_time?: string;
  event_location?: string;
  
  total_price: number;
  down_payment?: number;
  down_payment_date?: string;
  remaining_amount?: number;
  remaining_payment_date?: string;
  
  template_id?: string;
  html_content?: string;
  
  status: ContractStatus;
  public_token: string;
  
  signed_at?: string;
  signer_ip?: string;
  signature_data?: any;
  
  pdf_url?: string;
  
  quote_request_id?: string;
  proposal_id?: string;
  
  notes?: string;
  
  created_at: string;
  updated_at: string;
}

export interface ContractFormData {
  client_name: string;
  client_email: string;
  client_phone: string;
  client_address: string;
  client_profession: string;
  civil_status: string;
  
  event_type: string;
  event_date: string;
  event_time: string;
  event_location: string;
  
  total_price: string;
  down_payment: string;
  down_payment_date: string;
  remaining_amount: string;
  remaining_payment_date: string;
  
  template_id: string;
  notes: string;
  quote_request_id?: string;
  proposal_id?: string;
}

export interface ContractTemplate {
  id: string;
  name: string;
  description?: string;
  html_content: string;
  css_content?: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export type ContractStatus = 'draft' | 'sent' | 'signed' | 'cancelled';

export const CONTRACT_STATUS_OPTIONS = [
  { value: 'draft', label: 'Rascunho' },
  { value: 'sent', label: 'Enviado' },
  { value: 'signed', label: 'Assinado' },
  { value: 'cancelled', label: 'Cancelado' }
];

export const CIVIL_STATUS_OPTIONS = [
  { value: 'solteiro', label: 'Solteiro(a)' },
  { value: 'casado', label: 'Casado(a)' },
  { value: 'divorciado', label: 'Divorciado(a)' },
  { value: 'viuvo', label: 'Viúvo(a)' },
  { value: 'uniao_estavel', label: 'União Estável' }
];
