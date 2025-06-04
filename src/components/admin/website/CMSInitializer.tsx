
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Database, CheckCircle, Info } from "lucide-react";
import { useCMSSeeder } from '@/hooks/useCMSSeeder';
import { useCMSLandingPage } from '@/hooks/useCMSLandingPage';

const CMSInitializer = () => {
  const { seedDefaultData, isSeeding } = useCMSSeeder();
  const { landingPage, loading, refetch } = useCMSLandingPage('home');
  const [lastSeedTime, setLastSeedTime] = useState<Date | null>(null);

  const handleSeedData = async () => {
    try {
      await seedDefaultData();
      setLastSeedTime(new Date());
      // Aguardar um pouco e recarregar os dados
      setTimeout(() => {
        refetch();
      }, 1000);
    } catch (error) {
      console.error('Erro ao criar dados iniciais:', error);
    }
  };

  const hasData = landingPage && Object.keys(landingPage.sections).length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Inicialização do CMS
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
          <AlertCircle className="h-5 w-5 text-blue-600" />
          <div className="flex-1">
            <p className="font-medium text-blue-900">Status do CMS</p>
            <p className="text-sm text-blue-700">
              {loading ? 'Verificando dados...' : 
               hasData ? `CMS configurado - Página: ${landingPage.title} (${landingPage.slug})` : 
               'CMS precisa ser inicializado'}
            </p>
          </div>
          {hasData && (
            <CheckCircle className="h-5 w-5 text-green-600" />
          )}
        </div>

        {!loading && (
          <div className="space-y-3">
            <div className="text-sm text-gray-600">
              <strong>Dados encontrados:</strong>
              <ul className="mt-1 ml-4 list-disc">
                <li>Página principal: {landingPage ? `✅ ${landingPage.title} (${landingPage.slug})` : '❌ Não encontrada'}</li>
                <li>Seções: {landingPage ? `${Object.keys(landingPage.sections).length} seções` : '0 seções'}</li>
                <li>Hero: {landingPage?.sections.hero ? '✅' : '❌'}</li>
                <li>About: {landingPage?.sections.about ? '✅' : '❌'}</li>
                <li>Services: {landingPage?.sections.services ? '✅' : '❌'}</li>
                <li>Contact: {landingPage?.sections.contact ? '✅' : '❌'}</li>
              </ul>
            </div>

            {!hasData && (
              <div className="space-y-3">
                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-yellow-800 mb-2">
                        <strong>Sistema de Fallback Ativo:</strong>
                      </p>
                      <p className="text-xs text-yellow-700 mb-3">
                        A landing page está funcionando com componentes estáticos enquanto o CMS não está configurado. 
                        Clique no botão abaixo para migrar para o sistema CMS e ter controle total sobre o conteúdo.
                      </p>
                    </div>
                  </div>
                  <Button 
                    onClick={handleSeedData}
                    disabled={isSeeding}
                    className="w-full"
                  >
                    {isSeeding ? 'Criando dados CMS...' : 'Migrar para CMS'}
                  </Button>
                </div>
              </div>
            )}

            {hasData && (
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-800 mb-3">
                  ✅ CMS configurado com sucesso! A landing page está usando dados do CMS.
                  Use as abas "Páginas" e "Seções" para gerenciar o conteúdo.
                </p>
                <div className="flex gap-2">
                  <Button 
                    onClick={refetch}
                    variant="outline"
                    size="sm"
                  >
                    Atualizar Status
                  </Button>
                  <Button 
                    onClick={() => window.open('/', '_blank')}
                    variant="outline"
                    size="sm"
                  >
                    Ver Landing Page
                  </Button>
                </div>
              </div>
            )}

            {lastSeedTime && (
              <p className="text-xs text-gray-500">
                Última inicialização: {lastSeedTime.toLocaleString('pt-BR')}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CMSInitializer;
