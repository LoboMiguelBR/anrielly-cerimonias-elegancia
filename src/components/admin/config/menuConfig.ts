
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
    id: 'services',
    label: 'Serviços',
    icon: Settings,
    component: 'ServicesTab'
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

// Função para obter todos os itens do menu
export const getAllMenuItems = (): MenuItem[] => {
  return menuItems;
};

// Interface para seção do menu
export interface MenuSection {
  title: string;
  items: MenuItem[];
}

// Função para organizar itens em seções
export const getMenuSections = (): MenuSection[] => {
  return [
    {
      title: 'Principal',
      items: [
        menuItems.find(item => item.id === 'dashboard')!
      ]
    },
    {
      title: 'CRM & Vendas',
      items: [
        menuItems.find(item => item.id === 'leads')!,
        menuItems.find(item => item.id === 'clients')!,
        menuItems.find(item => item.id === 'gestao-comercial')!,
        menuItems.find(item => item.id === 'proposals')!,
        menuItems.find(item => item.id === 'contracts')!
      ]
    },
    {
      title: 'Operacional',
      items: [
        menuItems.find(item => item.id === 'events')!,
        menuItems.find(item => item.id === 'professionals')!
      ]
    },
    {
      title: 'Conteúdo',
      items: [
        menuItems.find(item => item.id === 'services')!,
        menuItems.find(item => item.id === 'website')!,
        menuItems.find(item => item.id === 'gallery')!,
        menuItems.find(item => item.id === 'testimonials')!
      ]
    },
    {
      title: 'Sistema',
      items: [
        menuItems.find(item => item.id === 'financeiro')!,
        menuItems.find(item => item.id === 'analytics')!,
        menuItems.find(item => item.id === 'settings')!
      ]
    }
  ];
};
