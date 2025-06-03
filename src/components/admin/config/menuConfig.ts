
import { 
  Home, 
  FileText, 
  Users, 
  Calendar, 
  MessageSquare, 
  BarChart3, 
  Settings,
  Globe,
  UserPlus,
  TrendingUp,
  ClipboardList,
  CreditCard,
  Camera,
  Award
} from 'lucide-react';

export interface MenuItem {
  id: string;
  label: string;
  icon: any;
  component?: string;
}

export const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: Home,
    component: 'DashboardTab'
  },
  {
    id: 'proposals',
    label: 'Propostas',
    icon: FileText,
    component: 'ProposalsTab'
  },
  {
    id: 'contracts',
    label: 'Contratos',
    icon: ClipboardList,
    component: 'ContractsTab'
  },
  {
    id: 'clients',
    label: 'Clientes',
    icon: Users,
    component: 'ClientsTab'
  },
  {
    id: 'leads',
    label: 'Leads',
    icon: UserPlus,
    component: 'LeadsTab'
  },
  {
    id: 'events',
    label: 'Eventos',
    icon: Calendar,
    component: 'EventsTab'
  },
  {
    id: 'professionals',
    label: 'Fornecedores',
    icon: Award,
    component: 'ProfessionalsTab'
  },
  {
    id: 'gallery',
    label: 'Galeria',
    icon: Camera,
    component: 'GalleryTab'
  },
  {
    id: 'testimonials',
    label: 'Depoimentos',
    icon: MessageSquare,
    component: 'TestimonialsTab'
  },
  {
    id: 'gestao-comercial',
    label: 'Gestão Comercial',
    icon: TrendingUp,
    component: 'GestaoComercialTab'
  },
  {
    id: 'website',
    label: 'CMS Website',
    icon: Globe,
    component: 'WebsiteTab'
  },
  {
    id: 'financeiro',
    label: 'Financeiro',
    icon: CreditCard,
    component: 'FinanceiroTab'
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
    component: 'AnalyticsTab'
  },
  {
    id: 'settings',
    label: 'Configurações',
    icon: Settings,
    component: 'SettingsTab'
  }
];
