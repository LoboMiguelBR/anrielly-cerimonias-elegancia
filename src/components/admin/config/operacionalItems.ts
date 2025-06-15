
import { Calendar, ClipboardList, ShoppingBag, Building2 } from "lucide-react";
import { MenuItem, validateIcon } from './menuTypes';

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
