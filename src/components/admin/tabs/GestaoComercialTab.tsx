
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FunilVendas from '../gestao-comercial/FunilVendas';
import PainelFinanceiro from '../gestao-comercial/PainelFinanceiro';

const GestaoComercialTab = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão Comercial</h1>
          <p className="text-gray-600">Acompanhe seu funil de vendas e indicadores financeiros</p>
        </div>
      </div>

      <Tabs defaultValue="funil" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="funil">Funil de Vendas</TabsTrigger>
          <TabsTrigger value="financeiro">Painel Financeiro</TabsTrigger>
        </TabsList>

        <TabsContent value="funil">
          <FunilVendas />
        </TabsContent>

        <TabsContent value="financeiro">
          <PainelFinanceiro />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GestaoComercialTab;
