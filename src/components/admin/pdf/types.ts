
import { Service } from '../hooks/proposal/types';

// Re-export the Service type
export type { Service };

// Re-export the ProposalData type if it's needed in other files
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
