import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, CheckCircle, Clock } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import FollowUpAutomations from "./FollowUpAutomations";

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
        {/* KPIs e gráficos */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Receita Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {totalReceita.toLocaleString()}</div>
            <div className="text-sm text-gray-500">
              <DollarSign className="inline-block w-4 h-4 mr-1" /> Total de receita gerada
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Leads Captados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLeads}</div>
            <div className="text-sm text-gray-500">
              <Users className="inline-block w-4 h-4 mr-1" /> Novos leads no funil
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Clientes Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientesAtivos}</div>
            <div className="text-sm text-gray-500">
              <CheckCircle className="inline-block w-4 h-4 mr-1" /> Clientes com contrato ativo
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Tempo Médio de Contrato</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tempoMedioContrato}</div>
            <div className="text-sm text-gray-500">
              <Clock className="inline-block w-4 h-4 mr-1" /> Duração média dos contratos
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Receita vs Leads (Mensal)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="receita" stroke="#8884d8" fill="#8884d8" name="Receita" />
                <Area type="monotone" dataKey="leads" stroke="#82ca9d" fill="#82ca9d" name="Leads" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        {/* FollowUp e Notificações (lado esquerdo em desktop) */}
        <FollowUpAutomations />
        {/* Placeholder WhatsApp */}
        <div className="mb-8 p-4 rounded-lg border-2 border-dashed border-green-200 bg-green-50 text-green-900">
          <strong>Integração WhatsApp Business:</strong><br />
          Configure seu número e chave API do WhatsApp Business para ativar disparos automáticos.
        </div>
      </div>
      <div>
        {/* Outros painéis e conteúdos do dashboard */}
        <Card>
          <CardHeader>
            <CardTitle>Próximas Ações</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Lista de próximas ações ou tarefas */}
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
