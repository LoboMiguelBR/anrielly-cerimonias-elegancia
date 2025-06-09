
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface ErrorStateProps {
  errorMessage: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({ errorMessage }) => {
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Erro ao carregar PDF</AlertTitle>
      <AlertDescription>
        {errorMessage}
        <div className="mt-2">
          <p className="text-sm">Possíveis soluções:</p>
          <ul className="text-sm list-disc pl-5 mt-1">
            <li>Verifique sua conexão com a internet</li>
            <li>Verifique se todos os dados da proposta estão preenchidos</li>
            <li>Tente atualizar a página e gerar a proposta novamente</li>
          </ul>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default ErrorState;
