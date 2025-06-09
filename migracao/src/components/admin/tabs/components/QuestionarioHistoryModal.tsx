
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import QuestionarioHistoryViewer from './QuestionarioHistoryViewer';
import { QuestionarioCasal } from '../types/questionario';

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
