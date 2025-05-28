
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface PersonalizacaoIA {
  id?: string;
  link_publico: string;
  tipo_cerimonia?: string;
  tom_conversa?: string;
  tags_emocao?: string[];
  momento_especial?: string;
  incluir_votos?: boolean;
  incluir_aliancas?: boolean;
  linguagem_celebrante?: string;
  contexto_cultural?: string;
  observacoes_adicionais?: string;
}

export const usePersonalizacaoIA = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const buscarPersonalizacao = async (linkPublico: string): Promise<PersonalizacaoIA | null> => {
    try {
      const { data, error } = await supabase
        .from('personalizacoes_ia')
        .select('*')
        .eq('link_publico', linkPublico)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao buscar personalização:', error);
      return null;
    }
  };

  const salvarPersonalizacao = async (personalizacao: PersonalizacaoIA): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('personalizacoes_ia')
        .upsert({
          link_publico: personalizacao.link_publico,
          tipo_cerimonia: personalizacao.tipo_cerimonia,
          tom_conversa: personalizacao.tom_conversa,
          tags_emocao: personalizacao.tags_emocao,
          momento_especial: personalizacao.momento_especial,
          incluir_votos: personalizacao.incluir_votos,
          incluir_aliancas: personalizacao.incluir_aliancas,
          linguagem_celebrante: personalizacao.linguagem_celebrante,
          contexto_cultural: personalizacao.contexto_cultural,
          observacoes_adicionais: personalizacao.observacoes_adicionais
        }, {
          onConflict: 'link_publico'
        });

      if (error) throw error;

      toast({
        title: "Personalização salva!",
        description: "As preferências foram salvas com sucesso.",
      });

      return true;
    } catch (error) {
      console.error('Erro ao salvar personalização:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as personalizações.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    buscarPersonalizacao,
    salvarPersonalizacao
  };
};
