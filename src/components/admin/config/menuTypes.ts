
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

// Função utilitária global para validar ícone
export const validateIcon = (icon: any, itemId: string) => {
  if (!icon) {
    console.warn(`menuConfig: Ícone inválido para item ${itemId}, usando fallback`);
    return AlertTriangle;
  }
  return icon;
};
