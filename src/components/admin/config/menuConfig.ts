
import {
  BarChart3,
  Calendar,
  Palette,
  FileText,
  Settings,
  ShoppingBag,
  TrendingUp,
  Users,
  AlertTriangle,
} from "lucide-react";

export type MenuItem = {
  id: string;
  label: string;
  icon: any;
  href?: string;
  group: string;
};

// Função para validar se o ícone existe
const validateIcon = (icon: any, itemId: string) => {
  try {
    if (!icon || typeof icon !== 'function') {
      console.warn(`menuConfig: Ícone inválido para item ${itemId}, usando fallback`);
      return AlertTriangle;
    }
    return icon;
  } catch (error) {
    console.error(`menuConfig: Erro ao validar ícone para ${itemId}:`, error);
    return AlertTriangle;
  }
};

export const primaryMenuItems: MenuItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: validateIcon(BarChart3, "dashboard"),
    href: "/admin",
    group: "main"
  },
  {
    id: "gestao-comercial",
    label: "Gestão Comercial",
    icon: validateIcon(TrendingUp, "gestao-comercial"),
    group: "main"
  },
  {
    id: "calendario-eventos",
    label: "Calendário & Timeline", 
    icon: validateIcon(Calendar, "calendario-eventos"),
    group: "main"
  },
  {
    id: "events",
    label: "Gestão de Eventos",
    icon: validateIcon(Calendar, "events"),
    group: "main"
  },
  {
    id: "proposals",
    label: "Propostas",
    icon: validateIcon(FileText, "proposals"),
    group: "main"
  },
  {
    id: "contracts",
    label: "Contratos",
    icon: validateIcon(FileText, "contracts"),
    group: "main"
  },
  {
    id: "questionarios",
    label: "Questionários",
    icon: validateIcon(FileText, "questionarios"),
    group: "main"
  },
  {
    id: "clientes",
    label: "Clientes",
    icon: validateIcon(Users, "clientes"),
    group: "main"
  },
  {
    id: "fornecedores",
    label: "Fornecedores",
    icon: validateIcon(ShoppingBag, "fornecedores"),
    group: "main"
  },
  {
    id: "website",
    label: "Website",
    icon: validateIcon(Palette, "website"),
    group: "main"
  }
];

export const secondaryMenuItems: MenuItem[] = [
  {
    id: "settings",
    label: "Configurações",
    icon: validateIcon(Settings, "settings"),
    href: "/admin/settings",
    group: "settings"
  }
];

export const getAllMenuItems = (): MenuItem[] => {
  try {
    const allItems = [...primaryMenuItems, ...secondaryMenuItems];
    console.log('menuConfig: Total de itens carregados:', allItems.length);
    return allItems;
  } catch (error) {
    console.error('menuConfig: Erro ao obter todos os itens do menu:', error);
    return [];
  }
};

export const getMenuSections = () => {
  try {
    return [
      {
        title: "Principal",
        items: primaryMenuItems
      },
      {
        title: "Configurações",
        items: secondaryMenuItems
      }
    ];
  } catch (error) {
    console.error('menuConfig: Erro ao obter seções do menu:', error);
    return [];
  }
};
