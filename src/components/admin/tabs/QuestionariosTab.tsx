
import { useState, useEffect } from 'react';
import { useQuestionarios } from '@/hooks/useQuestionarios';
import QuestionarioCreateFormEnhanced from './components/QuestionarioCreateFormEnhanced';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

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
            
            {filteredQuestionarios.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {searchTerm ? 'Nenhum questionário encontrado para esta busca.' : 'Nenhum questionário criado ainda.'}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredQuestionarios.map((questionario) => (
                  <div key={questionario.id} className="border rounded-lg p-4 bg-white">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{questionario.link_publico}</h3>
                        <p className="text-sm text-gray-600">{questionario.nome_responsavel} - {questionario.email}</p>
                        <p className="text-xs text-gray-500">Status: {questionario.status}</p>
                      </div>
                      <div className="text-sm text-gray-500">
                        {questionario.total_perguntas_resp || 0} respostas
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default QuestionariosTab;
