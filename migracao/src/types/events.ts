// Tipos de eventos aprimorados (compatível com sistema existente)
export type EventStatus = 
  | 'em_planejamento'   // Mantido para compatibilidade
  | 'contratado'        // Mantido para compatibilidade
  | 'concluido'         // Mantido para compatibilidade
  | 'cancelado'         // Mantido para compatibilidade
  | 'orcamento'         // Novo: fase de orçamento
  | 'proposta'          // Novo: proposta enviada
  | 'negociacao'        // Novo: em negociação
  | 'confirmado'        // Novo: confirmado pelo cliente
  | 'em_andamento'      // Novo: evento acontecendo
  | 'finalizado';       // Novo: pós-evento

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

export type EventSubtype = 
  | 'civil'
  | 'religioso'
  | 'simbolico'
  | 'destination'
  | 'micro_wedding'
  | 'elopement'
  | 'renovacao_votos';

export type EventPriority = 'baixa' | 'media' | 'alta' | 'urgente';

// Interface principal do evento (estendida, mantendo compatibilidade)
export interface Event {
  // Campos existentes (mantidos para compatibilidade)
  id: string;
  quote_id?: string;
  proposal_id?: string;
  contract_id?: string;
  type: string;  // Mantido como string para compatibilidade
  date?: string;
  location?: string;
  status: EventStatus;
  tenant_id?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  
  // Novos campos aprimorados
  title: string;
  event_type: EventType;
  event_subtype?: EventSubtype;
  priority: EventPriority;
  
  // Datas detalhadas
  start_date: string;
  end_date: string;
  ceremony_time?: string;
  reception_time?: string;
  
  // Locais detalhados
  ceremony_venue?: EventVenue;
  reception_venue?: EventVenue;
  
  // Informações do evento
  guest_count: number;
  estimated_budget: number;
  final_budget?: number;
  theme_colors: string[];
  dress_code?: string;
  
  // Relacionamentos
  client_id: string;
  organizer_id: string;  // Cerimonialista responsável
  suppliers: EventSupplier[];
  timeline: EventTimelineItem[];
  checklist: EventChecklistItem[];
  documents: EventDocument[];
  
  // Configurações
  is_public: boolean;
  allow_rsvp: boolean;
  rsvp_deadline?: string;
  
  // Metadados
  tags: string[];
  custom_fields: Record<string, any>;
}

export interface EventVenue {
  id?: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  capacity: number;
  contact_person?: string;
  contact_phone?: string;
  contact_email?: string;
  amenities: string[];
  photos: string[];
  notes?: string;
}

export interface EventSupplier {
  id: string;
  supplier_id: string;
  category: string;
  service_description: string;
  contracted_value: number;
  payment_terms: string;
  status: 'cotacao' | 'contratado' | 'cancelado' | 'finalizado';
  contract_url?: string;
  notes?: string;
  created_at: string;
}

export interface EventTimelineItem {
  id: string;
  event_id: string;
  title: string;
  description?: string;
  scheduled_time: string;
  duration_minutes: number;
  responsible_person?: string;
  location?: string;
  status: 'pendente' | 'em_andamento' | 'concluido' | 'cancelado';
  dependencies: string[];  // IDs de outros itens da timeline
  notifications: TimelineNotification[];
  created_at: string;
  updated_at: string;
}

export interface TimelineNotification {
  type: 'email' | 'sms' | 'push';
  recipients: string[];
  send_before_minutes: number;
  message_template: string;
}

export interface EventChecklistItem {
  id: string;
  event_id: string;
  category: string;
  title: string;
  description?: string;
  priority: EventPriority;
  assigned_to?: string;
  due_date?: string;
  completed: boolean;
  completed_at?: string;
  completed_by?: string;
  notes?: string;
  attachments: string[];
  created_at: string;
  updated_at: string;
}

export interface EventDocument {
  id: string;
  event_id: string;
  title: string;
  type: 'contract' | 'invoice' | 'receipt' | 'permit' | 'insurance' | 'other';
  file_url: string;
  file_size: number;
  mime_type: string;
  uploaded_by: string;
  is_signed?: boolean;
  signature_data?: SignatureData;
  created_at: string;
}

export interface SignatureData {
  signer_name: string;
  signer_email: string;
  signed_at: string;
  signature_image_url: string;
  ip_address: string;
}

// Participantes do evento (estendido, mantendo compatibilidade)
export interface EventParticipant {
  // Campos existentes (mantidos para compatibilidade)
  id: string;
  event_id: string;
  user_email: string;
  name?: string;
  role: 'noivo' | 'noiva' | 'cerimonialista' | 'cliente' | 'admin';
  invited: boolean;
  accepted: boolean;
  magic_link_token?: string;
  created_at: string;
  updated_at: string;
  
  // Novos campos aprimorados
  user_id?: string;
  participant_type: ParticipantType;
  permissions: ParticipantPermission[];
  contact_info: ContactInfo;
  dietary_restrictions?: string[];
  accessibility_needs?: string[];
  plus_one_allowed: boolean;
  plus_one_name?: string;
  rsvp_status: 'pending' | 'accepted' | 'declined' | 'maybe';
  rsvp_date?: string;
  notes?: string;
}

export type ParticipantType = 
  | 'noivo'
  | 'noiva'
  | 'pai_noivo'
  | 'mae_noivo'
  | 'pai_noiva'
  | 'mae_noiva'
  | 'padrinho'
  | 'madrinha'
  | 'cerimonialista'
  | 'fotografo'
  | 'fornecedor'
  | 'convidado'
  | 'familia'
  | 'amigo'
  | 'trabalho'
  | 'outros';

export interface ParticipantPermission {
  resource: string;
  actions: string[];
}

export interface ContactInfo {
  phone?: string;
  whatsapp?: string;
  instagram?: string;
  address?: string;
}

// Tipos para relatórios e analytics
export interface EventAnalytics {
  event_id: string;
  total_guests: number;
  confirmed_guests: number;
  pending_rsvp: number;
  declined_guests: number;
  total_budget: number;
  spent_budget: number;
  remaining_budget: number;
  completion_percentage: number;
  timeline_progress: number;
  checklist_progress: number;
  supplier_status: Record<string, number>;
  generated_at: string;
}

// Tipos para templates de eventos
export interface EventTemplate {
  id: string;
  name: string;
  description: string;
  event_type: EventType;
  default_timeline: Omit<EventTimelineItem, 'id' | 'event_id' | 'created_at' | 'updated_at'>[];
  default_checklist: Omit<EventChecklistItem, 'id' | 'event_id' | 'created_at' | 'updated_at'>[];
  suggested_suppliers: string[];
  estimated_duration_hours: number;
  min_guest_count: number;
  max_guest_count: number;
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

// Filtros e busca
export interface EventFilters {
  status?: EventStatus[];
  event_type?: EventType[];
  date_range?: {
    start: string;
    end: string;
  };
  budget_range?: {
    min: number;
    max: number;
  };
  organizer_id?: string;
  client_id?: string;
  venue_city?: string;
  tags?: string[];
  search_query?: string;
}

export interface EventSearchResult {
  events: Event[];
  total_count: number;
  page: number;
  per_page: number;
  total_pages: number;
  filters_applied: EventFilters;
}

// Tipos para notificações de eventos
export interface EventNotification {
  id: string;
  event_id: string;
  recipient_id: string;
  type: 'reminder' | 'update' | 'invitation' | 'cancellation' | 'payment_due';
  title: string;
  message: string;
  scheduled_for: string;
  sent_at?: string;
  read_at?: string;
  action_url?: string;
  metadata?: Record<string, any>;
}

// Exportações para compatibilidade com código existente
export type { Event as EventoAprimorado };
export type { EventParticipant as ParticipanteEvento };

