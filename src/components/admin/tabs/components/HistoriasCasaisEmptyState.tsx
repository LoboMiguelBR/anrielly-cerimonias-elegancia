
import React from 'react';
import { Heart } from 'lucide-react';

const HistoriasCasaisEmptyState = () => {
  return (
    <div className="text-center py-12">
      <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum casal encontrado</h3>
      <p className="text-gray-600">Aguarde os casais preencherem seus questionários para gerar as histórias.</p>
    </div>
  );
};

export default HistoriasCasaisEmptyState;
