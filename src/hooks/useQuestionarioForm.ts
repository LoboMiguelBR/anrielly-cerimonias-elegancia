import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { sendQuestionarioCompletionEmail } from '@/utils/email';

const useQuestionarioForm = () => {
  const { linkPublico } = useParams<{ linkPublico: string }>();
  const navigate = useNavigate();
  const [questionario, setQuestionario] = useState<any>(null);
  const [respostas, setRespostas] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuestionario = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('questionarios')
          .select('*')
          .eq('link_publico', linkPublico)
          .single();

        if (error) {
          console.error('Erro ao buscar questionário:', error);
          toast.error('Erro ao carregar o questionário.');
          navigate('/');
          return;
        }

        if (!data) {
          toast.error('Questionário não encontrado.');
          navigate('/');
          return;
        }

        setQuestionario(data);
        // Inicializa o estado de respostas com as respostas existentes do banco de dados, se houver
        setRespostas(data.respostas || {});
      } finally {
        setIsLoading(false);
      }
    };

    if (linkPublico) {
      fetchQuestionario();
    }
  }, [linkPublico, navigate]);

  const handleInputChange = (perguntaId: string, value: any) => {
    setRespostas(prevRespostas => ({
      ...prevRespostas,
      [perguntaId]: value,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('questionarios')
        .update({ respostas })
        .eq('link_publico', linkPublico);

      if (error) {
        console.error('Erro ao salvar respostas:', error);
        toast.error('Erro ao salvar as respostas. Por favor, tente novamente.');
        return;
      }

      toast.success('Respostas salvas com sucesso!');

      // Enviar email de conclusão do questionário
      if (questionario?.nome && questionario?.email) {
        await sendQuestionarioCompletionEmail(questionario.nome, questionario.email, questionario.id);
      }

      navigate(`/questionario/${linkPublico}/sucesso`); // Redireciona para a página de sucesso
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    questionario,
    respostas,
    isLoading,
    isSubmitting,
    handleInputChange,
    handleSubmit,
  };
};

export default useQuestionarioForm;
