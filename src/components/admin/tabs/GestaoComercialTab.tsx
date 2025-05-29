
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FunilVendas from '../gestao-comercial/FunilVendas';
import PainelFinanceiro from '../gestao-comercial/PainelFinanceiro';
import { useMobileLayout } from '@/hooks/useMobileLayout';

const GestaoComercialTab = () => {
  const { isMobile } = useMobileLayout();

  return (
    <div className={`${isMobile ? 'p-2 space-y-4' : 'p-6 space-y-6'} min-h-screen`}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`${isMobile ? 'text-xl' : 'text-3xl'} font-bold text-gray-900`}>
            Gestão Comercial
          </h1>
          <p className={`text-gray-600 ${isMobile ? 'text-sm' : ''}`}>
            Acompanhe seu funil de vendas e indicadores financeiros
          </p>
        </div>
      </div>

      <Tabs defaultValue="funil" className="space-y-4">
        <TabsList className={`grid w-full grid-cols-2 ${isMobile ? 'h-12' : ''}`}>
          <TabsTrigger 
            value="funil" 
            className={`${isMobile ? 'text-sm py-3' : ''}`}
          >
            {isMobile ? 'Funil' : 'Funil de Vendas'}
          </TabsTrigger>
          <TabsTrigger 
            value="financeiro"
            className={`${isMobile ? 'text-sm py-3' : ''}`}
          >
            {isMobile ? 'Financeiro' : 'Painel Financeiro'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="funil" className="space-y-0">
          <FunilVendas />
        </TabsContent>

        <TabsContent value="financeiro" className="space-y-0">
          <PainelFinanceiro />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GestaoComercialTab;
