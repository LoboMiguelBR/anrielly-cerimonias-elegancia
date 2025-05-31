
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useEventQuestionarioLink = () => {
  const [loading, setLoading] = useState(false);

  const linkQuestionarioToEvent = async (linkPublico: string, eventId: string) => {
    try {
      setLoading(true);
      
      // Atualizar o questionário para incluir referência ao evento
      const { error } = await supabase
        .from('questionarios_noivos')
        .update({ 
          // Adicionar campo para vincular ao evento quando necessário
          respostas_json: {
            event_id: eventId,
            linked_at: new Date().toISOString()
          }
        })
        .eq('link_publico', linkPublico);

      if (error) throw error;

      toast.success('Questionário vinculado ao evento com sucesso!');
      return true;
    } catch (error) {
      console.error('Erro ao vincular questionário ao evento:', error);
      toast.error('Erro ao vincular questionário ao evento');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const unlinkQuestionarioFromEvent = async (linkPublico: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('questionarios_noivos')
        .update({ 
          respostas_json: null
        })
        .eq('link_publico', linkPublico);

      if (error) throw error;

      toast.success('Questionário desvinculado do evento com sucesso!');
      return true;
    } catch (error) {
      console.error('Erro ao desvincular questionário do evento:', error);
      toast.error('Erro ao desvincular questionário do evento');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    linkQuestionarioToEvent,
    unlinkQuestionarioFromEvent,
    loading
  };
};
