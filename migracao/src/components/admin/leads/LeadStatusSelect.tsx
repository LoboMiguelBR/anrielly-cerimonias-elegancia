
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLeadActions } from '@/hooks/useLeadActions';

interface LeadStatusSelectProps {
  leadId: string;
  currentStatus: string;
  onStatusChange: () => void;
}

const LeadStatusSelect = ({ leadId, currentStatus, onStatusChange }: LeadStatusSelectProps) => {
  const { updateStatus, loading } = useLeadActions();

  const handleStatusChange = async (newStatus: string) => {
    const success = await updateStatus(leadId, newStatus);
    if (success) {
      onStatusChange();
    }
  };

  return (
    <Select value={currentStatus} onValueChange={handleStatusChange} disabled={loading}>
      <SelectTrigger className="w-32">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="aguardando">Aguardando</SelectItem>
        <SelectItem value="convertido">Convertido</SelectItem>
        <SelectItem value="perdido">Perdido</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default LeadStatusSelect;
