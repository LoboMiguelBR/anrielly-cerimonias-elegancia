
import React from 'react';

interface DashboardSummaryProps {
  quoteRequestsCount: number;
  proposalsCount: number;
  galleryCount: number;
}

const DashboardSummary = ({ quoteRequestsCount, proposalsCount, galleryCount }: DashboardSummaryProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-lavender/10 rounded-lg p-6 text-center">
        <p className="text-gray-600">Orçamentos Pendentes</p>
        <p className="text-3xl font-semibold">{quoteRequestsCount}</p>
      </div>
      <div className="bg-lavender/10 rounded-lg p-6 text-center">
        <p className="text-gray-600">Propostas Enviadas</p>
        <p className="text-3xl font-semibold">{proposalsCount}</p>
      </div>
      <div className="bg-lavender/10 rounded-lg p-6 text-center">
        <p className="text-gray-600">Fotos na Galeria</p>
        <p className="text-3xl font-semibold">{galleryCount}</p>
      </div>
    </div>
  );
};

export default DashboardSummary;
