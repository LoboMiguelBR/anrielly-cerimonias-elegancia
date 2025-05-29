
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DashboardMetrics {
  leadsNovosMes: number;
  orcamentosPendentes: number;
  contratosAssinados: number;
  valorTotalPropostas: number;
  taxaConversao: number;
  crescimentoMensal: number;
}

interface InsightIA {
  id: string;
  categoria: 'performance' | 'oportunidade' | 'alerta' | 'tendencia';
  titulo: string;
  descricao: string;
  impacto: 'alto' | 'medio' | 'baixo';
  acao_sugerida?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { metrics }: { metrics: DashboardMetrics } = await req.json();
    
    console.log('Gerando insights para métricas:', metrics);

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key não configurada');
    }

    // Monta prompt para análise inteligente
    const prompt = `
Você é um consultor de negócios especializado em empresas de eventos e casamentos.
Analise os dados abaixo e gere entre 3-5 insights acionáveis sobre o desempenho do negócio:

DADOS DO NEGÓCIO:
- Leads novos este mês: ${metrics.leadsNovosMes}
- Orçamentos pendentes: ${metrics.orcamentosPendentes}
- Contratos assinados: ${metrics.contratosAssinados}
- Valor total em propostas: R$ ${metrics.valorTotalPropostas.toLocaleString('pt-BR')}
- Taxa de conversão: ${metrics.taxaConversao.toFixed(1)}%
- Crescimento mensal: ${metrics.crescimentoMensal.toFixed(1)}%

REGRAS:
1. Gere insights específicos e acionáveis
2. Identifique oportunidades de melhoria
3. Destaque pontos de atenção
4. Sugira ações práticas
5. Use linguagem clara e objetiva
6. Foque no impacto para o negócio

FORMATO DE RESPOSTA (JSON):
{
  "insights": [
    {
      "id": "insight_1",
      "categoria": "performance|oportunidade|alerta|tendencia",
      "titulo": "Título claro e direto",
      "descricao": "Análise detalhada do insight",
      "impacto": "alto|medio|baixo",
      "acao_sugerida": "Ação específica recomendada"
    }
  ]
}
`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Você é um consultor de negócios especializado em empresas de eventos. Sempre responda em JSON válido no formato solicitado.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const openAIData = await response.json();
    const aiResponse = openAIData.choices[0].message.content;

    console.log('Resposta da OpenAI:', aiResponse);

    // Parse da resposta JSON
    let insights: InsightIA[] = [];
    try {
      const parsedResponse = JSON.parse(aiResponse);
      insights = parsedResponse.insights || [];
    } catch (parseError) {
      console.error('Erro ao fazer parse da resposta:', parseError);
      
      // Fallback com insights básicos
      insights = [
        {
          id: 'insight_conversao',
          categoria: metrics.taxaConversao < 20 ? 'alerta' : 'performance',
          titulo: metrics.taxaConversao < 20 ? 'Taxa de conversão baixa' : 'Boa taxa de conversão',
          descricao: `Sua taxa de conversão atual é de ${metrics.taxaConversao.toFixed(1)}%. ${
            metrics.taxaConversao < 20 
              ? 'Isso indica oportunidade de melhoria no processo de vendas.'
              : 'Isso está acima da média do setor.'
          }`,
          impacto: metrics.taxaConversao < 20 ? 'alto' : 'medio',
          acao_sugerida: metrics.taxaConversao < 20 
            ? 'Revisar processo de follow-up e personalização das propostas'
            : 'Manter estratégia atual e documentar boas práticas'
        },
        {
          id: 'insight_crescimento',
          categoria: metrics.crescimentoMensal > 0 ? 'tendencia' : 'alerta',
          titulo: metrics.crescimentoMensal > 0 ? 'Crescimento positivo' : 'Queda na geração de leads',
          descricao: `${metrics.crescimentoMensal > 0 ? 'Aumento' : 'Redução'} de ${Math.abs(metrics.crescimentoMensal).toFixed(1)}% na geração de leads comparado ao mês anterior.`,
          impacto: Math.abs(metrics.crescimentoMensal) > 20 ? 'alto' : 'medio',
          acao_sugerida: metrics.crescimentoMensal > 0 
            ? 'Intensificar estratégias que estão funcionando'
            : 'Revisar canais de marketing e campanhas de divulgação'
        }
      ];
    }

    // Garante que todos os insights têm ID único
    insights = insights.map((insight, index) => ({
      ...insight,
      id: insight.id || `insight_${index + 1}_${Date.now()}`
    }));

    console.log('Insights gerados:', insights);

    return new Response(
      JSON.stringify({ 
        success: true, 
        insights,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
      }
    );

  } catch (error) {
    console.error('Erro na função dashboard-ai-insights:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        insights: []
      }),
      {
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
      }
    );
  }
};

serve(handler);
