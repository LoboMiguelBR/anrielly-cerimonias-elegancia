
import React from 'react';
import { Loader2 } from 'lucide-react';

const TemplateLoading: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="h-12 w-12 text-purple-700 animate-spin mb-4" />
      <p className="text-gray-700 font-medium">Carregando templates...</p>
      <p className="text-xs text-gray-500 mt-2">Conectando ao banco de dados e verificando permissões...</p>
      <p className="text-xs text-gray-400 mt-1 max-w-md text-center">
        Se os templates não carregarem, verifique se as políticas RLS estão habilitadas na tabela proposal_template_html
      </p>
    </div>
  );
};

export default TemplateLoading;
