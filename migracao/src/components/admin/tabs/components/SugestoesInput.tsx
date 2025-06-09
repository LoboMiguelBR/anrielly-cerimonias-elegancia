
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface SugestoesInputProps {
  value: string;
  onChange: (value: string) => void;
  sugestoes: string[];
  placeholder?: string;
  rows?: number;
  allowMultiple?: boolean;
}

const SugestoesInput = ({ 
  value, 
  onChange, 
  sugestoes, 
  placeholder, 
  rows = 3,
  allowMultiple = true 
}: SugestoesInputProps) => {
  const handleSugestaoClick = (sugestao: string) => {
    if (allowMultiple) {
      // Se permitir múltiplas seleções, adiciona ao texto existente
      if (value.trim() === '') {
        onChange(sugestao);
      } else {
        // Adiciona vírgula se não terminar com pontuação
        const needsSeparator = !/[,.;]$/.test(value.trim());
        const separator = needsSeparator ? ', ' : ' ';
        onChange(value + separator + sugestao);
      }
    } else {
      // Comportamento original - substitui o texto
      onChange(sugestao);
    }
  };

  return (
    <div className="space-y-2">
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="min-h-[80px]"
      />
      <div className="flex flex-wrap gap-2">
        {sugestoes.map((sugestao) => (
          <Button
            key={sugestao}
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleSugestaoClick(sugestao)}
            className="text-xs hover:bg-purple-50 hover:border-purple-300"
          >
            {allowMultiple ? '+ ' : ''}{sugestao}
          </Button>
        ))}
      </div>
      {allowMultiple && (
        <p className="text-xs text-gray-500">
          💡 Clique nas sugestões para adicionar ao texto. Você pode combinar múltiplas opções.
        </p>
      )}
    </div>
  );
};

export default SugestoesInput;
