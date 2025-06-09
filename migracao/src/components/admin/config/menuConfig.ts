
import {
  BarChart3,
  Users,
  FileText,
  FileCheck,
  FileSignature,
  Calendar,
  UserCheck,
  Briefcase,
  Image,
  MessageSquare,
  DollarSign,
  TrendingUp,
  ClipboardList,
  Heart,
  Layout,
  FileType,
  Mail,
  Globe,
  Settings,
  Home
} from 'lucide-react';

export interface MenuItem {
  id: string;
  label: string;
  icon: any;
}

export interface MenuSection {
  title: string;
  items: MenuItem[];
}

export const menuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'leads', label: 'Leads', icon: Users },
  { id: 'quotes', label: 'Orçamentos', icon: FileText },
  { id: 'proposals', label: 'Propostas', icon: FileCheck },
  { id: 'contracts', label: 'Contratos', icon: FileSignature },
  { id: 'events', label: 'Eventos', icon: Calendar },
  { id: 'clients', label: 'Clientes', icon: UserCheck },
  { id: 'professionals', label: 'Profissionais', icon: Users },
  { id: 'services', label: 'Serviços', icon: Briefcase },
  { id: 'cms-home', label: 'CMS Home', icon: Home },
  { id: 'gallery', label: 'Galeria', icon: Image },
  { id: 'testimonials', label: 'Depoimentos', icon: MessageSquare },
  { id: 'vendas-financeiro', label: 'Vendas & Financeiro', icon: DollarSign },
  { id: 'gestao-comercial', label: 'Gestão Comercial', icon: TrendingUp },
  { id: 'questionarios', label: 'Questionários', icon: ClipboardList },
  { id: 'historias-casais', label: 'Histórias de Casais', icon: Heart },
  { id: 'proposal-templates', label: 'Templates Propostas', icon: Layout },
  { id: 'contract-templates', label: 'Templates Contratos', icon: FileType },
  { id: 'contract-email-templates', label: 'Templates Email Contratos', icon: Mail },
  { id: 'website', label: 'Website', icon: Globe },
  { id: 'settings', label: 'Configurações', icon: Settings }
];

export const getMenuSections = (): MenuSection[] => {
  return [
    {
      title: 'Dashboard',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: BarChart3 }
      ]
    },
    {
      title: 'Gestão Comercial',
      items: [
        { id: 'leads', label: 'Leads', icon: Users },
        { id: 'quotes', label: 'Orçamentos', icon: FileText },
        { id: 'proposals', label: 'Propostas', icon: FileCheck },
        { id: 'contracts', label: 'Contratos', icon: FileSignature },
        { id: 'gestao-comercial', label: 'Gestão Comercial', icon: TrendingUp },
        { id: 'vendas-financeiro', label: 'Vendas & Financeiro', icon: DollarSign }
      ]
    },
    {
      title: 'Eventos & Clientes',
      items: [
        { id: 'events', label: 'Eventos', icon: Calendar },
        { id: 'clients', label: 'Clientes', icon: UserCheck },
        { id: 'professionals', label: 'Profissionais', icon: Users }
      ]
    },
    {
      title: 'Conteúdo & Marketing',
      items: [
        { id: 'cms-home', label: 'CMS Home', icon: Home },
        { id: 'gallery', label: 'Galeria', icon: Image },
        { id: 'testimonials', label: 'Depoimentos', icon: MessageSquare },
        { id: 'historias-casais', label: 'Histórias de Casais', icon: Heart },
        { id: 'website', label: 'Website', icon: Globe }
      ]
    },
    {
      title: 'Templates & Formulários',
      items: [
        { id: 'questionarios', label: 'Questionários', icon: ClipboardList },
        { id: 'proposal-templates', label: 'Templates Propostas', icon: Layout },
        { id: 'contract-templates', label: 'Templates Contratos', icon: FileType },
        { id: 'contract-email-templates', label: 'Templates Email Contratos', icon: Mail }
      ]
    },
    {
      title: 'Sistema',
      items: [
        { id: 'services', label: 'Serviços', icon: Briefcase },
        { id: 'settings', label: 'Configurações', icon: Settings }
      ]
    }
  ];
};

export const getAllMenuItems = (): MenuItem[] => {
  return menuItems;
};
