
// Tipos de autenticação e usuários aprimorados
export type UserRole = 
  | 'admin_master'      // Gestão dos tenants, financeira
  | 'admin'             // Mestre cerimônia/cerimonialista
  | 'cliente'           // Fornecedores
  | 'usuario'           // Noivos, noivas, contratantes, leads
  | 'guest';            // Visitantes

export type TenantStatus = 'active' | 'inactive' | 'suspended' | 'trial';

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  domain?: string;
  status: TenantStatus;
  subscription_plan: 'basic' | 'premium' | 'enterprise';
  subscription_status: 'active' | 'canceled' | 'past_due' | 'trialing';
  trial_ends_at?: string;
  settings: TenantSettings;
  billing_info: BillingInfo;
  created_at: string;
  updated_at: string;
}

export interface TenantSettings {
  brand: {
    name: string;
    logo_url?: string;
    primary_color: string;
    secondary_color: string;
    font_family?: string;
  };
  contact: {
    email: string;
    phone: string;
    address: string;
    website?: string;
  };
  features: {
    cms_enabled: boolean;
    events_enabled: boolean;
    suppliers_enabled: boolean;
    analytics_enabled: boolean;
    ai_enabled: boolean;
    questionnaires_enabled: boolean;
  };
  limits: {
    max_events: number;
    max_users: number;
    max_storage_gb: number;
  };
}

export interface BillingInfo {
  company_name: string;
  tax_id: string;
  billing_email: string;
  billing_address: string;
  payment_method?: 'credit_card' | 'bank_transfer' | 'pix';
}

export interface UserProfile {
  id: string;
  tenant_id: string;
  email: string;
  role: UserRole;
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  
  // Informações pessoais
  first_name: string;
  last_name: string;
  full_name: string;
  avatar_url?: string;
  phone?: string;
  
  // Informações específicas por role
  profile_data: AdminProfile | ClienteProfile | UsuarioProfile | null;
  
  // Permissões específicas
  permissions: Permission[];
  
  // Metadados
  last_login_at?: string;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
}

export interface AdminProfile {
  type: 'cerimonialista' | 'admin_master';
  specialties: string[];
  experience_years: number;
  certifications: string[];
  bio?: string;
  portfolio_url?: string;
}

export interface ClienteProfile {
  type: 'fornecedor';
  company_name: string;
  business_type: SupplierCategory;
  tax_id: string;
  services: string[];
  service_areas: string[];
  rating: number;
  verified: boolean;
  portfolio: PortfolioItem[];
}

export interface UsuarioProfile {
  type: 'noivo' | 'noiva' | 'contratante' | 'lead';
  partner_name?: string;
  event_date?: string;
  event_type?: string;
  budget_range?: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: 'pt-BR' | 'en-US';
  notifications: NotificationSettings;
  privacy: PrivacySettings;
}

export interface NotificationSettings {
  email_notifications: boolean;
  sms_notifications: boolean;
  push_notifications: boolean;
  marketing_emails: boolean;
  event_reminders: boolean;
  payment_reminders: boolean;
}

export interface PrivacySettings {
  profile_visibility: 'public' | 'private' | 'contacts_only';
  show_email: boolean;
  show_phone: boolean;
  allow_contact: boolean;
}

export interface Permission {
  id: string;
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'manage';
  conditions?: Record<string, any>;
}

// Tipos para fornecedores
export type SupplierCategory = 
  | 'fotografia'
  | 'filmagem'
  | 'decoracao'
  | 'floricultura'
  | 'buffet'
  | 'musica'
  | 'som_iluminacao'
  | 'transporte'
  | 'hospedagem'
  | 'beleza'
  | 'vestido_noiva'
  | 'terno_noivo'
  | 'convites'
  | 'doces'
  | 'bolo'
  | 'bebidas'
  | 'seguranca'
  | 'limpeza'
  | 'outros';

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  images: string[];
  event_type: string;
  date: string;
  featured: boolean;
}

// Contexto de autenticação
export interface AuthContext {
  user: UserProfile | null;
  tenant: Tenant | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  // Métodos de autenticação
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: SignUpData) => Promise<void>;
  signOut: () => Promise<void>;
  
  // Métodos de perfil
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  switchTenant: (tenantId: string) => Promise<void>;
  
  // Verificações de permissão
  hasPermission: (resource: string, action: string) => boolean;
  hasRole: (role: UserRole | UserRole[]) => boolean;
  canAccess: (resource: string) => boolean;
}

export interface SignUpData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  tenant_id?: string;
  profile_data?: any;
}

// Tipos para sessão e tokens
export interface Session {
  user: UserProfile;
  tenant: Tenant;
  access_token: string;
  refresh_token: string;
  expires_at: string;
}

export interface MagicLinkToken {
  id: string;
  user_id: string;
  token: string;
  type: 'email_verification' | 'password_reset' | 'event_invitation';
  expires_at: string;
  used_at?: string;
  metadata?: Record<string, any>;
}
