
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClipboardList, Sparkles } from 'lucide-react';
import HistoriasCasaisManager from './components/HistoriasCasaisManager';

const QuestionariosTab = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Questionários</h2>
          <p className="text-gray-600">Gerencie questionários e histórias dos casais</p>
        </div>
      </div>

      <Tabs defaultValue="questionarios" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="questionarios" className="flex items-center gap-2">
            <ClipboardList className="w-4 h-4" />
            Questionários
          </TabsTrigger>
          <TabsTrigger value="historias" className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Histórias dos Casais
          </TabsTrigger>
        </TabsList>

        <TabsContent value="questionarios">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciar Questionários</CardTitle>
              <CardDescription>
                Visualize e gerencie os questionários preenchidos pelos casais
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <ClipboardList className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">
                  Funcionalidade de gerenciamento de questionários será implementada aqui.
                </p>
                <Button variant="outline">
                  Ver Questionários
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="historias">
          <HistoriasCasaisManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default QuestionariosTab;
