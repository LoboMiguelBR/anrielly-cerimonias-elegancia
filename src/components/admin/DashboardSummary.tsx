
import React from 'react';
import { Heart } from 'lucide-react';
import { useDashboardData } from '@/hooks/useDashboardData';

const DashboardSummary = () => {
  const { metrics, isLoading } = useDashboardData();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-gray-100 rounded-lg p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      <div className="bg-lavender/10 rounded-lg p-6 text-center">
        <p className="text-gray-600">Orçamentos Pendentes</p>
        <p className="text-3xl font-semibold">{metrics.orcamentosPendentes}</p>
      </div>
      <div className="bg-lavender/10 rounded-lg p-6 text-center">
        <p className="text-gray-600">Propostas Enviadas</p>
        <p className="text-3xl font-semibold">{metrics.valorTotalPropostas > 0 ? Math.round(metrics.valorTotalPropostas / 1000) : 0}</p>
      </div>
      <div className="bg-lavender/10 rounded-lg p-6 text-center">
        <p className="text-gray-600">Contratos Assinados</p>
        <p className="text-3xl font-semibold">{metrics.contratosAssinados}</p>
      </div>
      <div className="bg-lavender/10 rounded-lg p-6 text-center">
        <p className="text-gray-600">Leads Novos</p>
        <p className="text-3xl font-semibold">{metrics.leadsNovosMes}</p>
      </div>
      <div className="bg-purple-100 rounded-lg p-6 text-center">
        <div className="flex items-center justify-center mb-2">
          <Heart className="w-5 h-5 text-purple-600 mr-2" />
          <p className="text-gray-600">Contratos Andamento</p>
        </div>
        <p className="text-3xl font-semibold text-purple-700">{metrics.contratosAndamento}</p>
      </div>
    </div>
  );
};

export default DashboardSummary;
