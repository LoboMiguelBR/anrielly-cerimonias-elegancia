
import { useState } from 'react';
import QuestionarioHeader from './QuestionarioHeader';
import QuestionarioSidebar from './QuestionarioSidebar';
import QuestionarioContent from './QuestionarioContent';
import QuestionarioFooter from './QuestionarioFooter';
import MobileQuestionarioNav from './MobileQuestionarioNav';
import { Badge } from '@/components/ui/badge';
import { Heart } from 'lucide-react';

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

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveRespostas(respostas);
    } finally {
      setIsSaving(false);
    }
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
      <QuestionarioHeader questionario={questionario} />
      
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
        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <QuestionarioSidebar 
              secaoAtual={secaoAtual} 
              setSecaoAtual={setSecaoAtual}
              respostas={respostas}
            />
          </div>
          
          <div className="lg:col-span-3">
            <QuestionarioContent
              secaoAtual={secaoAtual}
              respostas={respostas}
              updateResposta={updateResposta}
            />
            
            <QuestionarioFooter
              secaoAtual={secaoAtual}
              setSecaoAtual={setSecaoAtual}
              onSave={handleSave}
              isSaving={isSaving}
              respostas={respostas}
            />
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden">
          <MobileQuestionarioNav 
            secaoAtual={secaoAtual} 
            setSecaoAtual={setSecaoAtual}
            respostas={respostas}
          />
          
          <QuestionarioContent
            secaoAtual={secaoAtual}
            respostas={respostas}
            updateResposta={updateResposta}
          />
          
          <QuestionarioFooter
            secaoAtual={secaoAtual}
            setSecaoAtual={setSecaoAtual}
            onSave={handleSave}
            isSaving={isSaving}
            respostas={respostas}
          />
        </div>
      </div>
    </div>
  );
};

export default QuestionarioContainer;
