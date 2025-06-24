
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
    async function fetchEstrutura() {
      console.log('Buscando estrutura para templateId:', templateId);
      
      if (!templateId) {
        console.log('Sem template_id, criando estrutura padrão');
        // Estrutura padrão quando não há template
        const estruturaPadrao = [
          {
            id: 'default-1',
            titulo: 'Informações Básicas',
            descricao: 'Dados principais do evento',
            ordem: 1,
            perguntas: [
              {
                id: 'nome_completo',
                texto: 'Nome Completo',
                ordem: 1,
                tipo_resposta: 'texto_curto',
                obrigatoria: true,
                placeholder: 'Digite seu nome completo'
              },
              {
                id: 'email_principal',
                texto: 'Email Principal',
                ordem: 2,
                tipo_resposta: 'email',
                obrigatoria: true,
                placeholder: 'Digite seu email principal'
              },
              {
                id: 'telefone_principal',
                texto: 'Telefone Principal',
                ordem: 3,
                tipo_resposta: 'telefone',
                obrigatoria: true,
                placeholder: 'Digite seu telefone'
              }
            ]
          },
          {
            id: 'default-2',
            titulo: 'Detalhes do Evento',
            descricao: 'Informações sobre o evento',
            ordem: 2,
            perguntas: [
              {
                id: 'data_evento',
                texto: 'Data do Evento',
                ordem: 1,
                tipo_resposta: 'data',
                obrigatoria: true,
                placeholder: 'Selecione a data do evento'
              },
              {
                id: 'local_evento',
                texto: 'Local do Evento',
                ordem: 2,
                tipo_resposta: 'texto_curto',
                obrigatoria: true,
                placeholder: 'Digite o local do evento'
              },
              {
                id: 'observacoes',
                texto: 'Observações Adicionais',
                ordem: 3,
                tipo_resposta: 'texto_longo',
                obrigatoria: false,
                placeholder: 'Compartilhe detalhes especiais sobre seu evento'
              }
            ]
          }
        ];
        
        setSecoes(estruturaPadrao);
        setLoading(false);
        return;
      }

      try {
        // Busca seções do template
        const { data: secoesData, error: secoesError } = await supabase
          .from("questionario_template_secoes")
          .select("*")
          .eq("template_id", templateId)
          .order("ordem", { ascending: true });

        if (secoesError) {
          console.error('Erro ao buscar seções:', secoesError);
          throw secoesError;
        }

        // Busca perguntas do template
        const { data: perguntasData, error: perguntasError } = await supabase
          .from("questionario_template_perguntas")
          .select("*")
          .eq("template_id", templateId)
          .order("ordem", { ascending: true });

        if (perguntasError) {
          console.error('Erro ao buscar perguntas:', perguntasError);
          throw perguntasError;
        }

        console.log('Seções encontradas:', secoesData?.length || 0);
        console.log('Perguntas encontradas:', perguntasData?.length || 0);

        // Se não encontrou seções no template, usa estrutura padrão
        if (!secoesData || secoesData.length === 0) {
          console.log('Nenhuma seção encontrada no template, usando estrutura padrão');
          setSecoes([
            {
              id: 'fallback-1',
              titulo: 'Informações Gerais',
              descricao: 'Dados básicos do questionário',
              ordem: 1,
              perguntas: [
                {
                  id: 'nome_responsavel',
                  texto: 'Nome do Responsável',
                  ordem: 1,
                  tipo_resposta: 'texto_curto',
                  obrigatoria: true,
                  placeholder: 'Digite o nome do responsável'
                }
              ]
            }
          ]);
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

        console.log('Estrutura final:', secaoPerguntas);
        setSecoes(secaoPerguntas);
      } catch (error) {
        console.error('Erro ao buscar estrutura do questionário:', error);
        // Em caso de erro, usar estrutura mínima
        setSecoes([
          {
            id: 'error-fallback',
            titulo: 'Questionário',
            descricao: 'Estrutura básica do questionário',
            ordem: 1,
            perguntas: [
              {
                id: 'resposta_geral',
                texto: 'Sua Resposta',
                ordem: 1,
                tipo_resposta: 'texto_longo',
                obrigatoria: false,
                placeholder: 'Digite sua resposta aqui'
              }
            ]
          }
        ]);
      } finally {
        setLoading(false);
      }
    }

    fetchEstrutura();
  }, [templateId]);

  return { secoes, loading };
}
