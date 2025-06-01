import { 
  LayoutDashboard, 
  ListChecks, 
  FileText, 
  Users, 
  Calendar, 
  Settings,
  DollarSign,
  Quote,
  TrendingUp,
  Image,
  MessageSquare,
  Heart,
  Mail,
  Briefcase
} from 'lucide-react';

export interface MenuItem {
  id: string;
  label: string;
  icon: any;
  component?: string;
}

export interface MenuSection {
  title: string;
  items: MenuItem[];
}

interface MenuConfig {
  [key: string]: MenuSection;
}

export const menuConfig: MenuConfig = {
  dashboard: {
    title: 'Dashboard',
    items: [
      {
        id: 'dashboard',
        label: 'Resumo',
        icon: LayoutDashboard,
        component: 'DashboardManager'
      }
    ]
  },
  
  comercial: {
    title: 'Gestão Comercial',
    items: [
      {
        id: 'leads',
        label: 'Leads',
        icon: Users,
        component: 'LeadsTab'
      },
      {
        id: 'quotes',
        label: 'Orçamentos',
        icon: Quote,
        component: 'QuotesTab'
      },
      {
        id: 'gestao-comercial',
        label: 'Funil de Vendas',
        icon: TrendingUp,
        component: 'GestaoComercialTab'
      }
    ]
  },
  
  gestao: {
    title: 'Gestão de Projetos',
    items: [
      {
        id: 'propostas',
        label: 'Propostas',
        icon: FileText,
        component: 'ProposalsMain'
      },
      {
        id: 'contratos',
        label: 'Contratos',
        icon: ListChecks,
        component: 'ContractsMain'
      },
      {
        id: 'eventos',
        label: 'Eventos',
        icon: Calendar,
        component: 'EventsTab'
      },
      {
        id: 'questionarios',
        label: 'Questionários',
        icon: FileText,
        component: 'QuestionariosTab'
      }
    ]
  },

  pessoas: {
    title: 'Gestão de Pessoas',
    items: [
      {
        id: 'clientes',
        label: 'Clientes',
        icon: Users,
        component: 'ClientesTab'
      },
      {
        id: 'professionals',
        label: 'Profissionais',
        icon: Briefcase,
        component: 'ProfessionalsTab'
      }
    ]
  },

  conteudo: {
    title: 'Gestão de Conteúdo',
    items: [
      {
        id: 'gallery',
        label: 'Galeria',
        icon: Image,
        component: 'AdminGalleryTab'
      },
      {
        id: 'testimonials',
        label: 'Depoimentos',
        icon: MessageSquare,
        component: 'TestimonialsTab'
      },
      {
        id: 'historias-casais',
        label: 'Histórias dos Casais',
        icon: Heart,
        component: 'HistoriasCasaisTab'
      }
    ]
  },

  templates: {
    title: 'Templates',
    items: [
      {
        id: 'proposal-templates',
        label: 'Templates de Proposta',
        icon: FileText,
        component: 'ProposalTemplatesTab'
      },
      {
        id: 'contract-templates',
        label: 'Templates de Contrato',
        icon: FileText,
        component: 'ContractTemplatesTab'
      },
      {
        id: 'contract-email-templates',
        label: 'Templates de Email',
        icon: Mail,
        component: 'ContractEmailTemplatesTab'
      }
    ]
  },
  
  configuracoes: {
    title: 'Configurações',
    items: [
      {
        id: 'settings',
        label: 'Geral',
        icon: Settings,
        component: 'SettingsTab'
      }
    ]
  }
};

export const menuSections = Object.values(menuConfig);

// Função para obter todos os itens de menu de todas as seções
export const getAllMenuItems = (): MenuItem[] => {
  return menuSections.reduce((allItems: MenuItem[], section) => {
    return [...allItems, ...section.items];
  }, []);
};
