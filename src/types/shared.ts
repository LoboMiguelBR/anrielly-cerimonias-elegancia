
// Tipos compartilhados e utilitários
export interface ApiResponse<T = any> {
  data: T;
  message: string;
  success: boolean;
  errors?: string[];
  meta?: ResponseMeta;
}

export interface ResponseMeta {
  page?: number;
  per_page?: number;
  total?: number;
  total_pages?: number;
  has_next?: boolean;
  has_prev?: boolean;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  meta: ResponseMeta;
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
  lastUpdated?: string;
}

export interface AsyncState<T = any> extends LoadingState {
  data: T | null;
}

// Tipos para notificações
export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  actions?: NotificationAction[];
  autoClose?: boolean;
  duration?: number;
  created_at: string;
  read_at?: string;
}

export interface NotificationAction {
  label: string;
  action: () => void;
  style?: 'primary' | 'secondary';
}

// Tipos para configurações da aplicação
export interface AppSettings {
  // Aparência
  theme: 'light' | 'dark' | 'auto';
  language: 'pt-BR' | 'en-US';
  timezone: string;
  
  // Notificações
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    marketing: boolean;
  };
  
  // Privacidade
  analytics: boolean;
  cookies: boolean;
  
  // Funcionalidades
  features: {
    experimental: boolean;
    beta_features: boolean;
  };
}

// Tipos para uploads e mídia
export interface UploadProgress {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
  url?: string;
}

export interface MediaFile {
  id: string;
  name: string;
  url: string;
  thumbnail_url?: string;
  file_type: string;
  file_size: number;
  width?: number;
  height?: number;
  alt_text?: string;
  caption?: string;
  created_at: string;
}

// Tipos para validação
export interface ValidationRule {
  type: 'required' | 'email' | 'phone' | 'url' | 'min' | 'max' | 'pattern' | 'custom';
  message: string;
  value?: any;
  validator?: (value: any) => boolean;
}

export interface FieldValidation {
  field: string;
  rules: ValidationRule[];
}

// Tipos para busca e filtros
export interface SearchFilters {
  query?: string;
  category?: string;
  status?: string;
  date_from?: string;
  date_to?: string;
  tags?: string[];
  [key: string]: any;
}

export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

export interface PaginationConfig {
  page: number;
  per_page: number;
  total?: number;
}

// Tipos para integração com APIs externas
export interface ExternalApiConfig {
  api_key: string;
  base_url: string;
  timeout: number;
  retry_attempts: number;
  headers?: Record<string, string>;
}

export interface WebhookConfig {
  id: string;
  url: string;
  events: string[];
  secret: string;
  active: boolean;
  created_at: string;
}

// Tipos para cache
export interface CacheConfig {
  ttl: number; // Time to live em segundos
  key: string;
  tags?: string[];
}

export interface CacheEntry<T = any> {
  key: string;
  data: T;
  expires_at: string;
  created_at: string;
  tags?: string[];
}

// Tipos para logs e auditoria
export interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  resource: string;
  resource_id: string;
  old_values?: Record<string, any>;
  new_values?: Record<string, any>;
  ip_address: string;
  user_agent: string;
  created_at: string;
}

export interface SystemLog {
  id: string;
  level: 'debug' | 'info' | 'warn' | 'error' | 'fatal';
  message: string;
  context?: Record<string, any>;
  stack_trace?: string;
  created_at: string;
}

// Tipos para métricas e analytics
export interface Metric {
  name: string;
  value: number;
  unit?: string;
  timestamp: string;
  tags?: Record<string, string>;
}

export interface Dashboard {
  id: string;
  name: string;
  description: string;
  widgets: DashboardWidget[];
  layout: DashboardLayout;
  filters: DashboardFilter[];
  created_at: string;
  updated_at: string;
}

export interface DashboardWidget {
  id: string;
  type: 'chart' | 'metric' | 'table' | 'text';
  title: string;
  config: WidgetConfig;
  position: WidgetPosition;
}

export interface WidgetConfig {
  data_source: string;
  query: string;
  chart_type?: 'line' | 'bar' | 'pie' | 'area';
  time_range?: string;
  refresh_interval?: number;
}

export interface WidgetPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface DashboardLayout {
  columns: number;
  row_height: number;
  margin: [number, number];
  padding: [number, number];
}

export interface DashboardFilter {
  field: string;
  type: 'select' | 'date' | 'text' | 'number';
  options?: string[];
  default_value?: any;
}
