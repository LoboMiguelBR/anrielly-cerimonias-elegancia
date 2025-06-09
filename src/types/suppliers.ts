
import { UserRole, UserProfile } from './auth';

export type SupplierStatus = 'pending' | 'approved' | 'rejected' | 'suspended';
export type QuoteStatus = 'pending' | 'sent' | 'accepted' | 'rejected' | 'expired';
export type ContractStatus = 'draft' | 'pending' | 'signed' | 'completed' | 'cancelled';

export interface Supplier {
  id: string;
  user_id: string;
  profile: UserProfile;
  
  // Informações da empresa
  company_name: string;
  business_type: string;
  tax_id: string;
  
  // Contato
  email: string;
  phone: string;
  website?: string;
  address: string;
  
  // Serviços
  categories: string[];
  services: SupplierService[];
  service_areas: string[];
  
  // Validação e status
  status: SupplierStatus;
  verified: boolean;
  verification_date?: string;
  
  // Portfolio e mídia
  logo_url?: string;
  cover_image_url?: string;
  portfolio: PortfolioItem[];
  
  // Avaliações
  rating: number;
  total_reviews: number;
  
  // Configurações comerciais
  pricing: PricingConfig;
  availability: AvailabilityConfig;
  
  // Metadados
  created_at: string;
  updated_at: string;
}

export interface SupplierService {
  id: string;
  name: string;
  description: string;
  category: string;
  base_price: number;
  price_unit: 'fixed' | 'per_hour' | 'per_person' | 'per_day';
  duration?: number;
  capacity?: number;
  includes: string[];
  optional_extras: ServiceExtra[];
}

export interface ServiceExtra {
  id: string;
  name: string;
  description: string;
  price: number;
  included: boolean;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  images: string[];
  event_type: string;
  event_date: string;
  location: string;
  featured: boolean;
  tags: string[];
}

export interface PricingConfig {
  minimum_budget: number;
  accepts_negotiation: boolean;
  payment_terms: string[];
  cancellation_policy: string;
  deposit_percentage: number;
}

export interface AvailabilityConfig {
  available_days: string[];
  blackout_dates: string[];
  advance_booking_days: number;
  max_events_per_day: number;
}

// Sistema de cotações
export interface QuoteRequest {
  id: string;
  event_id: string;
  supplier_id: string;
  client_id: string;
  
  // Detalhes do evento
  event_type: string;
  event_date: string;
  event_location: string;
  guest_count: number;
  budget_range: string;
  
  // Serviços solicitados
  requested_services: string[];
  special_requirements: string;
  
  // Status e timeline
  status: QuoteStatus;
  deadline: string;
  
  // Resposta do fornecedor
  quote_response?: QuoteResponse;
  
  created_at: string;
  updated_at: string;
}

export interface QuoteResponse {
  id: string;
  quote_request_id: string;
  supplier_id: string;
  
  // Proposta comercial
  total_price: number;
  services: QuotedService[];
  payment_terms: PaymentTerm[];
  
  // Condições
  validity_date: string;
  terms_conditions: string;
  notes: string;
  
  // Documentos
  attachments: string[];
  
  created_at: string;
  updated_at: string;
}

export interface QuotedService {
  service_id: string;
  name: string;
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  extras: ServiceExtra[];
}

export interface PaymentTerm {
  percentage: number;
  due_date: string;
  description: string;
}

// Sistema de contratos
export interface SupplierContract {
  id: string;
  quote_response_id: string;
  supplier_id: string;
  client_id: string;
  event_id: string;
  
  // Dados do contrato
  contract_number: string;
  title: string;
  description: string;
  total_value: number;
  
  // Status e timeline
  status: ContractStatus;
  signed_date?: string;
  completion_date?: string;
  
  // Documentos
  contract_template_id: string;
  signed_document_url?: string;
  
  // Pagamentos
  payment_schedule: PaymentSchedule[];
  
  created_at: string;
  updated_at: string;
}

export interface PaymentSchedule {
  id: string;
  contract_id: string;
  percentage: number;
  amount: number;
  due_date: string;
  description: string;
  status: 'pending' | 'paid' | 'overdue';
  paid_date?: string;
  payment_method?: string;
}

// Sistema de avaliações
export interface SupplierReview {
  id: string;
  supplier_id: string;
  client_id: string;
  event_id: string;
  contract_id: string;
  
  // Avaliação
  rating: number;
  title: string;
  comment: string;
  pros: string[];
  cons: string[];
  
  // Critérios específicos
  quality_rating: number;
  punctuality_rating: number;
  communication_rating: number;
  value_rating: number;
  
  // Evidências
  photos: string[];
  
  // Status
  verified: boolean;
  recommended: boolean;
  
  created_at: string;
  updated_at: string;
}

// Analytics para fornecedores
export interface SupplierAnalytics {
  supplier_id: string;
  period_start: string;
  period_end: string;
  
  // Métricas de performance
  total_quotes_received: number;
  total_quotes_sent: number;
  quote_conversion_rate: number;
  
  // Métricas comerciais
  total_contracts: number;
  total_revenue: number;
  average_contract_value: number;
  
  // Satisfação do cliente
  average_rating: number;
  total_reviews: number;
  recommendation_rate: number;
  
  // Ranking
  category_ranking: number;
  overall_ranking: number;
  
  updated_at: string;
}

// Tipos para busca e filtros
export interface SupplierSearchFilters {
  category?: string;
  location?: string;
  budget_min?: number;
  budget_max?: number;
  rating_min?: number;
  verified_only?: boolean;
  available_date?: string;
  services?: string[];
}

export interface SupplierSearchResult {
  supplier: Supplier;
  distance?: number;
  matching_services: string[];
  estimated_price?: number;
  availability_status: 'available' | 'busy' | 'unavailable';
}
