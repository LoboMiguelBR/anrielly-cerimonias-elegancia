
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Database, CheckCircle, Info, Zap, RefreshCw } from "lucide-react";
import { useCMSSeeder } from '@/hooks/useCMSSeeder';
import { useCMSLandingPageEnhanced } from '@/hooks/useCMSLandingPageEnhanced';
import { toast } from 'sonner';

const CMSInitializerEnhanced = () => {
  const { seedDefaultData, isSeeding } = useCMSSeeder();
  const { landingPage, loading, refetch, lastUpdated, invalidateCache } = useCMSLandingPageEnhanced('home');
  const [lastSeedTime, setLastSeedTime] = useState<Date | null>(null);

  const handleSeedData = async () => {
    try {
      await seedDefaultData();
      setLastSeedTime(new Date());
      toast.success('Dados CMS criados com sucesso!');
      
      // Aguardar um pouco e recarregar os dados
      setTimeout(() => {
        invalidateCache();
        refetch();
      }, 1000);
    } catch (error) {
      console.error('Erro ao criar dados iniciais:', error);
      toast.error('Erro ao criar dados do CMS');
    }
  };

  const handleForceRefresh = async () => {
    try {
      invalidateCache();
      await refetch();
      toast.success('Cache limpo e dados atualizados!');
    } catch (error) {
      toast.error('Erro ao atualizar dados');
    }
  };

  const hasData = landingPage && Object.keys(landingPage.sections).length > 0;
  const hasActiveSections = hasData && Object.keys(landingPage.sections).some(key => 
    landingPage.sections[key] && typeof landingPage.sections[key] === 'object'
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Status do Sistema CMS
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status Principal */}
        <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
          <AlertCircle className="h-6 w-6 text-blue-600" />
          <div className="flex-1">
            <p className="font-medium text-blue-900">Status do CMS</p>
            <p className="text-sm text-blue-700">
              {loading ? 'Verificando dados...' : 
               hasData ? `✅ CMS ativo - ${landingPage.title} (${landingPage.slug})` : 
               '⚠️ CMS precisa ser inicializado'}
            </p>
            {lastUpdated && (
              <p className="text-xs text-blue-600 mt-1">
                Última verificação: {lastUpdated.toLocaleString('pt-BR')}
              </p>
            )}
          </div>
          {hasData && hasActiveSections && (
            <CheckCircle className="h-6 w-6 text-green-600" />
          )}
        </div>

        {!loading && (
          <div className="space-y-4">
            {/* Diagnóstico Detalhado */}
            <div className="text-sm text-gray-600 space-y-2">
              <div className="font-medium text-gray-800">Diagnóstico do Sistema:</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {landingPage ? '✅' : '❌'} 
                    <span>Página principal: {landingPage ? `${landingPage.title} (${landingPage.slug})` : 'Não encontrada'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {landingPage && Object.keys(landingPage.sections).length > 0 ? '✅' : '❌'} 
                    <span>Seções: {landingPage ? `${Object.keys(landingPage.sections).length} configuradas` : '0 seções'}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {landingPage?.sections.hero ? '✅' : '❌'} 
                    <span>Hero Section</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {landingPage?.sections.about ? '✅' : '❌'} 
                    <span>About Section</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {landingPage?.sections.services ? '✅' : '❌'} 
                    <span>Services Section</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {landingPage?.sections.contact ? '✅' : '❌'} 
                    <span>Contact Section</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Ações baseadas no status */}
            {!hasData && (
              <div className="space-y-3">
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-yellow-600 mt-0.5" />
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
                    <Zap className="h-4 w-4 mr-2" />
                    {isSeeding ? 'Criando dados CMS...' : 'Migrar para CMS'}
                  </Button>
                </div>
              </div>
            )}

            {hasData && (
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-800 mb-3">
                  ✅ CMS configurado com sucesso! A landing page está usando dados do CMS.
                  Use as abas "Páginas" e "Seções" para gerenciar o conteúdo.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    onClick={refetch}
                    variant="outline"
                    size="sm"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Atualizar Status
                  </Button>
                  <Button 
                    onClick={handleForceRefresh}
                    variant="outline"
                    size="sm"
                  >
                    <Database className="h-4 w-4 mr-2" />
                    Limpar Cache
                  </Button>
                  <Button 
                    onClick={() => window.open('/', '_blank')}
                    variant="outline"
                    size="sm"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Ver Landing Page
                  </Button>
                </div>
              </div>
            )}

            {/* Info adicional */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-500">
              {lastSeedTime && (
                <div>
                  <strong>Última inicialização:</strong><br />
                  {lastSeedTime.toLocaleString('pt-BR')}
                </div>
              )}
              <div>
                <strong>Funcionalidades ativas:</strong><br />
                • Cache inteligente<br />
                • Atualização em tempo real<br />
                • Fallback automático
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CMSInitializerEnhanced;
