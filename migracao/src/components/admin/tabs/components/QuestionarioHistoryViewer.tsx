
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, FileText, Copy } from "lucide-react";
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface QuestionarioHistoryViewerProps {
  questionarioId: string;
  nomeResponsavel: string;
}

const QuestionarioHistoryViewer = ({ questionarioId, nomeResponsavel }: QuestionarioHistoryViewerProps) => {
  const [historia, setHistoria] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchHistoria = async () => {
      try {
        const { data, error } = await supabase
          .from('questionarios_noivos')
          .select('historia_gerada, historia_processada')
          .eq('id', questionarioId)
          .single();

        if (error) {
          console.error('Error fetching historia:', error);
          return;
        }

        if (data?.historia_gerada) {
          setHistoria(data.historia_gerada);
        }
      } catch (error) {
        console.error('Error in fetchHistoria:', error);
      }
    };

    fetchHistoria();
  }, [questionarioId]);

  const copyToClipboard = async () => {
    if (!historia) return;
    
    try {
      await navigator.clipboard.writeText(historia);
      toast.success('História copiada para a área de transferência!');
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      toast.error('Erro ao copiar texto');
    }
  };

  const regenerateStory = async () => {
    setIsLoading(true);
    try {
      // Chamar edge function para reprocessar
      const { data, error } = await supabase.functions.invoke('enviar-email-questionario', {
        body: {
          questionarioId,
          tipo: 'finalizacao'
        }
      });

      if (error) {
        throw error;
      }

      if (data.historia_gerada) {
        toast.success('História regenerada com sucesso!');
        // Recarregar história
        setTimeout(() => window.location.reload(), 1000);
      } else {
        toast.info('Não foi possível regenerar a história no momento');
      }
    } catch (error) {
      console.error('Error regenerating story:', error);
      toast.error('Erro ao regenerar história');
    } finally {
      setIsLoading(false);
    }
  };

  if (!historia) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            História do Casal - {nomeResponsavel}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">
              História ainda não foi gerada ou questionário não foi finalizado.
            </p>
            <Button
              onClick={regenerateStory}
              disabled={isLoading}
              variant="outline"
              className="gap-2"
            >
              <Sparkles className="h-4 w-4" />
              {isLoading ? 'Gerando...' : 'Tentar Gerar História'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            História do Casal - {nomeResponsavel}
          </div>
          <div className="flex gap-2">
            <Button
              onClick={copyToClipboard}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Copy className="h-4 w-4" />
              Copiar
            </Button>
            <Button
              onClick={regenerateStory}
              disabled={isLoading}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Sparkles className="h-4 w-4" />
              {isLoading ? 'Regenerando...' : 'Regenerar'}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose max-w-none">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg">
            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
              {historia}
            </p>
          </div>
        </div>
        <div className="mt-4 text-xs text-gray-500">
          <p>✨ História gerada automaticamente com Inteligência Artificial</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionarioHistoryViewer;
