
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import ModalPersonalizacao from './ModalPersonalizacao';
import { usePersonalizacaoIA } from '@/hooks/usePersonalizacaoIA';
import QuestionarioHistoryModal from './QuestionarioHistoryModal';
import HistoriasCasaisHeader from './HistoriasCasaisHeader';
import HistoriasCasaisEmptyState from './HistoriasCasaisEmptyState';
import CasalCard from './CasalCard';
import { QuestionarioCasal } from '../types/questionario';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const HistoriasCasaisManager = () => {
  const [casais, setCasais] = useState<QuestionarioCasal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState<string | null>(null);
  const [showPersonalizacao, setShowPersonalizacao] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { buscarPersonalizacao } = usePersonalizacaoIA();

  useEffect(() => {
    carregarCasais();
  }, []);

  const carregarCasais = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Verificar autenticação
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setError('Você precisa estar logado para ver as histórias dos casais.');
        return;
      }

      const { data, error } = await supabase
        .from('questionarios_noivos')
        .select('*')
        .eq('status', 'preenchido')
        .order('data_atualizacao', { ascending: false });

      if (error) {
        console.error('Erro ao carregar casais:', error);
        setError('Erro ao carregar dados: ' + error.message);
        return;
      }

      // Verificar quais casais têm personalização
      const casaisComPersonalizacao = await Promise.all(
        (data || []).map(async (casal) => {
          try {
            const personalizacao = await buscarPersonalizacao(casal.link_publico);
            return {
              ...casal,
              temPersonalizacao: !!personalizacao
            };
          } catch (error) {
            console.warn('Erro ao buscar personalização para', casal.link_publico, error);
            return {
              ...casal,
              temPersonalizacao: false
            };
          }
        })
      );

      setCasais(casaisComPersonalizacao);
    } catch (error: any) {
      console.error('Erro inesperado ao carregar casais:', error);
      setError('Erro inesperado ao carregar dados');
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
            respostas: q.respostas_json as Record<string, string> || {}
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

    } catch (error: any) {
      console.error('Erro ao gerar história:', error);
      toast({
        title: "Erro ao gerar história",
        description: error.message || "Não foi possível gerar a história do casal.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(null);
    }
  };

  const obterCasalPorLink = (linkPublico: string): QuestionarioCasal | undefined => {
    return casais.find(casal => casal.link_publico === linkPublico);
  };

  if (error) {
    return (
      <div className="space-y-6">
        <HistoriasCasaisHeader onRefresh={carregarCasais} />
        <Card>
          <CardContent className="p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Erro ao Carregar</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={carregarCasais}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Tentar Novamente
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600 mx-auto" />
          <p className="mt-2 text-gray-600">Carregando histórias dos casais...</p>
        </div>
      </div>
    );
  }

  const groupedCasais = casais.reduce((acc, casal) => {
    if (!acc[casal.link_publico]) {
      acc[casal.link_publico] = [];
    }
    acc[casal.link_publico].push(casal);
    return acc;
  }, {} as Record<string, QuestionarioCasal[]>);

  return (
    <div className="space-y-6">
      <HistoriasCasaisHeader onRefresh={carregarCasais} />

      <div className="grid gap-6">
        {Object.entries(groupedCasais).map(([linkPublico, casalGroup]) => (
          <CasalCard
            key={linkPublico}
            linkPublico={linkPublico}
            casalGroup={casalGroup}
            isGenerating={isGenerating}
            onPersonalizacao={setShowPersonalizacao}
            onGerarHistoria={gerarHistoria}
            onVerHistoria={setShowHistory}
          />
        ))}
      </div>

      {Object.keys(groupedCasais).length === 0 && <HistoriasCasaisEmptyState />}

      {/* Modal de Visualização da História */}
      {showHistory && (
        <QuestionarioHistoryModal
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
