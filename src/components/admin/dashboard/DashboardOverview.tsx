
import React, { Suspense } from "react";
import DashboardKPIs from "./DashboardKPIs";
import FollowUpAutomations from "./FollowUpAutomations";
import WhatsAppIntegrationSection from "./WhatsAppIntegrationSection";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// Lazy load dos componentes pesados
const ReceitaLeadsChartSection = React.lazy(() => import("./ReceitaLeadsChartSection"));

const DashboardOverview = () => {
  return (
    <div className="space-y-8">
      <DashboardKPIs />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <Suspense 
            fallback={
              <Card>
                <CardHeader>
                  <CardTitle>Carregando gráfico...</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gray-100 rounded animate-pulse"></div>
                </CardContent>
              </Card>
            }
          >
            <ReceitaLeadsChartSection data={[]} />
          </Suspense>
          
          <FollowUpAutomations />
          <WhatsAppIntegrationSection />
        </div>
        
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Próximas Ações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                  <span className="text-sm">Agendar reunião com cliente Maria Silva</span>
                </div>
                <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-sm">Enviar proposta para João Carlos</span>
                </div>
                <div className="flex items-center p-3 bg-green-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-sm">Confirmar contrato com Ana Beatriz</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resumo Semanal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Novos leads</span>
                  <span className="font-semibold text-green-600">+12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Propostas enviadas</span>
                  <span className="font-semibold text-blue-600">8</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Contratos fechados</span>
                  <span className="font-semibold text-purple-600">3</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
