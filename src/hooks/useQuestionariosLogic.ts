
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { QuestionarioCasal } from '@/components/admin/tabs/types/questionario';

export const useQuestionariosLogic = (refetch: () => void) => {
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState<string | null>(null);
  const [showPersonalizacao, setShowPersonalizacao] = useState<string | null>(null);
  const { toast } = useToast();

  const gerarHistoria = async (linkPublico: string) => {
    setIsGenerating(linkPublico);
    
    try {
      const { data: questionariosData, error } = await supabase
        .from('questionarios_noivos')
        .select('nome_responsavel, email, respostas_json')
        .eq('link_publico', linkPublico)
        .eq('status', 'preenchido');

      if (error) throw error;

      if (!questionariosData || questionariosData.length < 2) {
        toast({
          title: "Questionários insuficientes",
          description: "São necessários pelo menos 2 questionários completos para gerar a história.",
          variant: "destructive"
        });
        return;
      }

      const { data: result, error: functionError } = await supabase.functions.invoke('gerar-historia-casal', {
        body: {
          link_publico: linkPublico,
          noivos: questionariosData.map(q => ({
            nome: q.nome_responsavel,
            email: q.email,
            respostas: q.respostas_json as Record<string, string> || {}
          }))
        }
      });

      if (functionError) throw functionError;

      if (result.success) {
        toast({
          title: "História gerada com sucesso!",
          description: result.message,
        });
        refetch();
      } else {
        throw new Error(result.error || 'Erro desconhecido');
      }

    } catch (error) {
      console.error('Erro ao gerar história:', error);
      toast({
        title: "Erro ao gerar história",
        description: "Não foi possível gerar a história do casal.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(null);
    }
  };

  const obterCasalPorLink = (questionariosExtended: QuestionarioCasal[], linkPublico: string): QuestionarioCasal | undefined => {
    return questionariosExtended.find(casal => casal.link_publico === linkPublico);
  };

  return {
    isGenerating,
    showHistory,
    showPersonalizacao,
    setShowHistory,
    setShowPersonalizacao,
    gerarHistoria,
    obterCasalPorLink
  };
};
