
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FunilVendas from '../gestao-comercial/FunilVendas';
import PainelFinanceiro from '../gestao-comercial/PainelFinanceiro';
import FluxoCaixa from '../financeiro/FluxoCaixa';
import ContasReceber from '../financeiro/ContasReceber';
import RelatoriosFinanceiros from '../financeiro/RelatoriosFinanceiros';
import MetasOrcamentos from '../financeiro/MetasOrcamentos';
import GestaoFornecedores from '../financeiro/GestaoFornecedores';
import { useMobileLayout } from '@/hooks/useMobileLayout';

const VendasFinanceiroTab = () => {
  const { isMobile } = useMobileLayout();

  return (
    <div className={`${isMobile ? 'p-2 space-y-4' : 'p-6 space-y-6'} min-h-screen`}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`${isMobile ? 'text-xl' : 'text-3xl'} font-bold text-gray-900`}>
            Vendas & Financeiro
          </h1>
          <p className={`text-gray-600 ${isMobile ? 'text-sm' : ''}`}>
            Gestão completa de vendas, finanças e fornecedores
          </p>
        </div>
      </div>

      <Tabs defaultValue="funil" className="space-y-4">
        <TabsList className={`grid w-full ${isMobile ? 'grid-cols-3 h-12' : 'grid-cols-7'}`}>
          <TabsTrigger 
            value="funil" 
            className={`${isMobile ? 'text-xs py-3' : ''}`}
          >
            {isMobile ? 'Funil' : 'Funil de Vendas'}
          </TabsTrigger>
          <TabsTrigger 
            value="dashboard-financeiro"
            className={`${isMobile ? 'text-xs py-3' : ''}`}
          >
            {isMobile ? 'Dashboard' : 'Dashboard Financeiro'}
          </TabsTrigger>
          <TabsTrigger 
            value="fluxo-caixa"
            className={`${isMobile ? 'text-xs py-3' : ''}`}
          >
            {isMobile ? 'Fluxo' : 'Fluxo de Caixa'}
          </TabsTrigger>
          {!isMobile && (
            <>
              <TabsTrigger value="contas-receber">
                Contas a Receber
              </TabsTrigger>
              <TabsTrigger value="relatorios">
                Relatórios
              </TabsTrigger>
              <TabsTrigger value="metas">
                Metas & Orçamentos
              </TabsTrigger>
              <TabsTrigger value="fornecedores">
                Fornecedores
              </TabsTrigger>
            </>
          )}
        </TabsList>

        <TabsContent value="funil" className="space-y-0">
          <FunilVendas />
        </TabsContent>

        <TabsContent value="dashboard-financeiro" className="space-y-0">
          <PainelFinanceiro />
        </TabsContent>

        <TabsContent value="fluxo-caixa" className="space-y-0">
          <FluxoCaixa />
        </TabsContent>

        <TabsContent value="contas-receber" className="space-y-0">
          <ContasReceber />
        </TabsContent>

        <TabsContent value="relatorios" className="space-y-0">
          <RelatoriosFinanceiros />
        </TabsContent>

        <TabsContent value="metas" className="space-y-0">
          <MetasOrcamentos />
        </TabsContent>

        <TabsContent value="fornecedores" className="space-y-0">
          <GestaoFornecedores />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VendasFinanceiroTab;
