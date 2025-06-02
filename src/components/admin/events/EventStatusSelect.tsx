
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEventActions } from '@/hooks/useEventActions';

interface EventStatusSelectProps {
  eventId: string;
  currentStatus: string;
  onStatusChange: () => void;
}

const EventStatusSelect = ({ eventId, currentStatus, onStatusChange }: EventStatusSelectProps) => {
  const { updateStatus, loading } = useEventActions();

  const handleStatusChange = async (newStatus: string) => {
    const success = await updateStatus(eventId, newStatus as any);
    if (success) {
      onStatusChange();
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'em_planejamento':
        return 'Em Planejamento';
      case 'contratado':
        return 'Contratado';
      case 'concluido':
        return 'Concluído';
      case 'cancelado':
        return 'Cancelado';
      default:
        return status;
    }
  };

  return (
    <Select value={currentStatus} onValueChange={handleStatusChange} disabled={loading}>
      <SelectTrigger className="w-36">
        <SelectValue>
          {getStatusLabel(currentStatus)}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="em_planejamento">Em Planejamento</SelectItem>
        <SelectItem value="contratado">Contratado</SelectItem>
        <SelectItem value="concluido">Concluído</SelectItem>
        <SelectItem value="cancelado">Cancelado</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default EventStatusSelect;
