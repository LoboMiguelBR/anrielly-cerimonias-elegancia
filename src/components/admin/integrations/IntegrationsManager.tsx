
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Settings, Check, X, AlertCircle, ExternalLink } from 'lucide-react';
import { useIntegrationsEnhanced } from '@/hooks/useIntegrationsEnhanced';

const IntegrationsManager = () => {
  const { integrations, loading, toggleIntegration, configureIntegration } = useIntegrationsEnhanced();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-100 text-green-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <Check className="w-4 h-4" />;
      case 'error': return <X className="w-4 h-4" />;
      case 'pending': return <AlertCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'connected': return 'Conectado';
      case 'error': return 'Erro';
      case 'pending': return 'Pendente';
      case 'disconnected': return 'Desconectado';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Integrações</h2>
          <p className="text-gray-600">Configure integrações com serviços externos</p>
        </div>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map(integration => (
          <Card key={integration.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    {integration.logo_url ? (
                      <img 
                        src={integration.logo_url} 
                        alt={integration.name}
                        className="w-6 h-6"
                      />
                    ) : (
                      <ExternalLink className="w-5 h-5 text-gray-600" />
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{integration.name}</CardTitle>
                    <p className="text-sm text-gray-600">{integration.category}</p>
                  </div>
                </div>
                <Switch
                  checked={integration.enabled}
                  onCheckedChange={() => toggleIntegration(integration.id)}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  {integration.description}
                </p>
                
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(integration.status)}>
                    <span className="flex items-center gap-1">
                      {getStatusIcon(integration.status)}
                      {getStatusLabel(integration.status)}
                    </span>
                  </Badge>
                </div>

                {integration.features.length > 0 && (
                  <div>
                    <div className="text-sm font-medium mb-2">Recursos:</div>
                    <div className="space-y-1">
                      {integration.features.map(feature => (
                        <div key={feature} className="text-xs text-gray-600 flex items-center gap-1">
                          <Check className="w-3 h-3 text-green-600" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 mt-4">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => configureIntegration(integration.id)}
                  >
                    <Settings className="w-4 h-4 mr-1" />
                    Configurar
                  </Button>
                  {integration.documentation_url && (
                    <Button size="sm" variant="outline">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Categories */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Categorias Disponíveis</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {['Pagamentos', 'Email', 'AI/ML', 'Automação'].map(category => {
            const categoryIntegrations = integrations.filter(i => i.category === category);
            const connectedCount = categoryIntegrations.filter(i => i.status === 'connected').length;
            
            return (
              <Card key={category}>
                <CardContent className="p-4">
                  <div className="text-lg font-semibold">{category}</div>
                  <div className="text-sm text-gray-600">
                    {connectedCount} de {categoryIntegrations.length} conectadas
                  </div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ 
                        width: `${categoryIntegrations.length > 0 ? (connectedCount / categoryIntegrations.length) * 100 : 0}%` 
                      }}
                    ></div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default IntegrationsManager;
