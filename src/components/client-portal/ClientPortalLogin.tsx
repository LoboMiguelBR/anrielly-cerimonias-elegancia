import { useEffect, useState } from 'react';
import { useClientPortalAuth } from '@/hooks/client-portal/useClientPortalAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Heart } from 'lucide-react';

interface ClientPortalLoginProps {
  token: string;
}

export const ClientPortalLogin = ({ token }: ClientPortalLoginProps) => {
  const { authenticateWithToken, loading } = useClientPortalAuth();
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    // Tentar autenticar automaticamente com o token da URL
    const autoAuthenticate = async () => {
      setIsValidating(true);
      await authenticateWithToken(token);
      setIsValidating(false);
    };

    autoAuthenticate();
  }, [token, authenticateWithToken]);

  const handleManualAuth = async () => {
    await authenticateWithToken(token);
  };

  if (isValidating || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Validando acesso...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Heart className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Portal do Cliente</CardTitle>
          <CardDescription>
            Bem-vindo ao seu portal personalizado! Aqui você pode acompanhar o progresso do seu evento, 
            ver documentos e se comunicar conosco.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Clique no botão abaixo para acessar seu portal
            </p>
            <Button 
              onClick={handleManualAuth}
              className="w-full"
              size="lg"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Acessando...
                </>
              ) : (
                'Acessar Portal'
              )}
            </Button>
          </div>

          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground text-center">
              Este link é único e pessoal. Não compartilhe com terceiros.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};