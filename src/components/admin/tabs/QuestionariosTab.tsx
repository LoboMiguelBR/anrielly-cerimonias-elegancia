import { useState, useEffect } from 'react';
import { useQuestionarios } from '@/hooks/useQuestionarios';
import QuestionarioCreateFormEnhanced from './components/QuestionarioCreateFormEnhanced';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { usePersonalizacaoIA } from '@/hooks/usePersonalizacaoIA';
import ModalPersonalizacao from './components/ModalPersonalizacao';
import QuestionarioHistoryModal from './components/QuestionarioHistoryModal';
import CasalCard from './components/CasalCard';
import HistoriasCasaisEmptyState from './components/HistoriasCasaisEmptyState';
import { QuestionarioCasal } from './types/questionario';

const QuestionariosTab = () => {
  const { questionarios, isLoading, refetch } = useQuestionarios();
  const [searchTerm, setSearchTerm] = useState('');
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState<string | null>(null);
  const [showPersonalizacao, setShowPersonalizacao] = useState<string | null>(null);
  const { toast } = useToast();
  const { buscarPersonalizacao } = usePersonalizacaoIA();

  // Convert Questionario to QuestionarioCasal format
  const questionariosExtended: QuestionarioCasal[] = questionarios.map(q => ({
    ...q,
    historia_gerada: q.historia_gerada || null,
    historia_processada: q.historia_processada || false,
    senha_hash: q.senha_hash || '',
    status: q.status || 'rascunho'
  }));

  const filteredQuestionarios = questionariosExtended.filter(q => 
    q.link_publico.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.nome_responsavel.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleQuestionarioCreated = () => {
    refetch();
  };

  const handleRefresh = () => {
    refetch();
  };

  const gerarHistoria = async (linkPublico: string) => {
    setIsGenerating(linkPublico);
    
    try {
      // Buscar todos os questionários deste casal
      const { data: questionariosData, error } = await supabase
        .from('questionarios_noivos')
        .select('nome_responsavel, email, respostas_json')
        .eq('link_publico', linkPublico)
        .eq('status', 'preenchido');

      if (error) throw error;

      if (!questionariosData || questionariosData.length < 2) {
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
          noivos: questionariosData.map(q => ({
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
        refetch();
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

  const obterCasalPorLink = (linkPublico: string): QuestionarioCasal | undefined => {
    return questionariosExtended.find(casal => casal.link_publico === linkPublico);
  };

  // Agrupar questionários por link_publico
  const groupedCasais = filteredQuestionarios.reduce((acc, casal) => {
    if (!acc[casal.link_publico]) {
      acc[casal.link_publico] = [];
    }
    acc[casal.link_publico].push(casal);
    return acc;
  }, {} as Record<string, QuestionarioCasal[]>);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Questionários dos Noivos</h2>
          <p className="text-gray-600">Gerencie questionários, visualize respostas e crie eventos vinculados</p>
        </div>
        <Button onClick={handleRefresh} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Atualizar
        </Button>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList>
          <TabsTrigger value="list">Lista de Questionários</TabsTrigger>
          <TabsTrigger value="create">Criar Novo</TabsTrigger>
        </TabsList>
        
        <TabsContent value="create">
          <QuestionarioCreateFormEnhanced onQuestionarioCreated={handleQuestionarioCreated} />
        </TabsContent>
        
        <TabsContent value="list">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar por link, nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {Object.keys(groupedCasais).length === 0 ? (
              <HistoriasCasaisEmptyState />
            ) : (
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
            )}
          </div>
        </TabsContent>
      </Tabs>

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
          onPersonalizacaoSalva={refetch}
        />
      )}
    </div>
  );
};

export default QuestionariosTab;
