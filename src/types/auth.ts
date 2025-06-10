
export type UserRole = 'admin' | 'admin_master' | 'cliente' | 'cerimonialista';

export interface UserProfile {
  id: string;
  tenant_id: string;
  email: string;
  role: UserRole;
  status: 'active' | 'inactive' | 'pending';
  first_name: string;
  last_name: string;
  full_name: string;
  avatar_url?: string;
  phone?: string;
  profile_data: any;
  permissions: string[];
  last_login_at?: string;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  status: 'active' | 'inactive' | 'suspended';
  subscription_plan: 'free' | 'basic' | 'premium' | 'enterprise';
  subscription_status: 'active' | 'inactive' | 'past_due' | 'canceled';
  settings: {
    brand: {
      name: string;
      primary_color: string;
      secondary_color: string;
    };
    contact: {
      email: string;
      phone: string;
      address: string;
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
  };
  billing_info: {
    company_name: string;
    tax_id: string;
    billing_email: string;
    billing_address: string;
  };
  created_at: string;
  updated_at: string;
}

export interface SignUpData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: UserRole;
}

export interface AuthContext {
  user: UserProfile | null;
  tenant: Tenant | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: SignUpData) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  switchTenant: (tenantId: string) => Promise<void>;
  hasPermission: (resource: string, action: string) => boolean;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
  canAccess: (resource: string) => boolean;
}
