
import { 
  BarChart3, 
  FileText, 
  Calendar, 
  Users, 
  MessageSquare, 
  Heart, 
  Star, 
  Image, 
  Settings,
  FileImage,
  Mail,
  TrendingUp,
  Globe,
  UserCog
} from "lucide-react";

export interface MenuItem {
  id: string;
  label: string;
  icon: any;
}

export interface MenuSection {
  title: string;
  items: MenuItem[];
}

export const menuSections: MenuSection[] = [
  {
    title: "Dashboard",
    items: [
      { id: "dashboard", label: "Visão Geral", icon: BarChart3 },
      { id: "gestao-comercial", label: "Gestão Comercial", icon: TrendingUp },
    ]
  },
  {
    title: "Gestão de Clientes",
    items: [
      { id: "quotes", label: "Orçamentos", icon: MessageSquare },
      { id: "proposals", label: "Propostas", icon: FileText },
      { id: "contracts", label: "Contratos", icon: FileImage },
      { id: "leads", label: "Leads", icon: Users },
      { id: "events", label: "Eventos", icon: Calendar },
    ]
  },
  {
    title: "Conteúdo & Marketing",
    items: [
      { id: "questionarios", label: "Questionários", icon: Heart },
      { id: "historias-casais", label: "Histórias dos Casais", icon: Heart },
      { id: "testimonials", label: "Depoimentos", icon: Star },
      { id: "gallery", label: "Galeria", icon: Image },
      { id: "landing-pages", label: "Landing Pages", icon: Globe },
    ]
  },
  {
    title: "Profissionais",
    items: [
      { id: "professionals", label: "Profissionais", icon: Users },
    ]
  },
  {
    title: "Configurações",
    items: [
      { id: "users", label: "Gerenciar Usuários", icon: UserCog },
      { id: "proposal-templates", label: "Templates de Proposta", icon: FileText },
      { id: "contract-templates", label: "Templates de Contrato", icon: FileImage },
      { id: "contract-email-templates", label: "Templates de Email", icon: Mail },
    ]
  }
];
