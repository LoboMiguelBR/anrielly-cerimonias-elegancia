
import React from "react";
import KPIStatCard from "./KPIStatCard";
import WhatsAppIntegrationSection from "./WhatsAppIntegrationSection";
import ReceitaLeadsChartSection from "./ReceitaLeadsChartSection";
import FollowUpAutomations from "./FollowUpAutomations";
import { DollarSign, Users, CheckCircle, Clock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const data = [
  { name: "Jan", receita: 4000, leads: 2400 },
  { name: "Fev", receita: 3000, leads: 1398 },
  { name: "Mar", receita: 2000, leads: 9800 },
  { name: "Abr", receita: 2780, leads: 3908 },
  { name: "Mai", receita: 1890, leads: 4800 },
  { name: "Jun", receita: 2390, leads: 3800 },
  { name: "Jul", receita: 3490, leads: 4300 },
  { name: "Ago", receita: 2000, leads: 9800 },
  { name: "Set", receita: 2780, leads: 3908 },
  { name: "Out", receita: 1890, leads: 4800 },
  { name: "Nov", receita: 2390, leads: 3800 },
  { name: "Dez", receita: 3490, leads: 4300 },
];

const EnterpriseDashboard = () => {
  const totalReceita = data.reduce((acc, item) => acc + item.receita, 0);
  const totalLeads = data.reduce((acc, item) => acc + item.leads, 0);
  const clientesAtivos = 55;
  const tempoMedioContrato = "6 meses";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <KPIStatCard
          title="Receita Total"
          value={`R$ ${totalReceita.toLocaleString()}`}
          icon={DollarSign}
          description="Total de receita gerada"
        />
        <KPIStatCard
          title="Leads Captados"
          value={totalLeads}
          icon={Users}
          description="Novos leads no funil"
        />
        <KPIStatCard
          title="Clientes Ativos"
          value={clientesAtivos}
          icon={CheckCircle}
          description="Clientes com contrato ativo"
        />
        <KPIStatCard
          title="Tempo Médio de Contrato"
          value={tempoMedioContrato}
          icon={Clock}
          description="Duração média dos contratos"
        />
        <ReceitaLeadsChartSection data={data} />
        <FollowUpAutomations />
        <WhatsAppIntegrationSection />
      </div>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Próximas Ações</CardTitle>
          </CardHeader>
          <CardContent>
            <ul>
              <li>Agendar reunião com cliente X</li>
              <li>Enviar proposta para cliente Y</li>
              <li>Confirmar contrato com cliente Z</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnterpriseDashboard;
