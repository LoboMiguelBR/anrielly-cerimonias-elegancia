import {
  BarChart3,
  Calendar,
  Canvas,
  FileText,
  Settings,
  ShoppingBag,
  TrendingUp,
  Users,
} from "lucide-react";

export type MenuItem = {
  id: string;
  label: string;
  icon: any;
  href?: string;
  group: string;
};

export const primaryMenuItems: MenuItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: BarChart3,
    href: "/admin",
    group: "main"
  },
  {
    id: "gestao-comercial",
    label: "Gestão Comercial",
    icon: TrendingUp,
    group: "main"
  },
  {
    id: "calendario-eventos",
    label: "Calendário & Timeline", 
    icon: Calendar,
    group: "main"
  },
  {
    id: "events",
    label: "Gestão de Eventos",
    icon: Calendar,
    group: "main"
  },
  {
    id: "proposals",
    label: "Propostas",
    icon: FileText,
    group: "main"
  },
  {
    id: "contracts",
    label: "Contratos",
    icon: FileText,
    group: "main"
  },
  {
    id: "questionarios",
    label: "Questionários",
    icon: FileText,
    group: "main"
  },
  {
    id: "clientes",
    label: "Clientes",
    icon: Users,
    group: "main"
  },
  {
    id: "fornecedores",
    label: "Fornecedores",
    icon: ShoppingBag,
    group: "main"
  },
  {
    id: "website",
    label: "Website",
    icon: Canvas,
    group: "main"
  }
];

export const secondaryMenuItems: MenuItem[] = [
  {
    id: "settings",
    label: "Configurações",
    icon: Settings,
    href: "/admin/settings",
    group: "settings"
  }
];

export const getAllMenuItems = (): MenuItem[] => {
  return [...primaryMenuItems, ...secondaryMenuItems];
};
