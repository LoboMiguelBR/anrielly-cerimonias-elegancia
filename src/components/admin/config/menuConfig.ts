
import { 
  BarChart3, 
  Users, 
  UserPlus, 
  Calculator, 
  FileText, 
  ClipboardList,
  ScrollText,
  Mail,
  ImageIcon,
  MessageSquare,
  HelpCircle
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
    title: "📊 DASHBOARD",
    items: [
      { id: "dashboard", label: "Dashboard Principal", icon: BarChart3 }
    ]
  },
  {
    title: "👥 LEADS & CLIENTES",
    items: [
      { id: "leads", label: "Leads", icon: Users },
      { id: "professionals", label: "Profissionais", icon: UserPlus }
    ]
  },
  {
    title: "💰 VENDAS",
    items: [
      { id: "quotes", label: "Orçamentos", icon: Calculator },
      { id: "proposals", label: "Propostas", icon: FileText },
      { id: "proposal-templates", label: "Templates de Propostas", icon: FileText }
    ]
  },
  {
    title: "📝 CONTRATOS",
    items: [
      { id: "contracts", label: "Contratos", icon: ScrollText },
      { id: "contract-templates", label: "Templates de Contratos", icon: ClipboardList },
      { id: "contract-email-templates", label: "Templates de Email", icon: Mail }
    ]
  },
  {
    title: "🎨 CONTEÚDO",
    items: [
      { id: "gallery", label: "Galeria", icon: ImageIcon },
      { id: "testimonials", label: "Depoimentos", icon: MessageSquare },
      { id: "questionarios", label: "Questionários", icon: HelpCircle }
    ]
  }
];

export const getAllMenuItems = (): MenuItem[] => {
  return menuSections.flatMap(section => section.items);
};
