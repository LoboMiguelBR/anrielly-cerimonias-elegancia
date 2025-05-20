
import { FC } from 'react';
import { TestimonialItemProps } from './TestimonialItem';

const staticTestimonials: TestimonialItemProps[] = [
  {
    id: '1',
    name: "Mariana e Pedro",
    role: "Casamento em Volta Redonda",
    imageUrl: "/lovable-uploads/322b9c8a-c27a-42c2-bbfd-b8fbcfd2c449.png",
    quote: "A Anrielly trouxe magia para nossa cerimônia. Cada palavra foi escolhida com carinho e emocionou a todos os presentes."
  },
  {
    id: '2',
    name: "Família Silva",
    role: "Bodas de Prata",
    imageUrl: "/lovable-uploads/99442f1a-9c10-4e95-a063-bd0bda0a998c.png",
    quote: "Profissionalismo impecável. A Anrielly conseguiu captar nossa história e transformá-la em uma narrativa emocionante."
  },
  {
    id: '3',
    name: "Juliana",
    role: "Festa de 15 anos",
    imageUrl: "/lovable-uploads/d856da09-1255-4e7d-a9d6-0a2a04edac9d.png",
    quote: "Minha festa foi perfeita! A condução da cerimônia foi elegante e cheia de significado, exatamente como eu sonhava."
  }
];

export const getStaticTestimonials = (): TestimonialItemProps[] => staticTestimonials;

export default getStaticTestimonials;
