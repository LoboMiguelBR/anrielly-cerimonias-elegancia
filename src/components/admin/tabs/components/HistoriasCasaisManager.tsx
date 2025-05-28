
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, RefreshCw, Sparkles, Users, Calendar, Heart } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import QuestionarioHistoryViewer from './QuestionarioHistoryViewer';
import ModalPersonalizacao from './ModalPersonalizacao';
import { usePersonalizacaoIA } from '@/hooks/usePersonalizacaoIA';

interface QuestionarioCasal {
  id: string;
  link_publico: string;
  nome_responsavel: string;
  email: string;
  status: string;
  historia_gerada: string | null;
  historia_processada: boolean;
  data_criacao: string;
  data_atualizacao: string;
  total_perguntas_resp: number;
  respostas_json: Record<string, string>;
  temPersonalizacao?: boolean;
}

const HistoriasCasaisManager = () => {
  const [casais, setCasais] = useState<QuestionarioCasal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState<string | null>(null);
  const [showPersonalizacao, setShowPersonalizacao] = useState<string | null>(null);
  const { toast } = useToast();
  const { buscarPersonalizacao } = usePersonalizacaoIA();

  useEffect(() => {
    carregarCasais();
  }, []);

  const carregarCasais = async () => {
    try {
      const { data, error } = await supabase
        .from('questionarios_noivos')
        .select('*')
        .eq('status', 'preenchido')
        .order('data_atualizacao', { ascending: false });

      if (error) throw error;

      // Verificar quais casais têm personalização
      const casaisComPersonalizacao = await Promise.all(
        (data || []).map(async (casal) => {
          const personalizacao = await buscarPersonalizacao(casal.link_publico);
          return {
            ...casal,
            temPersonalizacao: !!personalizacao
          };
        })
      );

      setCasais(casaisComPersonalizacao);
    } catch (error) {
      console.error('Erro ao carregar casais:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar a lista de casais.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const gerarHistoria = async (linkPublico: string) => {
    setIsGenerating(linkPublico);
    
    try {
      // Buscar todos os questionários deste casal
      const { data: questionarios, error } = await supabase
        .from('questionarios_noivos')
        .select('nome_responsavel, email, respostas_json')
        .eq('link_publico', linkPublico)
        .eq('status', 'preenchido');

      if (error) throw error;

      if (!questionarios || questionarios.length < 2) {
        toast({
          title: "Questionários insuficientes",
          description: "São necessários pelo menos 2 questionários completos para gerar a história.",
          variant: "destructive"
        });
        return;
      }

      // Chamar a Edge Function para gerar a história
      const { data: result, error: functionError } = await supabase.functions.invoke('gerar-historia-casal', {
        body: {
          link_publico: linkPublico,
          noivos: questionarios.map(q => ({
            nome: q.nome_responsavel,
            email: q.email,
            respostas: q.respostas_json
          }))
        }
      });

      if (functionError) throw functionError;

      if (result.success) {
        toast({
          title: "História gerada com sucesso!",
          description: result.message,
        });
        carregarCasais(); // Recarregar para mostrar a nova história
      } else {
        throw new Error(result.error || 'Erro desconhecido');
      }

    } catch (error) {
      console.error('Erro ao gerar história:', error);
      toast({
        title: "Erro ao gerar história",
        description: "Não foi possível gerar a história do casal.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(null);
    }
  };

  const obterCasalPorLink = (linkPublico: string) => {
    return casais.find(casal => casal.link_publico === linkPublico);
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'preenchido': return 'bg-green-100 text-green-800';
      case 'rascunho': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const groupedCasais = casais.reduce((acc, casal) => {
    if (!acc[casal.link_publico]) {
      acc[casal.link_publico] = [];
    }
    acc[casal.link_publico].push(casal);
    return acc;
  }, {} as Record<string, QuestionarioCasal[]>);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando histórias dos casais...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Histórias dos Casais (IA)</h2>
          <p className="text-gray-600">Gerencie e visualize as histórias criadas pela IA</p>
        </div>
        <Button onClick={carregarCasais} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Atualizar
        </Button>
      </div>

      <div className="grid gap-6">
        {Object.entries(groupedCasais).map(([linkPublico, casalGroup]) => {
          const primeiroDoGrupo = casalGroup[0];
          const temHistoria = primeiroDoGrupo.historia_gerada;
          const temPersonalizacao = primeiroDoGrupo.temPersonalizacao;
          
          return (
            <Card key={linkPublico} className="relative">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Heart className="w-5 h-5 text-rose-500" />
                    <div>
                      <CardTitle className="text-lg">
                        Casal: {linkPublico.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className={getStatusColor(primeiroDoGrupo.status)}>
                          {primeiroDoGrupo.status}
                        </Badge>
                        {temPersonalizacao && (
                          <Badge variant="outline" className="bg-purple-100 text-purple-800">
                            🎨 Personalizado
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{casalGroup.length} questionário(s)</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {casalGroup.map((casal) => (
                      <div key={casal.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="font-medium text-gray-900">{casal.nome_responsavel}</div>
                        <div className="text-sm text-gray-600">{casal.email}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {casal.total_perguntas_resp} respostas • Atualizado em {formatarData(casal.data_atualizacao)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {temHistoria && (
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <Sparkles className="w-4 h-4 text-green-600" />
                        <span className="font-medium text-green-800">História Gerada</span>
                      </div>
                      <p className="text-sm text-green-700 line-clamp-3">
                        {primeiroDoGrupo.historia_gerada?.substring(0, 200)}...
                      </p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowPersonalizacao(linkPublico)}
                    >
                      🎨 Personalizar
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => gerarHistoria(linkPublico)}
                      disabled={isGenerating === linkPublico || casalGroup.length < 2}
                    >
                      {isGenerating === linkPublico ? (
                        <>
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current mr-2" />
                          Gerando...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-3 h-3 mr-2" />
                          {temHistoria ? 'Regenerar' : 'Gerar'} História
                        </>
                      )}
                    </Button>

                    {temHistoria && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowHistory(linkPublico)}
                      >
                        <Eye className="w-3 h-3 mr-2" />
                        Ver História
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {Object.keys(groupedCasais).length === 0 && (
        <div className="text-center py-12">
          <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum casal encontrado</h3>
          <p className="text-gray-600">Aguarde os casais preencherem seus questionários para gerar as histórias.</p>
        </div>
      )}

      {/* Modal de Visualização da História */}
      {showHistory && (
        <QuestionarioHistoryViewer
          isOpen={!!showHistory}
          onClose={() => setShowHistory(null)}
          questionario={obterCasalPorLink(showHistory)}
        />
      )}

      {/* Modal de Personalização */}
      {showPersonalizacao && (
        <ModalPersonalizacao
          isOpen={!!showPersonalizacao}
          onClose={() => setShowPersonalizacao(null)}
          linkPublico={showPersonalizacao}
          onPersonalizacaoSalva={carregarCasais}
        />
      )}
    </div>
  );
};

export default HistoriasCasaisManager;
