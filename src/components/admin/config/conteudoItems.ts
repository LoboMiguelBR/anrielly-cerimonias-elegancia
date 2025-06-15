
import { Image, Star } from "lucide-react";
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
  }
];
