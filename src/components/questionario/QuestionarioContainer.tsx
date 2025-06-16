
import { useState } from 'react';
import QuestionarioHeader from './QuestionarioHeader';
import QuestionarioSidebar from './QuestionarioSidebar';
import QuestionarioContent from './QuestionarioContent';
import QuestionarioFooter from './QuestionarioFooter';
import MobileQuestionarioNav from './MobileQuestionarioNav';
import { Badge } from '@/components/ui/badge';
import { Heart } from 'lucide-react';
import useQuestionarioFormDynamic from '@/hooks/useQuestionarioFormDynamic';
import QuestionarioTabs from "@/components/questionario/QuestionarioTabs";
import useQuestionarioEstruturaDinamica from "@/hooks/useQuestionarioEstruturaDinamica";

interface QuestionarioContainerProps {
  questionario: any;
  respostas: any;
  secaoAtual: number;
  setSecaoAtual: (secao: number) => void;
  updateResposta: (campo: string, valor: any) => void;
  saveRespostas: (respostas: any) => Promise<void>;
  isLinkedToEvent?: boolean;
  eventRole?: string | null;
}

const QuestionarioContainer = ({
  questionario,
  respostas,
  secaoAtual,
  setSecaoAtual,
  updateResposta,
  saveRespostas,
  isLinkedToEvent = false,
  eventRole = null
}: QuestionarioContainerProps) => {
  const [isSaving, setIsSaving] = useState(false);

  // Hook dinâmico: busca estrutura REAL via Supabase
  const { secoes, loading } = useQuestionarioEstruturaDinamica(questionario.template_id);

  // Use the new dynamic hook
  const {
    progresso,
    respostasPreenchidas,
    podeEditar,
    canFinalize,
    perguntas,
    salvarRespostas,
    handleRespostaChange: dynamicHandleRespostaChange
  } = useQuestionarioFormDynamic({ 
    questionario, 
    secoes,
    updateQuestionario: () => {},
    logout: () => {} 
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveRespostas(respostas);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFinalize = async () => {
    setIsSaving(true);
    try {
      await salvarRespostas(true);
    } finally {
      setIsSaving(false);
    }
  };

  // Wrapper function for respostas, usando string (id da pergunta)
  const handleRespostaChange = (perguntaId: string, valor: string) => {
    updateResposta(perguntaId, valor);
    dynamicHandleRespostaChange(perguntaId, valor);
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'noivo': return 'Noivo';
      case 'noiva': return 'Noiva';
      case 'cliente': return 'Cliente';
      default: return role;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p>Carregando estrutura...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <QuestionarioHeader 
        nomeResponsavel={questionario.nome_responsavel}
        progresso={progresso}
        respostasPreenchidas={respostasPreenchidas}
        totalPerguntas={perguntas.length}
        onLogout={() => {}}
      />

      {isLinkedToEvent && eventRole && (
        <div className="bg-white border-b border-purple-100">
          <div className="container mx-auto px-4 py-2">
            <div className="flex items-center justify-center gap-2">
              <Heart className="w-4 h-4 text-purple-600" />
              <span className="text-sm text-gray-600">
                Questionário vinculado ao evento como
              </span>
              <Badge variant="outline" className="bg-purple-50 text-purple-700">
                {getRoleLabel(eventRole)}
              </Badge>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Tabs por seção - dados REAIS do Supabase */}
        <QuestionarioTabs
          secoes={secoes}
          respostas={respostas}
          podeEditar={podeEditar}
          onRespostaChange={handleRespostaChange}
        >
          {(secaoId, secao) => (
            <QuestionarioContent
              secaoId={secaoId}
              secao={secao}
              respostas={respostas}
              podeEditar={podeEditar}
              onRespostaChange={handleRespostaChange}
            />
          )}
        </QuestionarioTabs>
        <div className="max-w-2xl mx-auto mt-8">
          <QuestionarioFooter
            isSaving={isSaving}
            canFinalize={canFinalize}
            podeEditar={podeEditar}
            onSave={handleSave}
            onFinalize={handleFinalize}
          />
        </div>
      </div>
    </div>
  );
};

export default QuestionarioContainer;
