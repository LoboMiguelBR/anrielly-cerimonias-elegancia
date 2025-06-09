
import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessagesProps {
  saveError: string | null;
  debugInfo: string | null;
}

const ErrorMessages: React.FC<ErrorMessagesProps> = ({ saveError, debugInfo }) => {
  if (!saveError && !debugInfo) return null;
  
  return (
    <>
      {saveError && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md mb-4">
          <p className="font-medium">Erro ao salvar template:</p>
          <p>{saveError}</p>
        </div>
      )}

      {debugInfo && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 p-3 rounded-md mb-4 flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5" />
          <div>
            <p className="font-medium">Informação de Depuração:</p>
            <p className="text-sm">{debugInfo}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default ErrorMessages;
