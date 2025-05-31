import {
  LayoutDashboard,
  ListChecks,
  FileText,
  FilePlus,
  Users,
  Calendar,
  QuestionMarkCircle,
  BookOpen,
  MessageSquare,
  ImageIcon,
  File,
  Mail,
  TrendingUp,
  Globe,
} from 'lucide-react';

export const ADMIN_MENU_ITEMS = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    description: 'Visão geral do sistema',
    component: 'DashboardTab'
  },
  {
    id: 'quotes',
    label: 'Orçamentos',
    icon: ListChecks,
    description: 'Gerenciar orçamentos',
    component: 'QuotesTab'
  },
  {
    id: 'proposals',
    label: 'Propostas',
    icon: FileText,
    description: 'Gerenciar propostas',
    component: 'ProposalsTab'
  },
  {
    id: 'contracts',
    label: 'Contratos',
    icon: FilePlus,
    description: 'Gerenciar contratos',
    component: 'ContractsTab'
  },
  {
    id: 'leads',
    label: 'Leads',
    icon: Users,
    description: 'Gerenciar leads',
    component: 'LeadsTab'
  },
  {
    id: 'professionals',
    label: 'Profissionais',
    icon: Users,
    description: 'Gerenciar profissionais',
    component: 'ProfessionalsTab'
  },
  {
    id: 'events',
    label: 'Eventos',
    icon: Calendar,
    description: 'Gerenciar eventos',
    component: 'EventsTab'
  },
  {
    id: 'questionarios',
    label: 'Questionários',
    icon: QuestionMarkCircle,
    description: 'Gerenciar questionários',
    component: 'QuestionariosTab'
  },
  {
    id: 'historias-casais',
    label: 'Histórias dos Casais',
    icon: BookOpen,
    description: 'Gerenciar histórias dos casais',
    component: 'HistoriasCasaisTab'
  },
  {
    id: 'testimonials',
    label: 'Depoimentos',
    icon: MessageSquare,
    description: 'Gerenciar depoimentos',
    component: 'TestimonialsTab'
  },
  {
    id: 'gallery',
    label: 'Galeria',
    icon: ImageIcon,
    description: 'Gerenciar galeria',
    component: 'AdminGalleryTab'
  },
  {
    id: 'proposal-templates',
    label: 'Templates de Proposta',
    icon: File,
    description: 'Gerenciar templates de proposta',
    component: 'ProposalTemplatesTab'
  },
  {
    id: 'contract-templates',
    label: 'Templates de Contrato',
    icon: File,
    description: 'Gerenciar templates de contrato',
    component: 'ContractTemplatesTab'
  },
  {
    id: 'contract-email-templates',
    label: 'Templates de Email de Contrato',
    icon: Mail,
    description: 'Gerenciar templates de email de contrato',
    component: 'ContractEmailTemplatesTab'
  },
  {
    id: 'gestao-comercial',
    label: 'Gestão Comercial',
    icon: TrendingUp,
    description: 'Gerenciar dados comerciais',
    component: 'GestaoComercialTab'
  },
  {
    id: 'landing-pages',
    label: 'Landing Pages',
    icon: Globe,
    description: 'Gerencie landing pages dinâmicas',
    component: 'LandingPagesTab'
  },
] as const;

export type AdminMenuItemId = typeof ADMIN_MENU_ITEMS[number]['id'];
