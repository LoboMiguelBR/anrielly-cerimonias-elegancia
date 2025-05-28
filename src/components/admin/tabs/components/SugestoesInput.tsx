
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface SugestoesInputProps {
  value: string;
  onChange: (value: string) => void;
  sugestoes: string[];
  placeholder?: string;
  rows?: number;
}

const SugestoesInput = ({ value, onChange, sugestoes, placeholder, rows = 1 }: SugestoesInputProps) => {
  return (
    <div className="space-y-2">
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
      />
      <div className="flex flex-wrap gap-2">
        {sugestoes.map((sugestao) => (
          <Button
            key={sugestao}
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onChange(sugestao)}
            className="text-xs"
          >
            {sugestao}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default SugestoesInput;
