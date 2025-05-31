
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Questionario {
  id: string;
  nome_responsavel: string;
  email: string;
  link_publico: string;
  status: string;
  total_perguntas_resp: number;
  data_criacao: string;
  data_atualizacao: string;
  historia_processada: boolean;
  historia_gerada?: string;
  respostas_json: any;
}

export const useQuestionarioActions = () => {
  const [loading, setLoading] = useState(false);

  const updateQuestionario = async (id: string, data: Partial<Questionario>) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('questionarios_noivos')
        .update(data)
        .eq('id', id);

      if (error) throw error;

      toast.success('Questionário atualizado com sucesso!');
      return true;
    } catch (err) {
      console.error('Erro ao atualizar questionário:', err);
      toast.error('Erro ao atualizar questionário');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteQuestionario = async (id: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('questionarios_noivos')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Questionário deletado com sucesso!');
      return true;
    } catch (err) {
      console.error('Erro ao deletar questionário:', err);
      toast.error('Erro ao deletar questionário');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resendAccessEmail = async (questionario: Questionario) => {
    try {
      setLoading(true);
      
      const { error } = await supabase.functions.invoke('enviar-email-questionario', {
        body: {
          email: questionario.email,
          nome: questionario.nome_responsavel,
          linkPublico: questionario.link_publico,
          tipo: 'reenvio'
        }
      });

      if (error) throw error;

      toast.success('Email de acesso reenviado com sucesso!');
      return true;
    } catch (err) {
      console.error('Erro ao reenviar email:', err);
      toast.error('Erro ao reenviar email de acesso');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    return updateQuestionario(id, { status });
  };

  return {
    updateQuestionario,
    deleteQuestionario,
    resendAccessEmail,
    updateStatus,
    loading
  };
};
