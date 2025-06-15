
import { BarChart3 } from "lucide-react";
import { MenuItem, validateIcon } from './menuTypes';

export const primaryMenuItems: MenuItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: validateIcon(BarChart3, "dashboard"),
    href: "/admin",
    group: "main"
  }
];
