
export type ContractStatus = 
  | 'draft'     // Rascunho
  | 'sent'      // Enviado para assinatura
  | 'signed'    // Assinado
  | 'cancelled' // Cancelado
  | 'expired'   // Expirado
  | 'pending';  // Pendente

export interface ContractData {
  id: string;
  token: string;
  public_token: string;
  public_slug?: string; // Campo para slug personalizado
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
  pdf_url?: string;
  notes?: string;
  status: ContractStatus;
  signature_data?: any;
  signed_at?: string;
  signer_ip?: string;
  ip_address?: string;
  user_agent?: string;
  quote_request_id?: string;
  proposal_id?: string;
  version: number;
  version_timestamp?: string;
  created_at: string;
  updated_at: string;
}

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
  ip_address?: string;
  user_agent?: string;
}

export interface ContractEmailTemplate {
  id: string;
  name: string;
  subject: string;
  html_content: string;
  template_type: string;
  description?: string;
  is_default?: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContractEmailTemplateFormData {
  name: string;
  subject: string;
  html_content: string;
  template_type: string;
  description?: string;
  is_default?: boolean;
}

export interface ContractTemplate {
  id: string;
  name: string;
  html_content: string;
  css_content?: string;
  description?: string;
  is_default?: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContractTemplateFormData {
  name: string;
  html_content: string;
  css_content?: string;
  description?: string;
  is_default?: boolean;
}

export interface SignatureCanvasProps {
  onSignatureChange: (signature: string) => void;
  hasDrawnSignature: boolean;
  onHasDrawnSignatureChange: (hasDrawn: boolean) => void;
}

export interface ContractSignatureSectionProps {
  contract: ContractData;
  onSignatureChange: (signature: string) => void;
  hasDrawnSignature: boolean;
  onHasDrawnSignatureChange: (hasDrawn: boolean) => void;
  isSubmitting: boolean;
  errorMessage: string;
  successMessage: string;
  onSubmit: () => Promise<void>;
}

export const CIVIL_STATUS_OPTIONS = [
  { value: 'solteiro', label: 'Solteiro(a)' },
  { value: 'casado', label: 'Casado(a)' },
  { value: 'divorciado', label: 'Divorciado(a)' },
  { value: 'viuvo', label: 'Viúvo(a)' },
  { value: 'uniao_estavel', label: 'União Estável' }
];

export const EMAIL_TEMPLATE_TYPES = [
  { value: 'signature', label: 'Envio para Assinatura' },
  { value: 'reminder', label: 'Lembrete' },
  { value: 'confirmation', label: 'Confirmação' },
  { value: 'custom', label: 'Personalizado' }
];
