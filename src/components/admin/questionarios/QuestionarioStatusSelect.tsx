
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuestionarioActions } from '@/hooks/useQuestionarioActions';

interface QuestionarioStatusSelectProps {
  questionarioId: string;
  currentStatus: string;
  onStatusChange: () => void;
}

const QuestionarioStatusSelect = ({ questionarioId, currentStatus, onStatusChange }: QuestionarioStatusSelectProps) => {
  const { updateStatus, loading } = useQuestionarioActions();

  const handleStatusChange = async (newStatus: string) => {
    const success = await updateStatus(questionarioId, newStatus);
    if (success) {
      onStatusChange();
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'rascunho':
        return 'Rascunho';
      case 'enviado':
        return 'Enviado';
      case 'respondido':
        return 'Respondido';
      case 'processado':
        return 'Processado';
      case 'cancelado':
        return 'Cancelado';
      default:
        return status;
    }
  };

  return (
    <Select value={currentStatus} onValueChange={handleStatusChange} disabled={loading}>
      <SelectTrigger className="w-32">
        <SelectValue>
          {getStatusLabel(currentStatus)}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="rascunho">Rascunho</SelectItem>
        <SelectItem value="enviado">Enviado</SelectItem>
        <SelectItem value="respondido">Respondido</SelectItem>
        <SelectItem value="processado">Processado</SelectItem>
        <SelectItem value="cancelado">Cancelado</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default QuestionarioStatusSelect;
