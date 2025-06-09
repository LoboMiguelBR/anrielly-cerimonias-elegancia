
// Tipos para eventos aprimorados
export type EventStatus = 
  | 'em_planejamento'
  | 'orcamento'
  | 'proposta'
  | 'negociacao'
  | 'contratado'
  | 'confirmado'
  | 'em_andamento'
  | 'concluido'
  | 'cancelado';

export type EventType = 
  | 'casamento'
  | 'aniversario'
  | 'formatura'
  | 'corporativo'
  | 'batizado'
  | 'primeira_comunhao'
  | 'bar_mitzvah'
  | 'debutante'
  | 'cha_bebe'
  | 'cha_panela'
  | 'noivado'
  | 'bodas'
  | 'funeral'
  | 'outros';

export interface EventFilters {
  status?: EventStatus[];
  event_type?: EventType[];
  date_range?: {
    start: string;
    end: string;
  };
  search_query?: string;
}

export interface Event {
  id: string;
  tenant_id: string;
  
  // Informações básicas
  title: string;
  description?: string;
  event_type: EventType;
  status: EventStatus;
  
  // Data e local
  event_date: string;
  start_time?: string;
  end_time?: string;
  venue?: EventVenue;
  
  // Participantes
  client_id: string;
  organizer_id: string;
  participants?: EventParticipant[];
  guest_count?: number;
  
  // Orçamento
  budget?: EventBudget;
  
  // Timeline e checklist
  timeline?: EventTimeline[];
  checklist?: EventChecklist[];
  
  // Fornecedores
  suppliers?: EventSupplier[];
  
  // Documentos e mídia
  documents?: EventDocument[];
  gallery?: EventGallery[];
  
  // Configurações
  settings?: EventSettings;
  
  // Compatibilidade com campos existentes
  quote_id?: string;
  proposal_id?: string;
  contract_id?: string;
  type?: string;
  date?: string;
  location?: string;
  notes?: string;
  
  // Metadados
  created_at: string;
  updated_at: string;
}

export interface EventVenue {
  name: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  capacity: number;
  venue_type: string;
  contact_person?: string;
  contact_phone?: string;
  contact_email?: string;
  special_features: string[];
}

export interface EventParticipant {
  id: string;
  event_id: string;
  user_id?: string;
  name: string;
  email: string;
  phone?: string;
  role: 'noivo' | 'noiva' | 'pai' | 'mae' | 'padrinho' | 'madrinha' | 'convidado' | 'organizador';
  confirmed: boolean;
  notes?: string;
}

export interface EventBudget {
  total_budget: number;
  allocated_budget: number;
  spent_amount: number;
  categories: BudgetCategory[];
}

export interface BudgetCategory {
  category: string;
  allocated_amount: number;
  spent_amount: number;
  suppliers: string[];
}

export interface EventTimeline {
  id: string;
  event_id: string;
  title: string;
  description: string;
  due_date: string;
  completed: boolean;
  completed_date?: string;
  assigned_to?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  dependencies: string[];
}

export interface EventChecklist {
  id: string;
  event_id: string;
  title: string;
  description: string;
  completed: boolean;
  completed_date?: string;
  assigned_to?: string;
  due_date?: string;
  category: string;
  order_index: number;
}

export interface EventSupplier {
  id: string;
  event_id: string;
  supplier_id: string;
  service_category: string;
  status: 'cotacao' | 'negociacao' | 'contratado' | 'confirmado' | 'cancelado';
  quote_id?: string;
  contract_id?: string;
  allocated_budget: number;
  final_price?: number;
  notes?: string;
}

export interface EventDocument {
  id: string;
  event_id: string;
  title: string;
  file_path: string;
  file_type: string;
  file_size: number;
  category: string;
  uploaded_by: string;
  created_at: string;
}

export interface EventGallery {
  id: string;
  event_id: string;
  image_url: string;
  thumbnail_url: string;
  title?: string;
  description?: string;
  category: 'planejamento' | 'evento' | 'pos_evento';
  photographer?: string;
  created_at: string;
}

export interface EventSettings {
  public_gallery: boolean;
  guest_rsvp_enabled: boolean;
  notifications_enabled: boolean;
  social_sharing_enabled: boolean;
  custom_domain?: string;
}

// Templates de eventos
export interface EventTemplate {
  id: string;
  name: string;
  description: string;
  event_type: EventType;
  timeline_template: EventTimelineTemplate[];
  checklist_template: EventChecklistTemplate[];
  budget_template: BudgetCategoryTemplate[];
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface EventTimelineTemplate {
  title: string;
  description: string;
  days_before_event: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
}

export interface EventChecklistTemplate {
  title: string;
  description: string;
  category: string;
  order_index: number;
}

export interface BudgetCategoryTemplate {
  category: string;
  percentage: number;
  description: string;
}
