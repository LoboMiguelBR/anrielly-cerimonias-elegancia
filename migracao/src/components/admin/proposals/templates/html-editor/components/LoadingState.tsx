
import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingState: React.FC = () => {
  return (
    <div className="flex items-center justify-center p-8">
      <Loader2 className="h-8 w-8 animate-spin text-purple-500 mr-3" />
      <div>
        <span className="font-medium">Carregando editor...</span>
        <p className="text-xs text-gray-500 mt-1">Conectando ao banco de dados...</p>
      </div>
    </div>
  );
};

export default LoadingState;
