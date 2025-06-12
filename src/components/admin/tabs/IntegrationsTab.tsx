
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useIntegrationsEnhanced } from '@/hooks/useIntegrationsEnhanced';

const IntegrationsTab = () => {
  const { integrations, loading, toggleIntegration } = useIntegrationsEnhanced();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Integrações</h2>
        <p className="text-gray-600">Configure integrações com serviços externos</p>
      </div>

      <div className="grid gap-4">
        {integrations.map(integration => (
          <Card key={integration.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {integration.name}
                    <Badge variant={integration.enabled ? 'default' : 'secondary'}>
                      {integration.enabled ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </CardTitle>
                  <p className="text-sm text-gray-600">{integration.description}</p>
                </div>
                <Button
                  onClick={() => toggleIntegration(integration.id)}
                  variant={integration.enabled ? 'destructive' : 'default'}
                >
                  {integration.enabled ? 'Desativar' : 'Ativar'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">Categoria: {integration.category}</p>
              {integration.features && integration.features.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium">Recursos:</p>
                  <ul className="text-sm text-gray-600">
                    {integration.features.map((feature, index) => (
                      <li key={index}>• {feature}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default IntegrationsTab;
