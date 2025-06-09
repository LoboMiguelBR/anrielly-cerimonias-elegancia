
import React from 'react';
import { Heart } from 'lucide-react';

interface DashboardSummaryProps {
  quoteRequestsCount: number;
  proposalsCount: number;
  galleryCount: number;
  testimonialsCount: number;
  questionariosCount: number;
}

const DashboardSummary = ({ 
  quoteRequestsCount, 
  proposalsCount, 
  galleryCount, 
  testimonialsCount, 
  questionariosCount 
}: DashboardSummaryProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
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
      <div className="bg-lavender/10 rounded-lg p-6 text-center">
        <p className="text-gray-600">Depoimentos</p>
        <p className="text-3xl font-semibold">{testimonialsCount}</p>
      </div>
      <div className="bg-purple-100 rounded-lg p-6 text-center">
        <div className="flex items-center justify-center mb-2">
          <Heart className="w-5 h-5 text-purple-600 mr-2" />
          <p className="text-gray-600">Questionários</p>
        </div>
        <p className="text-3xl font-semibold text-purple-700">{questionariosCount}</p>
      </div>
    </div>
  );
};

export default DashboardSummary;
