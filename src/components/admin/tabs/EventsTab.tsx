
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar, ClipboardList, FileText, Plus, Clock } from 'lucide-react';
import { useMobileLayout } from '@/hooks/useMobileLayout';
import EventCalendarManager from '../events/EventCalendarManager';
import QuestionariosTab from './QuestionariosTab';
import HistoriasCasaisTab from './HistoriasCasaisTab';

const EventsTab = () => {
  const { isMobile } = useMobileLayout();
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  return (
    <div className={`space-y-4 min-h-screen ${isMobile ? 'p-2' : ''}`}>
      <div className="flex flex-col gap-4 justify-between items-start">
        <div>
          <h2 className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold text-gray-900`}>
            {isMobile ? 'Eventos' : 'Gestão Completa de Eventos'}
          </h2>
          <p className={`text-gray-600 ${isMobile ? 'text-sm' : ''}`}>
            {isMobile 
              ? 'Gerencie todos os aspectos dos seus eventos'
              : 'Calendário, questionários, história IA e timeline unificados por evento'
            }
          </p>
        </div>
      </div>

      <Tabs defaultValue="calendario" className="space-y-4">
        <TabsList className={`grid w-full grid-cols-4 ${isMobile ? 'h-12' : ''}`}>
          <TabsTrigger 
            value="calendario" 
            className={`flex items-center gap-2 ${isMobile ? 'text-xs py-3' : ''}`}
          >
            <Calendar className="h-4 w-4" />
            {isMobile ? 'Agenda' : 'Calendário'}
          </TabsTrigger>
          <TabsTrigger 
            value="questionarios"
            className={`flex items-center gap-2 ${isMobile ? 'text-xs py-3' : ''}`}
          >
            <ClipboardList className="h-4 w-4" />
            {isMobile ? 'Forms' : 'Questionários'}
          </TabsTrigger>
          <TabsTrigger 
            value="historias"
            className={`flex items-center gap-2 ${isMobile ? 'text-xs py-3' : ''}`}
          >
            <FileText className="h-4 w-4" />
            {isMobile ? 'IA' : 'História IA'}
          </TabsTrigger>
          <TabsTrigger 
            value="timeline"
            className={`flex items-center gap-2 ${isMobile ? 'text-xs py-3' : ''}`}
          >
            <Clock className="h-4 w-4" />
            Timeline
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendario" className="space-y-0">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Calendário de Eventos</CardTitle>
                  <CardDescription>
                    Visualize e gerencie seus eventos programados com timeline detalhada
                  </CardDescription>
                </div>
                <Button className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  {isMobile ? 'Novo' : 'Novo Evento'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <EventCalendarManager />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="questionarios" className="space-y-0">
          <Card>
            <CardHeader>
              <CardTitle>Questionários por Evento</CardTitle>
              <CardDescription>
                Gerencie questionários específicos para cada evento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <QuestionariosTab />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="historias" className="space-y-0">
          <Card>
            <CardHeader>
              <CardTitle>História IA dos Casais</CardTitle>
              <CardDescription>
                Histórias personalizadas geradas por IA baseadas nos questionários
              </CardDescription>
            </CardHeader>
            <CardContent>
              <HistoriasCasaisTab />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-0">
          <Card>
            <CardHeader>
              <CardTitle>Timeline & Detalhes dos Eventos</CardTitle>
              <CardDescription>
                Acompanhe progresso, tarefas, questionários e histórias por evento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">
                  Selecione um evento no calendário para ver sua timeline completa
                </p>
                <p className="text-sm text-gray-400">
                  A timeline inclui: tarefas, questionários enviados, histórias geradas e marcos importantes
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EventsTab;
