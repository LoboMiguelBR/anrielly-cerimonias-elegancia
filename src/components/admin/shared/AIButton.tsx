
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { useAISuggestions } from "@/hooks/useAISuggestions";

interface AIButtonProps {
  type: 'contract_text' | 'email_template' | 'budget_description';
  context?: {
    event_type?: string;
    client_name?: string;
    template_type?: string;
    service_description?: string;
  };
  onSuggestion: (content: string) => void;
  label?: string;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'outline' | 'secondary';
}

const AIButton = ({ 
  type, 
  context = {}, 
  onSuggestion, 
  label = "✨ Sugerir com IA",
  size = 'sm',
  variant = 'outline'
}: AIButtonProps) => {
  const { generateSuggestion, isLoading } = useAISuggestions();

  const handleClick = async () => {
    const suggestion = await generateSuggestion(type, context);
    if (suggestion) {
      onSuggestion(suggestion);
    }
  };

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={handleClick}
      disabled={isLoading}
      className="gap-2"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Sparkles className="h-4 w-4" />
      )}
      {label}
    </Button>
  );
};

export default AIButton;
