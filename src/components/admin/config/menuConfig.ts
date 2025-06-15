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
  ClipboardList,
  UserPlus,
  Star,
  Image,
  Globe,
  Phone,
  DollarSign,
  Building2,
} from "lucide-react";

export type MenuItem = {
  id: string;
  label: string;
  icon: any;
  href?: string;
  group: string;
};

// Nova função: aceita qualquer valor truthy (basta ser import válido do lucide)
const validateIcon = (icon: any, itemId: string) => {
  if (!icon) {
    console.warn(`menuConfig: Ícone inválido para item ${itemId}, usando fallback`);
    return AlertTriangle;
  }
  return icon;
};

export const primaryMenuItems: MenuItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: validateIcon(BarChart3, "dashboard"),
    href: "/admin",
    group: "main"
  }
];

export const crmVendasItems: MenuItem[] = [
  {
    id: "leads",
    label: "Leads",
    icon: validateIcon(Phone, "leads"),
    group: "crm"
  },
  {
    id: "gestao-comercial",
    label: "Gestão Comercial",
    icon: validateIcon(TrendingUp, "gestao-comercial"),
    group: "crm"
  },
  {
    id: "quotes",
    label: "Orçamentos",
    icon: validateIcon(DollarSign, "quotes"),
    group: "crm"
  },
  {
    id: "proposals",
    label: "Propostas",
    icon: validateIcon(FileText, "proposals"),
    group: "crm"
  },
  {
    id: "contracts",
    label: "Contratos",
    icon: validateIcon(FileText, "contracts"),
    group: "crm"
  },
  {
    id: "clientes",
    label: "Clientes",
    icon: validateIcon(Users, "clientes"),
    group: "crm"
  }
];

export const operacionalItems: MenuItem[] = [
  {
    id: "events",
    label: "Gestão de Eventos",
    icon: validateIcon(Calendar, "events"),
    group: "operacional"
  },
  {
    id: "calendario-eventos",
    label: "Calendário & Timeline", 
    icon: validateIcon(Calendar, "calendario-eventos"),
    group: "operacional"
  },
  {
    id: "questionarios",
    label: "Questionários",
    icon: validateIcon(ClipboardList, "questionarios"),
    group: "operacional"
  },
  {
    id: "fornecedores",
    label: "Fornecedores",
    icon: validateIcon(ShoppingBag, "fornecedores"),
    group: "operacional"
  },
  {
    id: "professionals",
    label: "Profissionais",
    icon: validateIcon(Building2, "professionals"),
    group: "operacional"
  }
];

export const conteudoItems: MenuItem[] = [
  {
    id: "gallery",
    label: "Galeria",
    icon: validateIcon(Image, "gallery"),
    group: "conteudo"
  },
  {
    id: "testimonials",
    label: "Depoimentos",
    icon: validateIcon(Star, "testimonials"),
    group: "conteudo"
  }
];

export const sistemaItems: MenuItem[] = [
  {
    id: "templates",
    label: "Templates",
    icon: validateIcon(FileText, "templates"),
    group: "sistema"
  },
  {
    id: "users",
    label: "Usuários & Permissões",
    icon: validateIcon(UserPlus, "users"),
    group: "sistema"
  },
  {
    id: "settings",
    label: "Configurações",
    icon: validateIcon(Settings, "settings"),
    href: "/admin/settings",
    group: "sistema"
  }
];

export const getAllMenuItems = (): MenuItem[] => {
  try {
    const allItems = [
      ...primaryMenuItems,
      ...crmVendasItems,
      ...operacionalItems,
      ...conteudoItems,
      ...sistemaItems
    ];
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
        title: "CRM & Vendas",
        items: crmVendasItems
      },
      {
        title: "Operacional",
        items: operacionalItems
      },
      {
        title: "Conteúdo",
        items: conteudoItems
      },
      {
        title: "Sistema",
        items: sistemaItems
      }
    ];
  } catch (error) {
    console.error('menuConfig: Erro ao obter seções do menu:', error);
    return [];
  }
};
