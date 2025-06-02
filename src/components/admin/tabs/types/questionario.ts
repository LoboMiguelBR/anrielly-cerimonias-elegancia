
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
  temPersonalizacao?: boolean;
}

// Interface unificada para uso em todos os componentes
export interface Questionario {
  id: string;
  nome_responsavel: string;
  email: string;
  link_publico: string;
  status: string;
  total_perguntas_resp: number;
  data_criacao: string;
  data_atualizacao: string;
  historia_processada?: boolean | null;
  historia_gerada?: string | null;
  respostas_json: any;
  senha_hash: string;
}
