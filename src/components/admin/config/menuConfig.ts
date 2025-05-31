
import { 
  BarChart3, 
  FileText, 
  Users, 
  Calendar,
  MessageSquare, 
  ImageIcon, 
  Heart, 
  Settings, 
  UserCheck, 
  BookOpen,
  CalendarDays,
  Mail,
  FileImage,
  TrendingUp,
  Briefcase
} from 'lucide-react';

export interface MenuItem {
  id: string;
  label: string;
  icon: any;
  description?: string;
}

export interface MenuSection {
  title: string;
  items: MenuItem[];
}

export const adminMenuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: BarChart3,
    description: 'Visão geral e métricas'
  },
  {
    id: 'quotes',
    label: 'Orçamentos',
    icon: FileText,
    description: 'Solicitações de orçamento'
  },
  {
    id: 'proposals',
    label: 'Propostas',
    icon: BookOpen,
    description: 'Propostas comerciais'
  },
  {
    id: 'events',
    label: 'Eventos',
    icon: Calendar,
    description: 'Gestão de eventos'
  },
  {
    id: 'contracts',
    label: 'Contratos',
    icon: FileImage,
    description: 'Contratos e assinaturas'
  },
  {
    id: 'questionarios',
    label: 'Questionários',
    icon: Heart,
    description: 'Questionários dos noivos'
  },
  {
    id: 'historias-casais',
    label: 'Histórias dos Casais',
    icon: MessageSquare,
    description: 'Histórias geradas pela IA'
  },
  {
    id: 'leads',
    label: 'Leads',
    icon: Users,
    description: 'Gestão de leads'
  },
  {
    id: 'professionals',
    label: 'Profissionais',
    icon: UserCheck,
    description: 'Rede de profissionais'
  },
  {
    id: 'gallery',
    label: 'Galeria',
    icon: ImageIcon,
    description: 'Fotos e imagens'
  },
  {
    id: 'testimonials',
    label: 'Depoimentos',
    icon: MessageSquare,
    description: 'Depoimentos de clientes'
  },
  {
    id: 'gestao-comercial',
    label: 'Gestão Comercial',
    icon: TrendingUp,
    description: 'Funil de vendas e financeiro'
  },
  {
    id: 'proposal-templates',
    label: 'Templates de Proposta',
    icon: Settings,
    description: 'Templates para propostas'
  },
  {
    id: 'contract-templates',
    label: 'Templates de Contrato',
    icon: Settings,
    description: 'Templates para contratos'
  },
  {
    id: 'contract-email-templates',
    label: 'Templates de Email',
    icon: Mail,
    description: 'Templates para emails de contrato'
  }
];

export const menuSections: MenuSection[] = [
  {
    title: 'Principal',
    items: [
      adminMenuItems.find(item => item.id === 'dashboard')!,
      adminMenuItems.find(item => item.id === 'quotes')!,
      adminMenuItems.find(item => item.id === 'proposals')!,
      adminMenuItems.find(item => item.id === 'events')!,
      adminMenuItems.find(item => item.id === 'contracts')!,
    ]
  },
  {
    title: 'Clientes',
    items: [
      adminMenuItems.find(item => item.id === 'questionarios')!,
      adminMenuItems.find(item => item.id === 'historias-casais')!,
      adminMenuItems.find(item => item.id === 'leads')!,
      adminMenuItems.find(item => item.id === 'professionals')!,
    ]
  },
  {
    title: 'Conteúdo',
    items: [
      adminMenuItems.find(item => item.id === 'gallery')!,
      adminMenuItems.find(item => item.id === 'testimonials')!,
    ]
  },
  {
    title: 'Gestão',
    items: [
      adminMenuItems.find(item => item.id === 'gestao-comercial')!,
    ]
  },
  {
    title: 'Configurações',
    items: [
      adminMenuItems.find(item => item.id === 'proposal-templates')!,
      adminMenuItems.find(item => item.id === 'contract-templates')!,
      adminMenuItems.find(item => item.id === 'contract-email-templates')!,
    ]
  }
];

export const getAllMenuItems = (): MenuItem[] => {
  return adminMenuItems;
};
