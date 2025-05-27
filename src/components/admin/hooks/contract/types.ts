
export interface ContractData {
  id: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  client_address?: string;
  client_profession?: string;
  civil_status?: string;
  event_type: string;
  event_date: string;
  event_time?: string;
  event_location?: string;
  total_price: number;
  down_payment?: number;
  down_payment_date?: string;
  remaining_amount?: number;
  remaining_payment_date?: string;
  notes?: string;
  status: 'pending' | 'signed' | 'draft' | 'canceled';
  created_at: string;
  updated_at: string;
  token?: string; // Tornando opcional para compatibilidade
  public_token?: string;
  signed_at?: string;
  template_id?: string;
  quote_request_id?: string;
  proposal_id?: string;
  pdf_url?: string;
  html_content?: string;
  signer_ip?: string;
  signature_data?: any;
}

export interface ContractFormData {
  client_name: string;
  client_email: string;
  client_phone: string;
  client_address?: string;
  client_profession?: string;
  civil_status?: string;
  event_type: string;
  event_date: string;
  event_time?: string;
  event_location?: string;
  total_price: number; // Mudando para number
  down_payment?: number; // Mudando para number
  down_payment_date?: string;
  remaining_amount?: number; // Mudando para number
  remaining_payment_date?: string;
  notes?: string;
  template_id?: string;
  quote_request_id?: string;
  proposal_id?: string;
}

export type ContractStatus = 'pending' | 'signed' | 'draft' | 'canceled';

export interface ContractStatusUpdate {
  status: ContractStatus;
}

export interface ContractTemplate {
  id: string;
  name: string;
  description?: string;
  html_content: string;
  css_content?: string;
  is_default?: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContractEmailTemplate {
  id: string;
  name: string;
  description?: string;
  subject: string;
  html_content: string;
  template_type: 'signature' | 'signed_confirmation' | 'reminder';
  is_default?: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContractEmailTemplateFormData {
  name: string;
  description?: string;
  subject: string;
  html_content: string;
  template_type: 'signature' | 'signed_confirmation' | 'reminder';
  is_default?: boolean;
}

export const CIVIL_STATUS_OPTIONS = [
  { value: 'solteiro', label: 'Solteiro(a)' },
  { value: 'casado', label: 'Casado(a)' },
  { value: 'divorciado', label: 'Divorciado(a)' },
  { value: 'viuvo', label: 'Viúvo(a)' },
  { value: 'uniao_estavel', label: 'União Estável' }
] as const;

export const EMAIL_TEMPLATE_TYPES = [
  { value: 'signature', label: 'Para Assinatura' },
  { value: 'signed_confirmation', label: 'Confirmação de Assinatura' },
  { value: 'reminder', label: 'Lembrete' }
] as const;
