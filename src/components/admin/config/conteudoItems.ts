
import { Image, Star, ClipboardList, Sparkles } from "lucide-react";
import { MenuItem, validateIcon } from './menuTypes';

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
  },
  {
    id: "questionarios",
    label: "Questionários",
    icon: validateIcon(ClipboardList, "questionarios"),
    group: "conteudo"
  },
  {
    id: "historias-casais",
    label: "Histórias IA",
    icon: validateIcon(Sparkles, "historias-casais"),
    group: "conteudo"
  }
];
