
import { FileText, UserPlus, Settings, Layout, Mail } from "lucide-react";
import { MenuItem, validateIcon } from './menuTypes';

export const sistemaItems: MenuItem[] = [
  {
    id: "template-propostas",
    label: "Templates Propostas",
    icon: validateIcon(FileText, "template-propostas"),
    group: "sistema"
  },
  {
    id: "template-contratos",
    label: "Templates Contratos",
    icon: validateIcon(Layout, "template-contratos"),
    group: "sistema"
  },
  {
    id: "template-emails",
    label: "Templates E-mails",
    icon: validateIcon(Mail, "template-emails"),
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
