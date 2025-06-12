
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PerformanceTab = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Performance do Sistema</h2>
        <p className="text-gray-600">Monitore a performance e otimizações do sistema</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Métricas de Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 py-8">
            Métricas de performance em desenvolvimento
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceTab;
