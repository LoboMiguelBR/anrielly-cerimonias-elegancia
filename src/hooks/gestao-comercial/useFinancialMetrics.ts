
import { FinancialMetrics } from './types';

export const useFinancialMetrics = (
  quoteRequests: any[],
  proposals: any[],
  contracts: any[]
): FinancialMetrics => {
  const orcamentosAbertos = proposals.filter(p => p.status === 'enviado').length;
  const contratosAndamento = contracts.filter(c => c.status === 'em_andamento').length;
  const contratosAssinados = contracts.filter(c => c.status === 'assinado').length;
  
  const valorOrcamentosAbertos = proposals
    .filter(p => p.status === 'enviado')
    .reduce((sum, p) => sum + (parseFloat(p.total_price) || 0), 0);
  
  const valorContratosAssinados = contracts
    .filter(c => c.status === 'assinado')
    .reduce((sum, c) => sum + (parseFloat(c.total_price) || 0), 0);
  
  const ticketMedio = contratosAssinados > 0 ? valorContratosAssinados / contratosAssinados : 0;
  
  const totalLeads = quoteRequests.length;
  const taxaConversao = totalLeads > 0 ? (contratosAssinados / totalLeads) * 100 : 0;

  return {
    orcamentosAbertos,
    contratosAndamento,
    contratosAssinados,
    valorOrcamentosAbertos,
    valorContratosAssinados,
    ticketMedio,
    taxaConversao
  };
};
