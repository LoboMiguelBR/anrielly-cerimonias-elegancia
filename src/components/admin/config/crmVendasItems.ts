
import { Phone, TrendingUp, DollarSign, FileText, Users } from "lucide-react";
import { MenuItem, validateIcon } from './menuTypes';

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
    id: "clients",
    label: "Clientes",
    icon: validateIcon(Users, "clients"),
    group: "crm"
  }
];
