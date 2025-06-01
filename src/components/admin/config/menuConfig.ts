
import { LayoutDashboard, ListChecks, FileText, Users, Calendar, Settings } from 'lucide-react';

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
        icon: Users,
        component: 'LeadsTab'
      },
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
        id: 'clientes',
        label: 'Clientes',
        icon: Users,
        component: 'ClientesTab'
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
      },
      {
        id: 'professionals',
        label: 'Profissionais',
        icon: Users,
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
        icon: Settings,
        component: 'SettingsTab'
      }
    ]
  }
};

export const menuSections = Object.values(menuConfig);
