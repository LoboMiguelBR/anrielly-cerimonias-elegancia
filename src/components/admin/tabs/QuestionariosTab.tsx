
import { useState } from 'react';
import { useQuestionarios } from '@/hooks/useQuestionarios';
import { useQuestionariosLogic } from '@/hooks/useQuestionariosLogic';
import QuestionarioCreateFormEnhanced from './components/QuestionarioCreateFormEnhanced';
import QuestionariosHeader from './components/QuestionariosHeader';
import QuestionariosSearch from './components/QuestionariosSearch';
import QuestionariosListContent from './components/QuestionariosListContent';
import ModalPersonalizacao from './components/ModalPersonalizacao';
import QuestionarioHistoryModal from './components/QuestionarioHistoryModal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QuestionarioCasal } from './types/questionario';

const QuestionariosTab = () => {
  const { questionarios, isLoading, refetch } = useQuestionarios();
  const [searchTerm, setSearchTerm] = useState('');
  
  const {
    isGenerating,
    showHistory,
    showPersonalizacao,
    setShowHistory,
    setShowPersonalizacao,
    gerarHistoria,
    obterCasalPorLink
  } = useQuestionariosLogic(refetch);

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
      <QuestionariosHeader onRefresh={refetch} />

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
            <QuestionariosSearch 
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />
            
            <QuestionariosListContent
              groupedCasais={groupedCasais}
              isGenerating={isGenerating}
              onPersonalizacao={setShowPersonalizacao}
              onGerarHistoria={gerarHistoria}
              onVerHistoria={setShowHistory}
            />
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal de Visualização da História */}
      {showHistory && (
        <QuestionarioHistoryModal
          isOpen={!!showHistory}
          onClose={() => setShowHistory(null)}
          questionario={obterCasalPorLink(questionariosExtended, showHistory)}
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
