
export interface ProposalTemplateData {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  logo?: string;
  showQrCode: boolean;
  showTestimonials: boolean;
  showDifferentials: boolean;
  showAboutSection: boolean;
  created_at?: string;
  updated_at?: string;
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
  template_id?: string;
  created_at?: string;
  status?: 'draft' | 'sent' | 'approved' | 'rejected';
  pdf_url?: string;
}

export interface Service {
  name: string;
  included: boolean;
  description?: string;
  price?: number;
}
