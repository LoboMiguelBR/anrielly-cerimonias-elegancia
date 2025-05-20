
import { Json } from '@/integrations/supabase/types';

export interface Service {
  name: string;
  included: boolean;
}

export interface ProposalFormData {
  client_name: string;
  client_email: string;
  client_phone: string;
  event_type: string;
  event_date: string | null;
  event_location: string;
  validity_date: string;
  services: Service[];
  customService: string;
  total_price: string;
  payment_terms: string;
  notes: string;
  quote_request_id: string | null;
}

export interface QuoteRequest {
  id: string;
  name: string;
  eventType?: string;
  event_type?: string;
  email?: string;
  phone?: string;
  event_date?: string;
  event_location?: string;
}

export interface ProposalData {
  id: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  event_type: string;
  event_date: string | null;
  event_location: string;
  services: Service[];
  total_price: number;
  payment_terms: string;
  notes: string | null;
  quote_request_id: string | null;
  validity_date: string;
  created_at?: string;
}
