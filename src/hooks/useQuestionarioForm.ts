
import { useState, useEffect, useMemo, useCallback } from 'react';
import { toast } from 'sonner';
import { questionarioSections } from '@/utils/questionarioSections';

interface UseQuestionarioFormParams {
  questionario: any;
  updateQuestionario: (data: any) => void;
  logout: () => void;
}

const useQuestionarioForm = ({ questionario, updateQuestionario, logout }: UseQuestionarioFormParams) => {
  const [respostas, setRespostas] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Initialize respostas when questionario changes
  useEffect(() => {
    if (questionario?.respostas_json) {
      setRespostas(questionario.respostas_json);
    }
  }, [questionario]);

  // Calculate total questions from sections
  const perguntas = useMemo(() => {
    return questionarioSections.flatMap(section => section.questions);
  }, []);

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
    return questionario?.status !== 'preenchido';
  }, [questionario?.status]);

  // Check if can finalize (at least 80% completed)
  const canFinalize = useMemo(() => {
    return progresso >= 80;
  }, [progresso]);

  // Handle answer change
  const handleRespostaChange = useCallback((index: number, valor: string) => {
    setRespostas(prev => ({
      ...prev,
      [index]: valor
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
      const response = await fetch('/api/supabase/functions/v1/questionario-respostas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          questionarioId: questionario.id,
          respostas,
          finalizar
        })
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar respostas');
      }

      const result = await response.json();
      
      // Update the questionario with new status
      updateQuestionario({
        ...questionario,
        respostas_json: respostas,
        status: result.status
      });

      setLastSaved(new Date());
      toast.success(result.message || 'Respostas salvas com sucesso!');

      if (finalizar) {
        toast.success('Questionário finalizado! Obrigado por suas respostas.');
        // Could redirect or logout here if needed
      }
    } catch (error) {
      console.error('Erro ao salvar respostas:', error);
      toast.error('Erro ao salvar respostas. Tente novamente.');
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

export default useQuestionarioForm;
