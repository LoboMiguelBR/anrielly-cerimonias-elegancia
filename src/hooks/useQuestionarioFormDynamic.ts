
import { useState, useEffect, useMemo, useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface UseQuestionarioFormDynamicParams {
  questionario: any;
  secoes: any[];
  updateQuestionario: (data: any) => void;
  logout: () => void;
}

const useQuestionarioFormDynamic = ({ 
  questionario, 
  secoes, 
  updateQuestionario, 
  logout 
}: UseQuestionarioFormDynamicParams) => {
  const [respostas, setRespostas] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Initialize respostas when questionario changes
  useEffect(() => {
    if (questionario?.respostas_json) {
      setRespostas(questionario.respostas_json);
    }
  }, [questionario]);

  // Calculate total questions from dynamic sections
  const perguntas = useMemo(() => {
    return secoes.flatMap(secao => secao.perguntas || []);
  }, [secoes]);

  // Calculate answered questions
  const respostasPreenchidas = useMemo(() => {
    return Object.values(respostas).filter(resposta => 
      resposta && resposta.trim().length > 0
    ).length;
  }, [respostas]);

  // Calculate progress percentage
  const progresso = useMemo(() => {
    if (perguntas.length === 0) return 0;
    return (respostasPreenchidas / perguntas.length) * 100;
  }, [respostasPreenchidas, perguntas.length]);

  // Check if can edit (not finalized)
  const podeEditar = useMemo(() => {
    const status = questionario?.status || 'rascunho';
    return status !== 'preenchido';
  }, [questionario?.status]);

  // Check if can finalize (at least 80% completed)
  const canFinalize = useMemo(() => {
    return progresso >= 80;
  }, [progresso]);

  // Handle answer change - now using string IDs
  const handleRespostaChange = useCallback((perguntaId: string, valor: string) => {
    setRespostas(prev => ({
      ...prev,
      [perguntaId]: valor
    }));
  }, []);

  // Save responses function
  const salvarRespostas = useCallback(async (finalizar: boolean = false) => {
    if (!questionario?.id) {
      toast.error('Erro: Questionário não encontrado');
      return;
    }

    setIsSaving(true);
    try {
      console.log('Salvando respostas para questionário:', questionario.id, 'finalizar:', finalizar);
      
      const { data, error } = await supabase.functions.invoke('questionario-respostas', {
        body: {
          questionarioId: questionario.id,
          respostas,
          finalizar
        }
      });

      if (error) {
        console.error('Erro na edge function:', error);
        throw new Error(error.message || 'Erro ao salvar respostas');
      }

      console.log('Resposta da edge function:', data);
      
      // Update the questionario with new status
      updateQuestionario({
        ...questionario,
        respostas_json: respostas,
        status: data.status
      });

      setLastSaved(new Date());
      toast.success(data.message || 'Respostas salvas com sucesso!');

      if (finalizar) {
        toast.success('Questionário finalizado! Obrigado por suas respostas.');
      }
    } catch (error: any) {
      console.error('Erro ao salvar respostas:', error);
      toast.error(`Erro ao salvar respostas: ${error.message || 'Tente novamente.'}`);
    } finally {
      setIsSaving(false);
    }
  }, [questionario, respostas, updateQuestionario]);

  return {
    respostas,
    isSaving,
    lastSaved,
    respostasPreenchidas,
    progresso,
    podeEditar,
    canFinalize,
    perguntas,
    handleRespostaChange,
    salvarRespostas
  };
};

export default useQuestionarioFormDynamic;
