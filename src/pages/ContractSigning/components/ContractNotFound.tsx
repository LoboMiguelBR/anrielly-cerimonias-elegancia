
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from 'lucide-react';

const ContractNotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md mx-auto shadow-lg">
        <CardContent className="text-center py-6 sm:py-8">
          <AlertCircle className="h-8 w-8 sm:h-12 sm:w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
            Contrato não encontrado
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mb-4 px-4">
            O contrato solicitado não foi encontrado ou o link pode ter expirado.
          </p>
          <Button 
            onClick={() => navigate('/')}
            className="w-full sm:w-auto"
          >
            Voltar ao Site
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContractNotFound;
