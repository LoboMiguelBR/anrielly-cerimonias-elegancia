
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Heart, Users, Copy, RefreshCw } from "lucide-react";
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface QuestionarioCompleto {
  id: string;
  link_publico: string;
  nome_responsavel: string;
  email: string;
  status: string;
  respostas_json: Record<string, string>;
  total_perguntas_resp: number;
  historia_gerada?: string;
}

interface HistoriaCasal {
  link_publico: string;
  questionarios: QuestionarioCompleto[];
  historia_gerada?: string;
  podeGerar: boolean;
}

const HistoriasCasaisManager = () => {
  const [historiasCasais, setHistoriasCasais] = useState<HistoriaCasal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const [viewingHistory, setViewingHistory] = useState<HistoriaCasal | null>(null);

  const fetchHistoriasCasais = async () => {
    try {
      const { data, error } = await supabase
        .from('questionarios_noivos')
        .select('*')
        .order('data_criacao', { ascending: false });

      if (error) throw error;

      // Agrupar por link_publico
      const grupos = data.reduce((acc: Record<string, QuestionarioCompleto[]>, item) => {
        if (!acc[item.link_publico]) {
          acc[item.link_publico] = [];
        }
        acc[item.link_publico].push({
          id: item.id,
          link_publico: item.link_publico,
          nome_responsavel: item.nome_responsavel,
          email: item.email,
          status: item.status || 'rascunho',
          respostas_json: item.respostas_json as Record<string, string> || {},
          total_perguntas_resp: item.total_perguntas_resp || 0,
          historia_gerada: item.historia_gerada || undefined
        });
        return acc;
      }, {});

      // Converter para array de HistoriaCasal
      const historias: HistoriaCasal[] = Object.entries(grupos).map(([link_publico, questionarios]) => {
        // Verificar se ambos questionários estão preenchidos (pelo menos 80% das perguntas)
        const questionariosCompletos = questionarios.filter(q => 
          q.total_perguntas_resp >= 38 && // pelo menos 38 de 48 perguntas
          (q.status === 'preenchido' || q.status === 'concluido')
        );

        const podeGerar = questionariosCompletos.length >= 2;
        
        // Pegar história de qualquer um dos questionários (elas devem ser iguais)
        const historiaExistente = questionarios.find(q => q.historia_gerada)?.historia_gerada;

        return {
          link_publico,
          questionarios,
          historia_gerada: historiaExistente,
          podeGerar
        };
      });

      setHistoriasCasais(historias);
    } catch (error) {
      console.error('Error fetching historias:', error);
      toast.error('Erro ao carregar histórias dos casais');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistoriasCasais();
  }, []);

  const gerarHistoriaCasal = async (historia: HistoriaCasal) => {
    if (!historia.podeGerar) {
      toast.error('Ambos os questionários precisam estar completos para gerar a história');
      return;
    }

    setIsGenerating(historia.link_publico);
    
    try {
      // Combinar respostas de ambos os noivos
      const respostasCombinadas = historia.questionarios
        .filter(q => q.total_perguntas_resp >= 38)
        .slice(0, 2) // Pegar apenas os 2 primeiros completos
        .map(q => ({
          nome: q.nome_responsavel,
          email: q.email,
          respostas: q.respostas_json
        }));

      if (respostasCombinadas.length < 2) {
        toast.error('É necessário ter pelo menos 2 questionários completos');
        return;
      }

      const { data, error } = await supabase.functions.invoke('gerar-historia-casal', {
        body: {
          link_publico: historia.link_publico,
          noivos: respostasCombinadas
        }
      });

      if (error) throw error;

      if (data.success) {
        toast.success('História do casal gerada com sucesso!');
        fetchHistoriasCasais(); // Recarregar dados
      } else {
        toast.error(data.error || 'Erro ao gerar história');
      }
    } catch (error) {
      console.error('Error generating story:', error);
      toast.error('Erro ao gerar história do casal');
    } finally {
      setIsGenerating(null);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('História copiada para a área de transferência!');
    } catch (error) {
      toast.error('Erro ao copiar texto');
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600 mx-auto mb-4"></div>
            <p>Carregando histórias dos casais...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-rose-500" />
            Histórias dos Casais (IA)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Gerencie as histórias de amor dos casais criadas automaticamente pela IA.
            A história só é gerada quando ambos os questionários estão completos.
          </p>
          
          <div className="space-y-4">
            {historiasCasais.map((historia) => (
              <Card key={historia.link_publico} className="border-l-4 border-l-rose-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <Users className="w-5 h-5 text-rose-500" />
                        <div>
                          <h3 className="font-semibold">Casal: {historia.link_publico}</h3>
                          <p className="text-sm text-gray-600">
                            {historia.questionarios.length} pessoa(s) • 
                            {historia.questionarios.filter(q => q.total_perguntas_resp >= 38).length} completo(s)
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-2">
                        {historia.historia_gerada && (
                          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                            <Sparkles className="w-3 h-3 mr-1" />
                            História Criada
                          </Badge>
                        )}
                        {historia.podeGerar && !historia.historia_gerada && (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            Pronto para Gerar
                          </Badge>
                        )}
                        {!historia.podeGerar && (
                          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                            Aguardando Questionários
                          </Badge>
                        )}
                      </div>

                      {/* Lista dos questionários */}
                      <div className="text-xs text-gray-500 space-y-1">
                        {historia.questionarios.map((q) => (
                          <div key={q.id} className="flex items-center gap-2">
                            <span className={q.total_perguntas_resp >= 38 ? 'text-green-600' : 'text-gray-400'}>
                              • {q.nome_responsavel} ({q.total_perguntas_resp}/48 perguntas)
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {historia.historia_gerada && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setViewingHistory(historia)}
                          className="text-purple-600"
                        >
                          <Sparkles className="h-4 w-4 mr-1" />
                          Ver História
                        </Button>
                      )}
                      
                      <Button
                        size="sm"
                        variant={historia.historia_gerada ? "outline" : "default"}
                        onClick={() => gerarHistoriaCasal(historia)}
                        disabled={!historia.podeGerar || isGenerating === historia.link_publico}
                        className={!historia.historia_gerada ? "bg-rose-600 hover:bg-rose-700" : ""}
                      >
                        {isGenerating === historia.link_publico ? (
                          <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                        ) : (
                          <Sparkles className="h-4 w-4 mr-1" />
                        )}
                        {historia.historia_gerada ? 'Regenerar' : 'Gerar História'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {historiasCasais.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p>Nenhum casal com questionários disponíveis ainda</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modal de Visualização da História */}
      <Dialog open={!!viewingHistory} onOpenChange={(open) => !open && setViewingHistory(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              História do Casal - {viewingHistory?.link_publico}
            </DialogTitle>
          </DialogHeader>
          {viewingHistory?.historia_gerada && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <Button
                  onClick={() => copyToClipboard(viewingHistory.historia_gerada!)}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <Copy className="h-4 w-4" />
                  Copiar
                </Button>
              </div>
              <div className="prose max-w-none">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg">
                  <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {viewingHistory.historia_gerada}
                  </p>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                <p>✨ História gerada automaticamente com Inteligência Artificial</p>
                <p>📝 Baseada nas respostas dos questionários de ambos os noivos</p>
                <p>🔒 Visível apenas para administradores</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HistoriasCasaisManager;
