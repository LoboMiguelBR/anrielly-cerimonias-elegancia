
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { createTemplateStructures } from '@/utils/createTemplateStructures';

const TemplateStructureCreator = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateStructures = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      await createTemplateStructures();
      setSuccess(true);
      toast.success('Estruturas de templates criadas com sucesso!');
    } catch (error: any) {
      console.error('Erro ao criar estruturas:', error);
      setError(error.message);
      toast.error('Erro ao criar estruturas de templates');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Criar Estruturas de Templates</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <p className="text-sm text-gray-600">
          Clique no botão abaixo para criar automaticamente as seções e perguntas 
          para todos os templates de questionário.
        </p>
        
        <Button 
          onClick={handleCreateStructures} 
          disabled={loading || success}
          className="w-full"
        >
          {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {success && <CheckCircle className="h-4 w-4 mr-2 text-green-600" />}
          {error && <AlertCircle className="h-4 w-4 mr-2 text-red-600" />}
          
          {loading ? 'Criando...' : success ? 'Criado!' : 'Criar Estruturas'}
        </Button>
        
        {error && (
          <p className="text-sm text-red-600 mt-2">{error}</p>
        )}
        
        {success && (
          <p className="text-sm text-green-600 mt-2">
            Todas as estruturas foram criadas com sucesso!
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default TemplateStructureCreator;
