
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  RefreshCw, 
  Eye, 
  CheckCircle, 
  AlertCircle, 
  XCircle,
  Settings,
  Clock
} from 'lucide-react';
import { useWebsitePages } from '@/hooks/useWebsitePages';
import { useWebsiteSections } from '@/hooks/useWebsiteSections';
import { useCMSLandingPageEnhanced } from '@/hooks/useCMSLandingPageEnhanced';
import { toast } from 'sonner';

const CMSStatusDashboard = () => {
  const { pages } = useWebsitePages();
  const { sections, toggleSectionActive } = useWebsiteSections();
  const { landingPage, loading, refetch, lastUpdated, isFromCache } = useCMSLandingPageEnhanced('home');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const homePage = pages.find(p => p.slug === 'home');
  const homePageSections = sections.filter(s => s.page_id === homePage?.id);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      toast.success('Dados atualizados com sucesso!');
    } catch (error) {
      toast.error('Erro ao atualizar dados');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleToggleSection = async (sectionId: string, isActive: boolean) => {
    try {
      await toggleSectionActive(sectionId, isActive);
      toast.success(`Seção ${isActive ? 'ativada' : 'desativada'} com sucesso!`);
    } catch (error) {
      toast.error('Erro ao alterar status da seção');
    }
  };

  const getSectionStatus = (sectionType: string) => {
    const section = homePageSections.find(s => s.section_type === sectionType);
    if (!section) return { status: 'missing', icon: XCircle, color: 'text-red-500' };
    if (!section.is_active) return { status: 'inactive', icon: AlertCircle, color: 'text-yellow-500' };
    return { status: 'active', icon: CheckCircle, color: 'text-green-500' };
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Ativa</Badge>;
      case 'inactive':
        return <Badge className="bg-yellow-100 text-yellow-800">Inativa</Badge>;
      case 'missing':
        return <Badge className="bg-red-100 text-red-800">Ausente</Badge>;
      default:
        return <Badge variant="secondary">Desconhecido</Badge>;
    }
  };

  const criticalSections = ['hero', 'about', 'services'];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Status do CMS - Página Principal
            </CardTitle>
            <div className="flex items-center gap-2">
              {lastUpdated && (
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  {lastUpdated.toLocaleTimeString('pt-BR')}
                  {isFromCache && <Badge variant="outline" className="ml-1">Cache</Badge>}
                </div>
              )}
              <Button 
                onClick={handleRefresh}
                disabled={isRefreshing || loading}
                size="sm"
                variant="outline"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Atualizar
              </Button>
              <Button 
                onClick={() => window.open('/', '_blank')}
                size="sm"
              >
                <Eye className="h-4 w-4 mr-2" />
                Visualizar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Status da Página */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-3">Status da Página</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {homePage ? '1' : '0'}
                </div>
                <div className="text-sm text-gray-600">Página Principal</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {homePageSections.filter(s => s.is_active).length}
                </div>
                <div className="text-sm text-gray-600">Seções Ativas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {homePageSections.filter(s => !s.is_active).length}
                </div>
                <div className="text-sm text-gray-600">Seções Inativas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {landingPage && Object.keys(landingPage.sections).length > 0 ? '✓' : '✗'}
                </div>
                <div className="text-sm text-gray-600">CMS Ativo</div>
              </div>
            </div>
          </div>

          {/* Status das Seções Críticas */}
          <div>
            <h4 className="font-medium mb-3">Seções Críticas</h4>
            <div className="grid gap-3">
              {criticalSections.map((sectionType) => {
                const section = homePageSections.find(s => s.section_type === sectionType);
                const { status, icon: StatusIcon, color } = getSectionStatus(sectionType);
                
                return (
                  <div key={sectionType} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <StatusIcon className={`h-5 w-5 ${color}`} />
                      <div>
                        <div className="font-medium capitalize">{sectionType}</div>
                        <div className="text-sm text-gray-500">
                          {section ? `Ordem: ${section.order_index}` : 'Não configurada'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(status)}
                      {section && (
                        <Switch
                          checked={section.is_active}
                          onCheckedChange={(checked) => handleToggleSection(section.id, checked)}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Todas as Seções */}
          {homePageSections.length > 0 && (
            <div>
              <h4 className="font-medium mb-3">Todas as Seções</h4>
              <div className="grid gap-2">
                {homePageSections
                  .sort((a, b) => a.order_index - b.order_index)
                  .map((section) => (
                    <div key={section.id} className="flex items-center justify-between p-2 text-sm border rounded">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs">
                          {section.order_index}
                        </span>
                        <span className="capitalize">{section.section_type}</span>
                        {section.title && <span className="text-gray-500">- {section.title}</span>}
                      </div>
                      <div className="flex items-center gap-2">
                        {section.is_active ? (
                          <Badge className="bg-green-100 text-green-800">Ativa</Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-800">Inativa</Badge>
                        )}
                        <Switch
                          checked={section.is_active}
                          onCheckedChange={(checked) => handleToggleSection(section.id, checked)}
                          size="sm"
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Debug Info */}
          {landingPage && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Debug Info</h4>
              <div className="text-sm text-blue-800 space-y-1">
                <div>Página: {landingPage.title} ({landingPage.slug})</div>
                <div>Status: {landingPage.status}</div>
                <div>Seções carregadas: {Object.keys(landingPage.sections).join(', ')}</div>
                <div>Última atualização: {lastUpdated?.toLocaleString('pt-BR')}</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CMSStatusDashboard;
