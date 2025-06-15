
import { useState } from 'react';
import QuestionarioHeader from './QuestionarioHeader';
import QuestionarioSidebar from './QuestionarioSidebar';
import QuestionarioContent from './QuestionarioContent';
import QuestionarioFooter from './QuestionarioFooter';
import MobileQuestionarioNav from './MobileQuestionarioNav';
import { Badge } from '@/components/ui/badge';
import { Heart } from 'lucide-react';
import useQuestionarioForm from '@/hooks/useQuestionarioForm';
import QuestionarioTabs from "@/components/questionario/QuestionarioTabs";
import { questionarioSections } from '@/utils/questionarioSections';

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

  // Use the existing hook for form state
  const {
    progresso,
    respostasPreenchidas,
    podeEditar,
    canFinalize,
    perguntas,
    salvarRespostas
  } = useQuestionarioForm({ 
    questionario, 
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

  // Wrapper function to convert string-based campo to index-based for compatibility
  const handleRespostaChange = (index: number, valor: string) => {
    updateResposta(index.toString(), valor);
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'noivo': return 'Noivo';
      case 'noiva': return 'Noiva';
      case 'cliente': return 'Cliente';
      default: return role;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <QuestionarioHeader 
        nomeResponsavel={questionario.nome_responsavel}
        progresso={progresso}
        respostasPreenchidas={respostasPreenchidas}
        totalPerguntas={perguntas.length}
        onLogout={() => {}}
      />
      
      {/* Event Link Indicator */}
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
        {/* Tabs por seção para navegação simplificada */}
        <QuestionarioTabs
          respostas={respostas}
          podeEditar={podeEditar}
          onRespostaChange={handleRespostaChange}
          // O children abaixo renderiza apenas a seção corrente
          // Se quiser mostrar todas, é só remover o if
        >
          {(sectionId, section) => (
            <QuestionarioContent
              respostas={respostas}
              podeEditar={podeEditar}
              onRespostaChange={handleRespostaChange}
              sectionId={sectionId}
              section={section}
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

