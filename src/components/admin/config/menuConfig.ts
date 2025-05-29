import { 
  BarChart3, 
  MessageSquare, 
  Users, 
  FileText, 
  Image, 
  Star,
  File,
  Mail,
  FileImage,
  UserCheck,
  Heart,
  Sparkles,
  TrendingUp
} from 'lucide-react';

export interface MenuItem {
  id: string;
  label: string;
  icon: any;
  description?: string;
}

export const dashboardMenuItems: MenuItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: BarChart3,
    description: "Visão geral e estatísticas"
  }
];

export const businessMenuItems: MenuItem[] = [
  {
    id: "quotes",
    label: "Solicitações",
    icon: MessageSquare,
    description: "Solicitações de orçamento"
  },
  {
    id: "proposals",
    label: "Propostas",
    icon: FileText,
    description: "Geração e envio de propostas"
  },
  {
    id: "contracts",
    label: "Contratos",
    icon: File,
    description: "Contratos e assinaturas"
  },
  {
    id: "gestao-comercial",
    label: "Gestão Comercial",
    icon: TrendingUp,
    description: "Funil de vendas e painel financeiro"
  }
];

export const contentMenuItems: MenuItem[] = [
  {
    id: "gallery",
    label: "Galeria",
    icon: Image,
    description: "Gerenciar fotos da galeria"
  },
  {
    id: "testimonials",
    label: "Depoimentos",
    icon: Star,
    description: "Gerenciar depoimentos"
  },
  {
    id: "questionarios",
    label: "Questionários",
    icon: Heart,
    description: "Questionários de noivos"
  },
  {
    id: "historias-casais",
    label: "Histórias IA",
    icon: Sparkles,
    description: "Histórias dos casais geradas por IA"
  }
];

export const managementMenuItems: MenuItem[] = [
  {
    id: "leads",
    label: "Leads",
    icon: Users,
    description: "Gerenciar leads e clientes"
  },
  {
    id: "professionals",
    label: "Profissionais",
    icon: UserCheck,
    description: "Rede de profissionais"
  }
];

export const templatesMenuItems: MenuItem[] = [
  {
    id: "proposal-templates",
    label: "Templates Propostas",
    icon: FileImage,
    description: "Templates para propostas"
  },
  {
    id: "contract-templates",
    label: "Templates Contratos",
    icon: File,
    description: "Templates para contratos"
  },
  {
    id: "contract-email-templates",
    label: "Templates Email",
    icon: Mail,
    description: "Templates de email"
  }
];

export const menuSections = [
  { title: "Dashboard", items: dashboardMenuItems },
  { title: "Negócio", items: businessMenuItems },
  { title: "Conteúdo", items: contentMenuItems },
  { title: "Gestão", items: managementMenuItems },
  { title: "Templates", items: templatesMenuItems }
];

export const getAllMenuItems = (): MenuItem[] => {
  return [
    ...dashboardMenuItems,
    ...businessMenuItems,
    ...contentMenuItems,
    ...managementMenuItems,
    ...templatesMenuItems
  ];
};
