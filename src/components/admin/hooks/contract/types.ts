export type ContractStatus = 'draft' | 'pending' | 'signed' | 'canceled';

export interface ContractFormData {
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
  notes?: string;
  quote_request_id?: string;
  proposal_id?: string;
  // Audit fields
  ip_address?: string;
  user_agent?: string;
}

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
  notes?: string;
  quote_request_id?: string;
  proposal_id?: string;
  status: ContractStatus;
  token: string;
  public_token?: string;
  pdf_url?: string;
  html_content?: string;
  signed_at?: string;
  signature_data?: any;
  signer_ip?: string;
  created_at: string;
  updated_at: string;
  // Versioning fields
  version?: number;
  version_timestamp?: string;
  // Audit fields
  ip_address?: string;
  user_agent?: string;
}

export interface Contract {
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
  notes?: string;
  quote_request_id?: string;
  proposal_id?: string;
  status: 'pending' | 'signed' | 'draft' | 'canceled';
  token: string;
  public_token?: string;
  pdf_url?: string;
  html_content?: string;
  signed_at?: string;
  signature_data?: any;
  signer_ip?: string;
  created_at: string;
  updated_at: string;
  // Versioning fields
  version?: number;
  version_timestamp?: string;
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

export interface ContractTemplateFormData {
  name: string;
  description?: string;
  html_content: string;
  css_content?: string;
  is_default?: boolean;
}

export interface ContractEmailTemplate {
  id: string;
  name: string;
  description?: string;
  template_type: 'signature' | 'signed_confirmation' | 'reminder';
  subject: string;
  html_content: string;
  is_default?: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContractEmailTemplateFormData {
  name: string;
  description?: string;
  template_type: 'signature' | 'signed_confirmation' | 'reminder';
  subject: string;
  html_content: string;
  is_default?: boolean;
}

export const CIVIL_STATUS_OPTIONS = [
  { value: 'solteiro', label: 'Solteiro(a)' },
  { value: 'casado', label: 'Casado(a)' },
  { value: 'divorciado', label: 'Divorciado(a)' },
  { value: 'viuvo', label: 'Viúvo(a)' },
  { value: 'uniao_estavel', label: 'União Estável' }
];

export const EMAIL_TEMPLATE_TYPES = [
  { value: 'signature', label: 'Solicitação de Assinatura' },
  { value: 'signed_confirmation', label: 'Confirmação de Assinatura' },
  { value: 'reminder', label: 'Lembrete de Assinatura' }
];
