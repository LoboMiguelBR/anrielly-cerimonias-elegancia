
import React from 'react';

const TemplateLoading: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700 mb-4"></div>
      <p className="text-gray-500">Carregando templates...</p>
      <p className="text-xs text-gray-400 mt-2">Conectando ao banco de dados...</p>
    </div>
  );
};

export default TemplateLoading;
