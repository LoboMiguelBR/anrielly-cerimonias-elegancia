
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EventStatusSelectProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const EventStatusSelect = ({ value, onChange, disabled }: EventStatusSelectProps) => {
  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger>
        <SelectValue placeholder="Selecione o status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="em_planejamento">Em Planejamento</SelectItem>
        <SelectItem value="confirmado">Confirmado</SelectItem>
        <SelectItem value="em_andamento">Em Andamento</SelectItem>
        <SelectItem value="concluido">Concluído</SelectItem>
        <SelectItem value="cancelado">Cancelado</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default EventStatusSelect;
