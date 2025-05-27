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
  token: string;
  signed_at?: string;
  template_id?: string;
}

export interface ContractStatusUpdate {
  status: 'pending' | 'signed' | 'draft' | 'canceled';
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
