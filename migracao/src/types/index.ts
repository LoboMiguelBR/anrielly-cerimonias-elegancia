// Exportações centralizadas de todos os tipos
// Tipos de autenticação e usuários
export * from './auth';

// Tipos de eventos
export * from './events';

// Tipos de CMS
export * from './cms';

// Tipos de fornecedores
export * from './suppliers';

// Tipos compartilhados
export * from './shared';

// Re-exportações para compatibilidade com código existente
export type {
  // Eventos - compatibilidade
  Event,
  EventParticipant,
  EventStatus,
  EventType,
  
  // CMS - compatibilidade
  CMSPage as WebsitePage,
  CMSSection as WebsiteSection,
  CMSPage as CMSLandingPage,
  PageStatus,
  PageType,
  SectionType,
  
  // Auth - novos tipos
  UserRole,
  UserProfile,
  Tenant,
  TenantStatus,
  AuthContext,
  
  // Fornecedores - novos tipos
  Supplier,
  SupplierCategory,
  SupplierStatus,
  SupplierQuote,
  QuoteRequest,
  
  // Utilitários
  ApiResponse,
  PaginatedResponse,
  LoadingState,
  AsyncState,
} from './index';

// Tipos de constantes para facilitar uso
export const USER_ROLES = {
  ADMIN_MASTER: 'admin_master',
  ADMIN: 'admin',
  CLIENTE: 'cliente',
  USUARIO: 'usuario',
  GUEST: 'guest',
} as const;

export const EVENT_STATUSES = {
  EM_PLANEJAMENTO: 'em_planejamento',
  CONTRATADO: 'contratado',
  CONCLUIDO: 'concluido',
  CANCELADO: 'cancelado',
  ORCAMENTO: 'orcamento',
  PROPOSTA: 'proposta',
  NEGOCIACAO: 'negociacao',
  CONFIRMADO: 'confirmado',
  EM_ANDAMENTO: 'em_andamento',
  FINALIZADO: 'finalizado',
} as const;

export const EVENT_TYPES = {
  CASAMENTO: 'casamento',
  ANIVERSARIO: 'aniversario',
  FORMATURA: 'formatura',
  CORPORATIVO: 'corporativo',
  BATIZADO: 'batizado',
  PRIMEIRA_COMUNHAO: 'primeira_comunhao',
  BAR_MITZVAH: 'bar_mitzvah',
  DEBUTANTE: 'debutante',
  CHA_BEBE: 'cha_bebe',
  CHA_PANELA: 'cha_panela',
  NOIVADO: 'noivado',
  BODAS: 'bodas',
  FUNERAL: 'funeral',
  OUTROS: 'outros',
} as const;

export const SUPPLIER_CATEGORIES = {
  FOTOGRAFIA: 'fotografia',
  FILMAGEM: 'filmagem',
  DECORACAO: 'decoracao',
  FLORICULTURA: 'floricultura',
  BUFFET: 'buffet',
  MUSICA: 'musica',
  SOM_ILUMINACAO: 'som_iluminacao',
  TRANSPORTE: 'transporte',
  HOSPEDAGEM: 'hospedagem',
  BELEZA: 'beleza',
  VESTIDO_NOIVA: 'vestido_noiva',
  TERNO_NOIVO: 'terno_noivo',
  CONVITES: 'convites',
  DOCES: 'doces',
  BOLO: 'bolo',
  BEBIDAS: 'bebidas',
  SEGURANCA: 'seguranca',
  LIMPEZA: 'limpeza',
  OUTROS: 'outros',
} as const;

export const PAGE_STATUSES = {
  PUBLISHED: 'published',
  DRAFT: 'draft',
  ARCHIVED: 'archived',
  SCHEDULED: 'scheduled',
} as const;

export const SECTION_TYPES = {
  HERO: 'hero',
  ABOUT: 'about',
  SERVICES: 'services',
  GALLERY: 'gallery',
  TESTIMONIALS: 'testimonials',
  CONTACT: 'contact',
  CUSTOM: 'custom',
  CTA: 'cta',
  FEATURES: 'features',
  PRICING: 'pricing',
} as const;

export const TENANT_STATUSES = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
  TRIAL: 'trial',
} as const;

// Tipos de guards para verificação de tipos em runtime
export const isUserRole = (role: string): role is UserRole => {
  return Object.values(USER_ROLES).includes(role as UserRole);
};

export const isEventStatus = (status: string): status is EventStatus => {
  return Object.values(EVENT_STATUSES).includes(status as EventStatus);
};

export const isEventType = (type: string): type is EventType => {
  return Object.values(EVENT_TYPES).includes(type as EventType);
};

export const isSupplierCategory = (category: string): category is SupplierCategory => {
  return Object.values(SUPPLIER_CATEGORIES).includes(category as SupplierCategory);
};

export const isPageStatus = (status: string): status is PageStatus => {
  return Object.values(PAGE_STATUSES).includes(status as PageStatus);
};

export const isSectionType = (type: string): type is SectionType => {
  return Object.values(SECTION_TYPES).includes(type as SectionType);
};

export const isTenantStatus = (status: string): status is TenantStatus => {
  return Object.values(TENANT_STATUSES).includes(status as TenantStatus);
};

// Tipos de mapeamento para facilitar conversões
export type UserRoleMap = typeof USER_ROLES;
export type EventStatusMap = typeof EVENT_STATUSES;
export type EventTypeMap = typeof EVENT_TYPES;
export type SupplierCategoryMap = typeof SUPPLIER_CATEGORIES;
export type PageStatusMap = typeof PAGE_STATUSES;
export type SectionTypeMap = typeof SECTION_TYPES;
export type TenantStatusMap = typeof TENANT_STATUSES;

// Utilitários de tipo para formulários
export type FormData<T> = {
  [K in keyof T]: T[K] extends object ? FormData<T[K]> : string;
};

export type FormErrors<T> = {
  [K in keyof T]?: string;
};

export type FormTouched<T> = {
  [K in keyof T]?: boolean;
};

// Tipos para hooks customizados
export interface UseAsyncReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (...args: any[]) => Promise<T>;
  reset: () => void;
}

export interface UsePaginationReturn {
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  reset: () => void;
}

export interface UseSearchReturn<T> {
  results: T[];
  loading: boolean;
  error: string | null;
  query: string;
  setQuery: (query: string) => void;
  filters: Record<string, any>;
  setFilters: (filters: Record<string, any>) => void;
  pagination: UsePaginationReturn;
  search: () => Promise<void>;
  reset: () => void;
}

// Tipos para contextos React
export interface AppContextValue {
  user: UserProfile | null;
  tenant: Tenant | null;
  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => void;
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'created_at'>) => void;
  removeNotification: (id: string) => void;
}

export interface ThemeContextValue {
  theme: 'light' | 'dark' | 'auto';
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
  colors: ThemeConfig;
  setColors: (colors: Partial<ThemeConfig>) => void;
}

// Tipos para providers
export interface AuthProviderProps {
  children: React.ReactNode;
  initialUser?: UserProfile | null;
  initialTenant?: Tenant | null;
}

export interface QueryProviderProps {
  children: React.ReactNode;
  client?: any; // QueryClient do React Query
}

// Tipos para rotas
export interface RouteConfig {
  path: string;
  component: React.ComponentType;
  exact?: boolean;
  roles?: UserRole[];
  permissions?: string[];
  title?: string;
  description?: string;
}

export interface NavigationItem {
  id: string;
  label: string;
  path?: string;
  icon?: string;
  children?: NavigationItem[];
  roles?: UserRole[];
  permissions?: string[];
  badge?: string | number;
  external?: boolean;
}

// Tipos para configuração de tabelas
export interface TableColumn<T = any> {
  key: keyof T | string;
  title: string;
  width?: number | string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  className?: string;
}

export interface TableProps<T = any> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  pagination?: boolean;
  pageSize?: number;
  sortable?: boolean;
  filterable?: boolean;
  selectable?: boolean;
  onRowClick?: (record: T, index: number) => void;
  onSelectionChange?: (selectedRows: T[]) => void;
  className?: string;
}

// Tipos para modais e dialogs
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closable?: boolean;
  maskClosable?: boolean;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'info' | 'warning' | 'error' | 'success';
}

// Tipos para formulários complexos
export interface FormFieldConfig {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'file' | 'date' | 'time' | 'datetime';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  options?: Array<{ label: string; value: any }>;
  validation?: any; // Zod schema
  description?: string;
  className?: string;
}

export interface FormConfig {
  fields: FormFieldConfig[];
  layout?: 'vertical' | 'horizontal' | 'inline';
  submitText?: string;
  resetText?: string;
  onSubmit: (data: any) => void | Promise<void>;
  onReset?: () => void;
  initialValues?: Record<string, any>;
  className?: string;
}

