// Tipos compartilhados e utilitários
export type UUID = string;
export type Timestamp = string;
export type Currency = 'BRL' | 'USD' | 'EUR';
export type Language = 'pt-BR' | 'en-US' | 'es-ES';

// Tipos de resposta da API
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
  meta?: ResponseMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  field?: string;
}

export interface ResponseMeta {
  page?: number;
  per_page?: number;
  total?: number;
  total_pages?: number;
  has_next?: boolean;
  has_prev?: boolean;
}

// Tipos de paginação
export interface PaginationParams {
  page: number;
  per_page: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    current_page: number;
    per_page: number;
    total_items: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

// Tipos de filtros genéricos
export interface DateRange {
  start: string;
  end: string;
}

export interface PriceRange {
  min: number;
  max: number;
  currency: Currency;
}

export interface SearchParams {
  query?: string;
  filters?: Record<string, any>;
  sort?: SortParams;
  pagination?: PaginationParams;
}

export interface SortParams {
  field: string;
  order: 'asc' | 'desc';
}

// Tipos de endereço
export interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  coordinates?: Coordinates;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

// Tipos de contato
export interface ContactInfo {
  email: string;
  phone?: string;
  whatsapp?: string;
  website?: string;
  social_media?: SocialMediaLinks;
}

export interface SocialMediaLinks {
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  twitter?: string;
  youtube?: string;
  tiktok?: string;
}

// Tipos de arquivo/mídia
export interface FileUpload {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
  url?: string;
}

export interface MediaFile {
  id: string;
  filename: string;
  original_filename: string;
  url: string;
  size: number;
  mime_type: string;
  width?: number;
  height?: number;
  duration?: number;
  alt_text?: string;
  caption?: string;
  created_at: string;
}

// Tipos de notificação
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  action_url?: string;
  created_at: string;
  expires_at?: string;
}

export type NotificationType = 
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'event_reminder'
  | 'payment_due'
  | 'quote_received'
  | 'contract_signed'
  | 'review_request'
  | 'system_update';

// Tipos de configuração
export interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  language: Language;
  timezone: string;
  currency: Currency;
  date_format: string;
  time_format: '12h' | '24h';
  notifications: NotificationPreferences;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  in_app: boolean;
  marketing: boolean;
  reminders: boolean;
  updates: boolean;
}

// Tipos de auditoria
export interface AuditLog {
  id: string;
  user_id: string;
  tenant_id: string;
  action: string;
  resource_type: string;
  resource_id: string;
  changes?: Record<string, any>;
  ip_address: string;
  user_agent: string;
  created_at: string;
}

// Tipos de cache
export interface CacheEntry<T = any> {
  key: string;
  data: T;
  expires_at: number;
  created_at: number;
}

// Tipos de validação
export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

// Tipos de estado de loading
export interface LoadingState {
  loading: boolean;
  error?: string | null;
  success?: boolean;
}

export interface AsyncState<T = any> extends LoadingState {
  data?: T;
  lastFetch?: number;
}

// Tipos de formulário
export interface FormState<T = any> {
  values: T;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
}

// Tipos de modal/dialog
export interface ModalState {
  isOpen: boolean;
  title?: string;
  content?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closable?: boolean;
  onClose?: () => void;
}

// Tipos de toast/snackbar
export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
  action?: ToastAction;
}

export interface ToastAction {
  label: string;
  onClick: () => void;
}

// Tipos de dashboard
export interface DashboardWidget {
  id: string;
  type: string;
  title: string;
  size: 'small' | 'medium' | 'large';
  position: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  config: Record<string, any>;
  data?: any;
}

export interface DashboardLayout {
  id: string;
  name: string;
  widgets: DashboardWidget[];
  is_default: boolean;
  created_by: string;
  created_at: string;
}

// Tipos de métricas
export interface Metric {
  name: string;
  value: number;
  unit?: string;
  change?: number;
  change_type?: 'increase' | 'decrease';
  period?: string;
  format?: 'number' | 'currency' | 'percentage';
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
}

// Tipos de integração
export interface Integration {
  id: string;
  name: string;
  type: 'webhook' | 'api' | 'oauth' | 'custom';
  status: 'active' | 'inactive' | 'error';
  config: Record<string, any>;
  last_sync?: string;
  error_message?: string;
  created_at: string;
}

export interface WebhookEvent {
  id: string;
  integration_id: string;
  event_type: string;
  payload: Record<string, any>;
  status: 'pending' | 'processed' | 'failed';
  attempts: number;
  last_attempt?: string;
  error_message?: string;
  created_at: string;
}

// Tipos de backup
export interface BackupInfo {
  id: string;
  type: 'full' | 'incremental';
  status: 'running' | 'completed' | 'failed';
  size_bytes: number;
  file_url?: string;
  created_at: string;
  completed_at?: string;
  error_message?: string;
}

// Tipos de feature flags
export interface FeatureFlag {
  key: string;
  name: string;
  description: string;
  enabled: boolean;
  rollout_percentage: number;
  conditions?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// Tipos de rate limiting
export interface RateLimit {
  limit: number;
  remaining: number;
  reset: number;
  window: number;
}

// Tipos de health check
export interface HealthCheck {
  status: 'healthy' | 'degraded' | 'unhealthy';
  checks: {
    database: HealthStatus;
    storage: HealthStatus;
    cache: HealthStatus;
    external_apis: HealthStatus;
  };
  timestamp: string;
}

export interface HealthStatus {
  status: 'up' | 'down' | 'degraded';
  response_time_ms?: number;
  error?: string;
  last_check: string;
}

// Tipos de configuração de ambiente
export interface EnvironmentConfig {
  app_name: string;
  app_version: string;
  environment: 'development' | 'staging' | 'production';
  debug: boolean;
  api_url: string;
  supabase_url: string;
  supabase_anon_key: string;
  storage_bucket: string;
  sentry_dsn?: string;
  google_analytics_id?: string;
  stripe_public_key?: string;
}

// Utilitários de tipo
export type Partial<T> = {
  [P in keyof T]?: T[P];
};

export type Required<T> = {
  [P in keyof T]-?: T[P];
};

export type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

export type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type NonNullable<T> = T extends null | undefined ? never : T;

// Tipos de evento do sistema
export interface SystemEvent {
  type: string;
  payload: Record<string, any>;
  timestamp: string;
  source: string;
}

// Tipos de configuração de tema
export interface ThemeConfig {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  border: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

// Tipos de localização
export interface LocaleConfig {
  code: Language;
  name: string;
  flag: string;
  rtl: boolean;
  date_format: string;
  currency_format: string;
  number_format: string;
}

// Tipos de SEO
export interface SEOData {
  title: string;
  description: string;
  keywords: string[];
  canonical_url?: string;
  og_image?: string;
  og_type?: string;
  twitter_card?: string;
  robots?: string;
  structured_data?: Record<string, any>;
}

// Tipos de analytics
export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  user_id?: string;
  session_id?: string;
  timestamp: string;
}

export interface AnalyticsData {
  page_views: number;
  unique_visitors: number;
  bounce_rate: number;
  avg_session_duration: number;
  conversion_rate: number;
  top_pages: Array<{
    path: string;
    views: number;
  }>;
  traffic_sources: Array<{
    source: string;
    visitors: number;
  }>;
}

// Exportações de conveniência
export type ID = UUID;
export type DateTime = Timestamp;

