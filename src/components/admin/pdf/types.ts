
// Remove the conflicting import and use the existing Service type
// import { Service } from '../hooks/proposal/types';

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
  template_id?: string;
  status?: string;
  pdf_url?: string;
}

export interface Colors {
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  background: string;
}

export interface PDFHeaderProps {
  proposalId: string;
  createdDate: string;
  colors: Colors;
}

export interface PDFTitleProps {
  eventType: string;
  colors: Colors;
}

export interface ClientInfoSectionProps {
  client: Pick<ProposalData, 'client_name' | 'client_email' | 'client_phone'>;
  colors: Colors;
}

export interface EventDetailsSectionProps {
  eventType: string;
  eventDate: string;
  eventLocation: string;
  colors: Colors;
}

export interface ServicesSectionProps {
  services: Service[];
  colors: Colors;
}

export interface PricingSectionProps {
  totalPrice: number;
  paymentTerms: string;
  colors: Colors;
}

export interface NotesSectionProps {
  notes: string | null;
  colors: Colors;
}

export interface PDFFooterProps {
  validUntil: string;
  colors: Colors;
}

export interface QRCodeSectionProps {
  url: string;
  colors: Colors;
}

export interface GenericSectionProps {
  colors: Colors;
}

export interface Service {
  name: string;
  included: boolean;
  description?: string;
  price?: number;
}
