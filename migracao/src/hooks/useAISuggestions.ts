
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AIContext {
  event_type?: string;
  client_name?: string;
  template_type?: string;
  service_description?: string;
}

export const useAISuggestions = () => {
  const [isLoading, setIsLoading] = useState(false);

  const generateSuggestion = async (
    type: 'contract_text' | 'email_template' | 'budget_description',
    context: AIContext = {}
  ): Promise<string | null> => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('ai-content-suggestions', {
        body: { type, context }
      });

      if (error) {
        console.error('Error calling AI function:', error);
        toast.error('Erro ao gerar sugestão com IA');
        return null;
      }

      if (!data.success) {
        toast.error(data.error || 'Erro ao gerar conteúdo');
        return null;
      }

      toast.success('Sugestão gerada com sucesso!');
      return data.content;
    } catch (error) {
      console.error('Error generating AI suggestion:', error);
      toast.error('Erro inesperado ao gerar sugestão');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    generateSuggestion,
    isLoading
  };
};
