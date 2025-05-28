
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import QuestionarioHistoryViewer from './QuestionarioHistoryViewer';

interface QuestionarioCasal {
  id: string;
  link_publico: string;
  nome_responsavel: string;
  email: string;
  status: string | null;
  historia_gerada: string | null;
  historia_processada: boolean | null;
  data_criacao: string | null;
  data_atualizacao: string | null;
  total_perguntas_resp: number | null;
  respostas_json: any;
  senha_hash: string;
  temPersonalizacao?: boolean;
}

interface QuestionarioHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  questionario: QuestionarioCasal | undefined;
}

const QuestionarioHistoryModal = ({ isOpen, onClose, questionario }: QuestionarioHistoryModalProps) => {
  if (!questionario) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>História do Casal</DialogTitle>
        </DialogHeader>
        <QuestionarioHistoryViewer
          questionarioId={questionario.id}
          nomeResponsavel={questionario.nome_responsavel}
        />
      </DialogContent>
    </Dialog>
  );
};

export default QuestionarioHistoryModal;
