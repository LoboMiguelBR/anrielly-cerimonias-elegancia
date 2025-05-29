
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { TrendingUp, BarChart3, PieChart as PieIcon, Calendar } from 'lucide-react';

interface DadosGrafico {
  evolucaoPropostas: Array<{ mes: string; propostas: number; contratos: number }>;
  conversaoFunil: Array<{ etapa: string; quantidade: number; cor: string }>;
  origemLeads: Array<{ origem: string; quantidade: number; cor: string }>;
  receitaMensal: Array<{ mes: string; receita: number }>;
}

const GraficosBI: React.FC = () => {
  const [dados, setDados] = useState<DadosGrafico>({
    evolucaoPropostas: [],
    conversaoFunil: [],
    origemLeads: [],
    receitaMensal: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDados = async () => {
      try {
        // Evolução propostas últimos 6 meses
        const meses = [];
        const hoje = new Date();
        for (let i = 5; i >= 0; i--) {
          const data = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
          const mesInicio = new Date(data.getFullYear(), data.getMonth(), 1);
          const mesFim = new Date(data.getFullYear(), data.getMonth() + 1, 0);
          
          const { count: propostas } = await supabase
            .from('proposals')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', mesInicio.toISOString())
            .lte('created_at', mesFim.toISOString());

          const { count: contratos } = await supabase
            .from('contracts')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'signed')
            .gte('created_at', mesInicio.toISOString())
            .lte('created_at', mesFim.toISOString());

          meses.push({
            mes: data.toLocaleDateString('pt-BR', { month: 'short' }),
            propostas: propostas || 0,
            contratos: contratos || 0
          });
        }

        // Dados do funil de conversão
        const { count: totalLeads } = await supabase
          .from('quote_requests')
          .select('*', { count: 'exact', head: true });

        const { count: totalPropostas } = await supabase
          .from('proposals')
          .select('*', { count: 'exact', head: true });

        const { count: totalContratos } = await supabase
          .from('contracts')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'signed');

        const funil = [
          { etapa: 'Leads', quantidade: totalLeads || 0, cor: '#3B82F6' },
          { etapa: 'Propostas', quantidade: totalPropostas || 0, cor: '#8B5CF6' },
          { etapa: 'Contratos', quantidade: totalContratos || 0, cor: '#10B981' }
        ];

        // Origem dos leads (simulado - pode ser implementado com campo específico)
        const origens = [
          { origem: 'Instagram', quantidade: Math.floor((totalLeads || 0) * 0.4), cor: '#E1306C' },
          { origem: 'WhatsApp', quantidade: Math.floor((totalLeads || 0) * 0.3), cor: '#25D366' },
          { origem: 'Site', quantidade: Math.floor((totalLeads || 0) * 0.2), cor: '#3B82F6' },
          { origem: 'Indicação', quantidade: Math.floor((totalLeads || 0) * 0.1), cor: '#F59E0B' }
        ];

        // Receita mensal
        const receitaMeses = [];
        for (let i = 5; i >= 0; i--) {
          const data = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
          const mesInicio = new Date(data.getFullYear(), data.getMonth(), 1);
          const mesFim = new Date(data.getFullYear(), data.getMonth() + 1, 0);
          
          const { data: contratos } = await supabase
            .from('contracts')
            .select('total_price')
            .eq('status', 'signed')
            .gte('created_at', mesInicio.toISOString())
            .lte('created_at', mesFim.toISOString());

          const receita = contratos?.reduce((sum, c) => sum + (c.total_price || 0), 0) || 0;

          receitaMeses.push({
            mes: data.toLocaleDateString('pt-BR', { month: 'short' }),
            receita
          });
        }

        setDados({
          evolucaoPropostas: meses,
          conversaoFunil: funil,
          origemLeads: origens,
          receitaMensal: receitaMeses
        });

      } catch (error) {
        console.error('Erro ao buscar dados dos gráficos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDados();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="shadow-lg border-0">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
                <div className="h-64 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Evolução de Propostas */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
            Evolução de Propostas vs Contratos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dados.evolucaoPropostas}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="propostas" 
                  stroke="#8B5CF6" 
                  strokeWidth={2}
                  name="Propostas"
                />
                <Line 
                  type="monotone" 
                  dataKey="contratos" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  name="Contratos"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Funil de Conversão */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-purple-600" />
            Funil de Conversão
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dados.conversaoFunil}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="etapa" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="quantidade" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Origem dos Leads */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
            <PieIcon className="h-5 w-5 mr-2 text-green-600" />
            Origem dos Leads
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dados.origemLeads}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="quantidade"
                  label={({ origem, quantidade }) => `${origem}: ${quantidade}`}
                >
                  {dados.origemLeads.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.cor} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Receita Mensal */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-orange-600" />
            Receita Mensal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dados.receitaMensal}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
                <YAxis 
                  tick={{ fontSize: 12 }} 
                  tickFormatter={(value) => formatCurrency(value)}
                />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Bar dataKey="receita" fill="#F59E0B" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GraficosBI;
