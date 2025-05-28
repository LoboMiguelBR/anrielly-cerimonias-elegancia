
export interface Service {
  id?: string;
  name: string;
  description?: string;
  price: number;
  quantity?: number;
}

export interface ProposalData {
  id?: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  event_type: string;
  event_date?: string;
  event_location: string;
  services: Service[];
  total_price: number;
  payment_terms: string;
  notes?: string;
  quote_request_id?: string;
  validity_date: string;
  created_at?: string;
  template_id?: string | null;
  status?: string;
  pdf_url?: string | null;
  html_content?: string | null;
  css_content?: string | null;
  version?: number;
  version_timestamp?: string;
  public_slug?: string | null;
  public_token?: string;
}

export interface QuoteRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  event_type: string;
  event_date?: string;
  event_location: string;
  message?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProposalFormData extends Omit<ProposalData, 'id' | 'created_at'> {
  id?: string;
}
