
import { useState, useEffect } from 'react';
import { useQuestionarios } from '@/hooks/useQuestionarios';
import QuestionarioCreateFormEnhanced from './components/QuestionarioCreateFormEnhanced';
import QuestionarioGroup from './components/QuestionarioGroup';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const QuestionariosTab = () => {
  const { questionarios, isLoading, refetch } = useQuestionarios();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredQuestionarios = questionarios.filter(q => 
    q.link_publico.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.nome_responsavel.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleQuestionarioCreated = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Questionários dos Noivos</h2>
        <p className="text-gray-600">Gerencie questionários, visualize respostas e crie eventos vinculados</p>
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
          <QuestionarioGroup 
            questionarios={filteredQuestionarios}
            onUpdate={refetch}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default QuestionariosTab;
