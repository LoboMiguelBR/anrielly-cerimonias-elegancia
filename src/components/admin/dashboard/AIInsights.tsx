
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, RefreshCw, TrendingUp, AlertTriangle, Lightbulb } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface InsightIA {
  id: string;
  categoria: 'performance' | 'oportunidade' | 'alerta' | 'tendencia';
  titulo: string;
  descricao: string;
  impacto: 'alto' | 'medio' | 'baixo';
  acao_sugerida?: string;
}

interface AIInsightsProps {
  metrics: {
    leadsNovosMes: number;
    orcamentosPendentes: number;
    contratosAssinados: number;
    valorTotalPropostas: number;
    taxaConversao: number;
    crescimentoMensal: number;
  };
}

const AIInsights: React.FC<AIInsightsProps> = ({ metrics }) => {
  const [insights, setInsights] = useState<InsightIA[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastGenerated, setLastGenerated] = useState<Date | null>(null);

  const generateInsights = async () => {
    setIsGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('dashboard-ai-insights', {
        body: {
          metrics: metrics,
          timestamp: new Date().toISOString()
        }
      });

      if (error) {
        console.error('Erro ao gerar insights:', error);
        toast.error('Erro ao gerar insights de IA');
        return;
      }

      if (data?.insights) {
        setInsights(data.insights);
        setLastGenerated(new Date());
        toast.success('Insights gerados com sucesso!');
      }

    } catch (error) {
      console.error('Erro na requisição:', error);
      toast.error('Erro ao conectar com o serviço de IA');
    } finally {
      setIsGenerating(false);
    }
  };

  const getCategoriaIcon = (categoria: string) => {
    switch (categoria) {
      case 'performance': return <TrendingUp className="h-4 w-4" />;
      case 'oportunidade': return <Lightbulb className="h-4 w-4" />;
      case 'alerta': return <AlertTriangle className="h-4 w-4" />;
      case 'tendencia': return <TrendingUp className="h-4 w-4" />;
      default: return <Sparkles className="h-4 w-4" />;
    }
  };

  const getCategoriaColor = (categoria: string) => {
    switch (categoria) {
      case 'performance': return 'bg-green-100 text-green-800';
      case 'oportunidade': return 'bg-blue-100 text-blue-800';
      case 'alerta': return 'bg-red-100 text-red-800';
      case 'tendencia': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getImpactoColor = (impacto: string) => {
    switch (impacto) {
      case 'alto': return 'bg-red-100 text-red-800';
      case 'medio': return 'bg-yellow-100 text-yellow-800';
      case 'baixo': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-purple-600" />
            Insights de IA
          </CardTitle>
          <Button 
            onClick={generateInsights}
            disabled={isGenerating}
            className="flex items-center gap-2"
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
            {isGenerating ? 'Gerando...' : 'Gerar Insights'}
          </Button>
        </div>
        {lastGenerated && (
          <p className="text-xs text-gray-500">
            Última atualização: {lastGenerated.toLocaleString('pt-BR')}
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.length === 0 ? (
          <div className="text-center py-8">
            <Sparkles className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              Clique em "Gerar Insights" para obter análises inteligentes dos seus dados
            </p>
          </div>
        ) : (
          insights.map((insight) => (
            <div key={insight.id} className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getCategoriaIcon(insight.categoria)}
                  <Badge variant="secondary" className={getCategoriaColor(insight.categoria)}>
                    {insight.categoria}
                  </Badge>
                  <Badge variant="outline" className={getImpactoColor(insight.impacto)}>
                    {insight.impacto} impacto
                  </Badge>
                </div>
              </div>
              
              <h4 className="font-medium text-gray-900 mb-2">{insight.titulo}</h4>
              <p className="text-sm text-gray-600 mb-3">{insight.descricao}</p>
              
              {insight.acao_sugerida && (
                <div className="bg-blue-50 border border-blue-200 rounded p-3">
                  <p className="text-sm text-blue-800">
                    <strong>Ação sugerida:</strong> {insight.acao_sugerida}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default AIInsights;
