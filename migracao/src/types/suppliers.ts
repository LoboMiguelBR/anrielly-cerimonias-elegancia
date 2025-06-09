// Tipos para sistema de fornecedores
export type SupplierStatus = 'active' | 'inactive' | 'pending_approval' | 'suspended' | 'blacklisted';
export type SupplierVerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected';

export interface Supplier {
  id: string;
  tenant_id: string;
  user_id: string;  // Referência ao UserProfile
  
  // Informações da empresa
  company_name: string;
  business_name?: string;
  tax_id: string;
  business_type: SupplierCategory;
  
  // Status e verificação
  status: SupplierStatus;
  verification_status: SupplierVerificationStatus;
  verified_at?: string;
  verified_by?: string;
  
  // Informações de contato
  contact_info: SupplierContactInfo;
  
  // Serviços e especialidades
  services: SupplierService[];
  specialties: string[];
  service_areas: ServiceArea[];
  
  // Avaliações e portfolio
  rating: SupplierRating;
  portfolio: SupplierPortfolioItem[];
  certifications: SupplierCertification[];
  
  // Configurações comerciais
  pricing: SupplierPricing;
  availability: SupplierAvailability;
  policies: SupplierPolicies;
  
  // Documentação
  documents: SupplierDocument[];
  
  // Estatísticas
  stats: SupplierStats;
  
  // Metadados
  tags: string[];
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface SupplierContactInfo {
  primary_phone: string;
  secondary_phone?: string;
  whatsapp?: string;
  email: string;
  website?: string;
  social_media: {
    instagram?: string;
    facebook?: string;
    linkedin?: string;
    youtube?: string;
  };
  address: SupplierAddress;
}

export interface SupplierAddress {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface SupplierService {
  id: string;
  category: SupplierCategory;
  subcategory: string;
  name: string;
  description: string;
  base_price: number;
  price_unit: 'fixed' | 'per_hour' | 'per_day' | 'per_person' | 'per_item' | 'custom';
  min_price?: number;
  max_price?: number;
  duration_hours?: number;
  includes: string[];
  excludes: string[];
  requirements: string[];
  is_active: boolean;
  created_at: string;
}

export interface ServiceArea {
  city: string;
  state: string;
  travel_fee?: number;
  max_distance_km?: number;
  notes?: string;
}

export interface SupplierRating {
  overall: number;
  total_reviews: number;
  breakdown: {
    quality: number;
    punctuality: number;
    communication: number;
    value_for_money: number;
    professionalism: number;
  };
  recent_reviews: SupplierReview[];
}

export interface SupplierReview {
  id: string;
  event_id: string;
  reviewer_id: string;
  reviewer_name: string;
  rating: number;
  title: string;
  comment: string;
  photos: string[];
  breakdown: {
    quality: number;
    punctuality: number;
    communication: number;
    value_for_money: number;
    professionalism: number;
  };
  response?: SupplierReviewResponse;
  is_verified: boolean;
  created_at: string;
}

export interface SupplierReviewResponse {
  message: string;
  responded_at: string;
  responded_by: string;
}

export interface SupplierPortfolioItem {
  id: string;
  title: string;
  description: string;
  event_type: string;
  event_date: string;
  location: string;
  client_testimonial?: string;
  media: PortfolioMedia[];
  tags: string[];
  is_featured: boolean;
  created_at: string;
}

export interface PortfolioMedia {
  type: 'image' | 'video';
  url: string;
  thumbnail_url?: string;
  caption?: string;
  order_index: number;
}

export interface SupplierCertification {
  id: string;
  name: string;
  issuing_organization: string;
  issue_date: string;
  expiry_date?: string;
  certificate_url?: string;
  verification_url?: string;
  is_verified: boolean;
}

export interface SupplierPricing {
  currency: 'BRL' | 'USD' | 'EUR';
  payment_methods: PaymentMethod[];
  payment_terms: PaymentTerm[];
  discount_policies: DiscountPolicy[];
  cancellation_policy: CancellationPolicy;
  additional_fees: AdditionalFee[];
}

export interface PaymentMethod {
  type: 'cash' | 'credit_card' | 'debit_card' | 'bank_transfer' | 'pix' | 'check' | 'financing';
  accepted: boolean;
  fee_percentage?: number;
  notes?: string;
}

export interface PaymentTerm {
  name: string;
  description: string;
  percentage: number;
  due_days: number;
  is_default: boolean;
}

export interface DiscountPolicy {
  name: string;
  type: 'percentage' | 'fixed_amount';
  value: number;
  conditions: string;
  min_order_value?: number;
  valid_until?: string;
  is_active: boolean;
}

export interface CancellationPolicy {
  free_cancellation_hours: number;
  partial_refund_hours: number;
  partial_refund_percentage: number;
  no_refund_hours: number;
  terms: string;
}

export interface AdditionalFee {
  name: string;
  type: 'percentage' | 'fixed_amount';
  value: number;
  description: string;
  is_optional: boolean;
  applies_to: 'all' | 'specific_services';
  service_ids?: string[];
}

export interface SupplierAvailability {
  working_hours: WorkingHours[];
  blackout_dates: BlackoutDate[];
  advance_booking_days: number;
  max_events_per_day: number;
  simultaneous_events_allowed: boolean;
  travel_time_buffer_hours: number;
}

export interface WorkingHours {
  day_of_week: 0 | 1 | 2 | 3 | 4 | 5 | 6;  // 0 = Sunday
  start_time: string;  // HH:mm format
  end_time: string;    // HH:mm format
  is_available: boolean;
}

export interface BlackoutDate {
  start_date: string;
  end_date: string;
  reason: string;
  is_recurring: boolean;
  recurrence_pattern?: 'yearly' | 'monthly' | 'weekly';
}

export interface SupplierPolicies {
  terms_of_service: string;
  privacy_policy: string;
  refund_policy: string;
  equipment_policy?: string;
  venue_requirements?: string;
  client_responsibilities: string[];
  supplier_responsibilities: string[];
}

export interface SupplierDocument {
  id: string;
  type: 'business_license' | 'insurance' | 'tax_certificate' | 'portfolio' | 'contract_template' | 'other';
  name: string;
  file_url: string;
  file_size: number;
  mime_type: string;
  expiry_date?: string;
  is_verified: boolean;
  verified_by?: string;
  verified_at?: string;
  uploaded_at: string;
}

export interface SupplierStats {
  total_events: number;
  completed_events: number;
  cancelled_events: number;
  total_revenue: number;
  avg_event_value: number;
  response_time_hours: number;
  completion_rate: number;
  repeat_client_rate: number;
  on_time_delivery_rate: number;
  last_updated: string;
}

// Cotações e propostas
export interface SupplierQuote {
  id: string;
  event_id: string;
  supplier_id: string;
  quote_request_id: string;
  
  // Informações da cotação
  title: string;
  description: string;
  total_amount: number;
  currency: string;
  
  // Itens da cotação
  line_items: QuoteLineItem[];
  
  // Condições
  payment_terms: PaymentTerm[];
  delivery_terms: string;
  validity_days: number;
  
  // Status
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected' | 'expired' | 'withdrawn';
  
  // Datas importantes
  sent_at?: string;
  viewed_at?: string;
  responded_at?: string;
  expires_at: string;
  
  // Comunicação
  notes?: string;
  client_feedback?: string;
  
  // Anexos
  attachments: QuoteAttachment[];
  
  created_at: string;
  updated_at: string;
}

export interface QuoteLineItem {
  id: string;
  service_id?: string;
  name: string;
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  includes: string[];
  excludes: string[];
  notes?: string;
}

export interface QuoteAttachment {
  name: string;
  file_url: string;
  file_size: number;
  mime_type: string;
}

// Solicitações de cotação
export interface QuoteRequest {
  id: string;
  event_id: string;
  client_id: string;
  
  // Informações do evento
  event_details: QuoteEventDetails;
  
  // Serviços solicitados
  requested_services: RequestedService[];
  
  // Orçamento
  budget_range: {
    min: number;
    max: number;
    currency: string;
  };
  
  // Fornecedores
  invited_suppliers: string[];
  received_quotes: string[];
  
  // Status
  status: 'draft' | 'published' | 'closed' | 'cancelled';
  
  // Datas
  deadline: string;
  event_date: string;
  
  // Comunicação
  additional_requirements: string;
  special_instructions: string;
  
  created_at: string;
  updated_at: string;
}

export interface QuoteEventDetails {
  type: string;
  date: string;
  start_time: string;
  end_time: string;
  guest_count: number;
  venue_name?: string;
  venue_address?: string;
  venue_type: 'indoor' | 'outdoor' | 'mixed';
  theme?: string;
  style?: string;
}

export interface RequestedService {
  category: SupplierCategory;
  subcategory?: string;
  description: string;
  requirements: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  budget_allocation?: number;
}

// Contratos e acordos
export interface SupplierContract {
  id: string;
  event_id: string;
  supplier_id: string;
  quote_id: string;
  
  // Informações do contrato
  contract_number: string;
  title: string;
  description: string;
  
  // Valores
  total_amount: number;
  currency: string;
  payment_schedule: ContractPayment[];
  
  // Termos
  terms_and_conditions: string;
  deliverables: ContractDeliverable[];
  milestones: ContractMilestone[];
  
  // Status
  status: 'draft' | 'sent' | 'signed' | 'active' | 'completed' | 'cancelled' | 'disputed';
  
  // Assinaturas
  signatures: ContractSignature[];
  
  // Datas importantes
  start_date: string;
  end_date: string;
  signed_at?: string;
  
  // Documentos
  contract_url?: string;
  attachments: ContractAttachment[];
  
  created_at: string;
  updated_at: string;
}

export interface ContractPayment {
  id: string;
  description: string;
  amount: number;
  due_date: string;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  paid_at?: string;
  payment_method?: string;
  transaction_id?: string;
}

export interface ContractDeliverable {
  id: string;
  name: string;
  description: string;
  due_date: string;
  status: 'pending' | 'in_progress' | 'completed' | 'delayed';
  completed_at?: string;
  notes?: string;
}

export interface ContractMilestone {
  id: string;
  name: string;
  description: string;
  due_date: string;
  payment_percentage?: number;
  status: 'pending' | 'completed' | 'missed';
  completed_at?: string;
}

export interface ContractSignature {
  signer_type: 'client' | 'supplier' | 'witness';
  signer_name: string;
  signer_email: string;
  signed_at?: string;
  signature_image_url?: string;
  ip_address?: string;
}

export interface ContractAttachment {
  name: string;
  file_url: string;
  file_size: number;
  mime_type: string;
  uploaded_by: string;
  uploaded_at: string;
}

// Filtros e busca
export interface SupplierFilters {
  categories?: SupplierCategory[];
  service_areas?: string[];
  rating_min?: number;
  price_range?: {
    min: number;
    max: number;
  };
  availability_date?: string;
  verification_status?: SupplierVerificationStatus[];
  status?: SupplierStatus[];
  search_query?: string;
  tags?: string[];
  sort_by?: 'rating' | 'price' | 'distance' | 'reviews' | 'recent';
  sort_order?: 'asc' | 'desc';
}

export interface SupplierSearchResult {
  suppliers: Supplier[];
  total_count: number;
  page: number;
  per_page: number;
  total_pages: number;
  filters_applied: SupplierFilters;
  aggregations: {
    categories: Record<SupplierCategory, number>;
    price_ranges: Record<string, number>;
    ratings: Record<string, number>;
    locations: Record<string, number>;
  };
}

// Notificações para fornecedores
export interface SupplierNotification {
  id: string;
  supplier_id: string;
  type: 'quote_request' | 'quote_accepted' | 'quote_rejected' | 'contract_signed' | 'payment_received' | 'review_received' | 'event_reminder';
  title: string;
  message: string;
  data?: Record<string, any>;
  read_at?: string;
  action_url?: string;
  created_at: string;
}

// Analytics para fornecedores
export interface SupplierAnalytics {
  supplier_id: string;
  period: 'week' | 'month' | 'quarter' | 'year';
  metrics: {
    quote_requests_received: number;
    quotes_sent: number;
    quote_acceptance_rate: number;
    total_revenue: number;
    avg_order_value: number;
    client_retention_rate: number;
    response_time_avg_hours: number;
    rating_trend: number[];
    booking_trend: number[];
  };
  top_services: {
    service_name: string;
    bookings: number;
    revenue: number;
  }[];
  client_feedback_summary: {
    positive_keywords: string[];
    improvement_areas: string[];
    common_complaints: string[];
  };
  generated_at: string;
}

// Exportações para compatibilidade
export type { Supplier as FornecedorEvento };
export type { SupplierService as ServicoFornecedor };

