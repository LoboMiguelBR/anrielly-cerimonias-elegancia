
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Pergunta {
  id: string;
  texto: string;
  ordem: number;
  tipo_resposta: string;
  obrigatoria?: boolean;
  placeholder?: string;
  opcoes_resposta?: any;
}

interface Secao {
  id: string;
  titulo: string;
  descricao?: string;
  ordem: number;
  perguntas: Pergunta[];
}

export default function useQuestionarioEstruturaDinamica(templateId: string | undefined) {
  const [secoes, setSecoes] = useState<Secao[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!templateId) return;
    setLoading(true);
    async function fetchEstrutura() {
      // Busca seções do template
      const { data: secoesData, error: secoesError } = await supabase
        .from("questionario_template_secoes")
        .select("*")
        .eq("template_id", templateId)
        .order("ordem", { ascending: true });

      if (secoesError) {
        setLoading(false);
        return;
      }

      // Busca perguntas do template
      const { data: perguntasData, error: perguntasError } = await supabase
        .from("questionario_template_perguntas")
        .select("*")
        .eq("template_id", templateId)
        .order("ordem", { ascending: true });

      if (perguntasError) {
        setLoading(false);
        return;
      }

      // Mapeia perguntas em suas seções correspondentes
      const secaoPerguntas = (secoesData || []).map((secao) => ({
        id: secao.id,
        titulo: secao.titulo,
        descricao: secao.descricao,
        ordem: secao.ordem,
        perguntas: (perguntasData || []).filter((p) => p.secao_id === secao.id)
          .map((p) => ({
            id: p.id,
            texto: p.texto,
            ordem: p.ordem,
            tipo_resposta: p.tipo_resposta,
            obrigatoria: p.obrigatoria,
            placeholder: p.placeholder,
            opcoes_resposta: p.opcoes_resposta
          }))
      }));

      setSecoes(secaoPerguntas);
      setLoading(false);
    }
    fetchEstrutura();
  }, [templateId]);

  return { secoes, loading };
}
