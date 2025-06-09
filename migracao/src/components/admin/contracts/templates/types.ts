
import * as z from 'zod';

export const templateSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional().or(z.literal('')),
  html_content: z.string().min(1, 'Conteúdo é obrigatório'),
  css_content: z.string().optional().or(z.literal('')),
  is_default: z.boolean().optional(),
});

export type TemplateFormData = z.infer<typeof templateSchema>;
