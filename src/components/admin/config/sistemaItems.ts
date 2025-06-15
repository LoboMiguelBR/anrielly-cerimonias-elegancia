
import { FileText, UserPlus, Settings } from "lucide-react";
import { MenuItem, validateIcon } from './menuTypes';

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
