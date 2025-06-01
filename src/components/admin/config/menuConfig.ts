import { LayoutDashboard, ListChecks, FileText, Users, Calendar, Settings } from 'lucide-react';

interface MenuItem {
  id: string;
  label: string;
  icon: keyof typeof Icons;
  component?: string;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

interface MenuConfig {
  [key: string]: MenuSection;
}

const Icons = {
  LayoutDashboard,
  ListChecks,
  FileText,
  Users,
  Calendar,
  Settings
};

export const menuConfig: MenuConfig = {
  dashboard: {
    title: 'Dashboard',
    items: [
      {
        id: 'summary',
        label: 'Resumo',
        icon: 'LayoutDashboard',
        component: 'DashboardSummary'
      }
    ]
  },
  
  gestao: {
    title: 'Gestão',
    items: [
      {
        id: 'leads',
        label: 'Leads',
        icon: 'Users',
        component: 'LeadsTab'
      },
      {
        id: 'proposals',
        label: 'Propostas',
        icon: 'FileText',
        component: 'ProposalsMain'
      },
      {
        id: 'contracts',
        label: 'Contratos',
        icon: 'ListChecks',
        component: 'ContractsMain'
      },
      {
        id: 'clientes',
        label: 'Clientes',
        icon: 'Users',
        component: 'ClientesTab'
      },
      {
        id: 'eventos',
        label: 'Eventos',
        icon: 'Calendar',
        component: 'EventsTab'
      },
      {
        id: 'questionarios',
        label: 'Questionários',
        icon: 'FileText',
        component: 'QuestionariosTab'
      },
      {
        id: 'professionals',
        label: 'Profissionais',
        icon: 'Users',
        component: 'ProfessionalsTab'
      }
    ]
  },
  
  configuracoes: {
    title: 'Configurações',
    items: [
      {
        id: 'settings',
        label: 'Geral',
        icon: 'Settings',
        component: 'SettingsTab'
      }
    ]
  }
};
