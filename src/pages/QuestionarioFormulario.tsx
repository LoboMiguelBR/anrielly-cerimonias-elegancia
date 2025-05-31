
import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useQuestionarioForm } from '@/hooks/useQuestionarioForm';
import { useQuestionarioAuth } from '@/hooks/useQuestionarioAuth';
import { useEvents } from '@/hooks/useEvents';
import QuestionarioContainer from '@/components/questionario/QuestionarioContainer';
import { useToast } from "@/components/ui/use-toast";

const QuestionarioFormulario = () => {
  const { linkPublico } = useParams<{ linkPublico: string }>();
  const location = useLocation();
  const { toast } = useToast();
  const { addParticipant } = useEvents();
  
  // Extract event_id and role from URL params
  const searchParams = new URLSearchParams(location.search);
  const eventId = searchParams.get('event_id');
  const participantRole = searchParams.get('role') as 'noivo' | 'noiva' | 'cliente' | null;

  const { questionario, isLoading: authLoading } = useQuestionarioAuth(linkPublico!);
  const {
    respostas,
    secaoAtual,
    setSecaoAtual,
    updateResposta,
    isLoading: formLoading,
    saveRespostas
  } = useQuestionarioForm(linkPublico || '');

  // Enhanced save function to also register as event participant
  const handleSaveWithEventLink = async (finalRespostas: any) => {
    try {
      // Save normal questionnaire data
      await saveRespostas(finalRespostas);

      // If we have event linking parameters, register as participant
      if (eventId && participantRole && questionario) {
        const nomeCompleto = `${finalRespostas.nome_noivo || ''} ${finalRespostas.sobrenome_noivo || ''}`.trim() ||
                           `${finalRespostas.nome_noiva || ''} ${finalRespostas.sobrenome_noiva || ''}`.trim() ||
                           questionario.nome_responsavel;
        
        const email = finalRespostas.email_principal || questionario.email;

        if (nomeCompleto && email) {
          await addParticipant(eventId, email, nomeCompleto, participantRole);
          
          toast({
            title: "Questionário vinculado ao evento",
            description: `Suas respostas foram vinculadas ao evento como ${participantRole}`,
          });
        }
      }
    } catch (error) {
      console.error('Error saving questionnaire with event link:', error);
      toast({
        title: "Erro ao salvar",
        description: "Houve um erro ao salvar o questionário",
        variant: "destructive",
      });
    }
  };

  if (authLoading || formLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p>Carregando questionário...</p>
        </div>
      </div>
    );
  }

  if (!questionario) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Questionário não encontrado</h1>
          <p>O link fornecido não é válido ou o questionário não existe.</p>
        </div>
      </div>
    );
  }

  return (
    <QuestionarioContainer
      questionario={questionario}
      respostas={respostas}
      secaoAtual={secaoAtual}
      setSecaoAtual={setSecaoAtual}
      updateResposta={updateResposta}
      saveRespostas={handleSaveWithEventLink}
      isLinkedToEvent={!!eventId && !!participantRole}
      eventRole={participantRole}
    />
  );
};

export default QuestionarioFormulario;
