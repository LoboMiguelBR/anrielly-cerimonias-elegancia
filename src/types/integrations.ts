
export interface Integration {
  id: string;
  name: string;
  category: string;
  description?: string;
  status: 'active' | 'inactive' | 'pending' | 'error';
  enabled: boolean;
  logo_url?: string;
  documentation_url?: string;
  features: string[];
  config: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface IntegrationTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  config_schema: Record<string, any>;
}

export interface NotificationData {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  action_url?: string;
  metadata: Record<string, any>;
  created_at: string;
}
