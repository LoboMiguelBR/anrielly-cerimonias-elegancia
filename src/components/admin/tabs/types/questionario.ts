
import { Json } from '@/integrations/supabase/types';

export interface QuestionarioCasal {
  id: string;
  link_publico: string;
  nome_responsavel: string;
  email: string;
  status: string | null;
  historia_gerada?: string | null;
  historia_processada?: boolean | null;
  data_criacao: string | null;
  data_atualizacao: string | null;
  total_perguntas_resp: number | null;
  respostas_json: Json | null;
  senha_hash: string;
  nome_evento?: string | null;
  tipo_evento?: string | null;
  temPersonalizacao?: boolean;
}

// Interface unificada para uso em todos os componentes
export interface Questionario {
  id: string;
  nome_responsavel: string;
  email: string;
  link_publico: string;
  status: string | null; // Permitir null
  total_perguntas_resp: number | null; // Permitir null
  data_criacao: string | null; // Permitir null
  data_atualizacao: string | null; // Permitir null
  historia_processada?: boolean | null;
  historia_gerada?: string | null;
  respostas_json: any;
  senha_hash: string;
  nome_evento?: string | null;
  tipo_evento?: string | null;
}

// Interface para agrupamento por evento
export interface EventoGroup {
  link_publico: string;
  nome_evento: string;
  tipo_evento: string;
  questionarios: Questionario[];
  totalRespostas: number;
  progresso: number;
}
