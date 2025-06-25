
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClipboardList, Sparkles, Settings } from 'lucide-react';
import HistoriasCasaisManager from './components/HistoriasCasaisManager';
import QuestionariosManager from './components/QuestionariosManager';
import QuestionarioTemplatesManager from './components/QuestionarioTemplatesManager';

const QuestionariosTab = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Questionários</h2>
          <p className="text-gray-600">Gerencie questionários, histórias dos casais e templates</p>
        </div>
      </div>

      <Tabs defaultValue="questionarios" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="questionarios" className="flex items-center gap-2">
            <ClipboardList className="w-4 h-4" />
            Questionários
          </TabsTrigger>
          <TabsTrigger value="historias" className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Histórias dos Casais
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Templates
          </TabsTrigger>
        </TabsList>

        <TabsContent value="questionarios">
          <QuestionariosManager />
        </TabsContent>

        <TabsContent value="historias">
          <HistoriasCasaisManager />
        </TabsContent>

        <TabsContent value="templates">
          <QuestionarioTemplatesManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default QuestionariosTab;
