
import React from 'react';
import { Loader2 } from 'lucide-react';

const GeneratorLoadingState: React.FC = () => {
  return (
    <div className="p-12 text-center">
      <Loader2 className="w-8 h-8 animate-spin mx-auto text-purple-500" />
      <p className="mt-2 text-gray-500">Carregando dados da proposta...</p>
    </div>
  );
};

export default GeneratorLoadingState;
