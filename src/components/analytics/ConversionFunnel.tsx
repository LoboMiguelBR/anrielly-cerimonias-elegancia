import React from 'react';
import { Card } from '@/components/ui/card';

interface ConversionFunnelProps {
  leads: number;
  proposals: number;
  contracts: number;
}

export const ConversionFunnel: React.FC<ConversionFunnelProps> = ({
  leads,
  proposals,
  contracts,
}) => {
  const calculatePercentage = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return (current / previous) * 100;
  };

  const proposalRate = calculatePercentage(proposals, leads);
  const contractRate = calculatePercentage(contracts, proposals);
  const overallRate = calculatePercentage(contracts, leads);

  const stages = [
    {
      name: 'Leads',
      value: leads,
      percentage: 100,
      color: 'bg-blue-500',
    },
    {
      name: 'Propostas',
      value: proposals,
      percentage: proposalRate,
      color: 'bg-orange-500',
    },
    {
      name: 'Contratos',
      value: contracts,
      percentage: contractRate,
      color: 'bg-green-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-2xl font-bold text-green-600">
          {overallRate.toFixed(1)}%
        </div>
        <div className="text-sm text-muted-foreground">
          Taxa de conversão geral (Leads → Contratos)
        </div>
      </div>

      <div className="space-y-4">
        {stages.map((stage, index) => (
          <div key={stage.name} className="relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">{stage.name}</span>
              <span className="text-sm text-muted-foreground">
                {stage.value} ({stage.percentage.toFixed(1)}%)
              </span>
            </div>
            
            <div className="w-full bg-muted rounded-full h-3 relative overflow-hidden">
              <div
                className={`h-full ${stage.color} transition-all duration-500 ease-in-out`}
                style={{ width: `${Math.max(stage.percentage, 5)}%` }}
              />
            </div>
            
            {index < stages.length - 1 && (
              <div className="flex justify-center mt-2">
                <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                  {index === 0 
                    ? `${proposalRate.toFixed(1)}% leads viram propostas`
                    : `${contractRate.toFixed(1)}% propostas viram contratos`
                  }
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4 pt-4 border-t">
        <div className="text-center">
          <div className="text-lg font-semibold text-blue-600">{leads}</div>
          <div className="text-xs text-muted-foreground">Leads Totais</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-orange-600">{proposals}</div>
          <div className="text-xs text-muted-foreground">Propostas Enviadas</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-green-600">{contracts}</div>
          <div className="text-xs text-muted-foreground">Contratos Fechados</div>
        </div>
      </div>
    </div>
  );
};