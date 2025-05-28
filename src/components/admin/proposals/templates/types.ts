
import { z } from 'zod';

export const proposalTemplateSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
  html_content: z.string().min(1, 'Conteúdo HTML é obrigatório'),
  css_content: z.string().optional(),
  is_default: z.boolean().optional(),
});

export type ProposalTemplateFormData = z.infer<typeof proposalTemplateSchema>;
