
import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import useQuestionarioForm from '@/hooks/useQuestionarioForm';
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
  const [currentSection, setCurrentSection] = useState(0);
  const [respostas, setRespostas] = useState<Record<string, string>>({});

  console.log('QuestionarioFormulario - questionario:', questionario);
  console.log('QuestionarioFormulario - authLoading:', authLoading);

  // Initialize respostas when questionario changes
  useEffect(() => {
    if (questionario?.respostasJson) {
      console.log('Inicializando respostas:', questionario.respostasJson);
      setRespostas(questionario.respostasJson);
    }
  }, [questionario]);

  const updateResposta = (campo: string, valor: any) => {
    console.log('Atualizando resposta:', campo, valor);
    setRespostas(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  // Enhanced save function to also register as event participant
  const handleSaveWithEventLink = async (finalRespostas: any) => {
    try {
      console.log('Salvando respostas:', finalRespostas);
      
      // Save normal questionnaire data using edge function
      const { data, error } = await supabase.functions.invoke('questionario-respostas', {
        body: {
          questionarioId: questionario.id,
          respostas: finalRespostas,
          finalizar: false
        }
      });

      if (error) {
        console.error('Erro ao salvar respostas:', error);
        throw error;
      }

      console.log('Respostas salvas com sucesso:', data);

      // If we have event linking parameters, register as participant
      if (eventId && participantRole && questionario) {
        const nomeCompleto = `${finalRespostas.nome_noivo || ''} ${finalRespostas.sobrenome_noivo || ''}`.trim() ||
                           `${finalRespostas.nome_noiva || ''} ${finalRespostas.sobrenome_noiva || ''}`.trim() ||
                           questionario.nomeResponsavel;
        
        const email = finalRespostas.email_principal || questionario.email;

        if (nomeCompleto && email) {
          await addParticipant(eventId, email, nomeCompleto, participantRole);
          
          toast({
            title: "Questionário vinculado ao evento",
            description: `Suas respostas foram vinculadas ao evento como ${participantRole}`,
          });
        }
      }

      toast({
        title: "Respostas salvas",
        description: "Suas respostas foram salvas com sucesso!",
      });
    } catch (error) {
      console.error('Error saving questionnaire with event link:', error);
      toast({
        title: "Erro ao salvar",
        description: "Houve um erro ao salvar o questionário",
        variant: "destructive",
      });
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando questionário...</p>
        </div>
      </div>
    );
  }

  if (!questionario) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Questionário não encontrado</h1>
          <p className="text-gray-600">O link fornecido não é válido ou o questionário não existe.</p>
        </div>
      </div>
    );
  }

  return (
    <QuestionarioContainer
      questionario={questionario}
      respostas={respostas}
      secaoAtual={currentSection}
      setSecaoAtual={setCurrentSection}
      updateResposta={updateResposta}
      saveRespostas={handleSaveWithEventLink}
      isLinkedToEvent={!!eventId && !!participantRole}
      eventRole={participantRole}
    />
  );
};

export default QuestionarioFormulario;
