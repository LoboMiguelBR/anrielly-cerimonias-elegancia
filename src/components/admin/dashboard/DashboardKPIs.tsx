
import React from "react";
import { DollarSign, Users, CheckCircle, FileText } from "lucide-react";
import KPIStatCard from "./KPIStatCard";
import { useDashboardData } from "@/hooks/useDashboardData";

const DashboardKPIs = () => {
  const { stats, loading } = useDashboardData();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <KPIStatCard
        title="Receita Total"
        value={`R$ ${stats.totalReceita.toLocaleString('pt-BR')}`}
        icon={DollarSign}
        description="Receita dos contratos assinados"
        iconClassName="text-green-600"
        valueClassName="text-green-600"
      />
      <KPIStatCard
        title="Leads Captados"
        value={stats.totalLeads}
        icon={Users}
        description="Solicitações de orçamento"
        iconClassName="text-blue-600"
        valueClassName="text-blue-600"
      />
      <KPIStatCard
        title="Clientes Ativos"
        value={stats.clientesAtivos}
        icon={CheckCircle}
        description="Clientes com status ativo"
        iconClassName="text-purple-600"
        valueClassName="text-purple-600"
      />
      <KPIStatCard
        title="Propostas Criadas"
        value={stats.proposalsCount}
        icon={FileText}
        description="Total de propostas geradas"
        iconClassName="text-orange-600"
        valueClassName="text-orange-600"
      />
    </div>
  );
};

export default DashboardKPIs;
