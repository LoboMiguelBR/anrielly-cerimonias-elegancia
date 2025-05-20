
import React from 'react';

const LoadingState: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-[800px] bg-white">
      <div className="text-center">
        <div className="animate-spin h-8 w-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600">Carregando visualização da proposta...</p>
        <p className="text-gray-400 text-sm mt-2">Isso pode levar alguns instantes...</p>
      </div>
    </div>
  );
};

export default LoadingState;
