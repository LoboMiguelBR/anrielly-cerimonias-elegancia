
export interface TemplateQuestion {
  texto: string;
  tipo_resposta: string;
  placeholder?: string;
  obrigatoria: boolean;
  ordem: number;
}

export interface TemplateSection {
  titulo: string;
  descricao: string;
  ordem: number;
  questions: TemplateQuestion[];
}

export interface TemplateStructure {
  sections: TemplateSection[];
}

export type TemplateStructures = Record<string, TemplateStructure>;
