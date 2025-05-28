
import { ContractData } from '@/components/admin/hooks/contract/types';
import { replaceTemplateVariables } from './templateVariables';
import { combineTemplateWithStyles } from './templateStyling';

/**
 * Renderiza o template completo com dados e estilos
 */
export const renderContractTemplate = async (
  htmlContent: string,
  cssContent: string | undefined,
  contract: ContractData
): Promise<string> => {
  // Primeiro substituir variáveis (aguardando async)
  const contentWithVariables = await replaceTemplateVariables(htmlContent, contract);
  
  // Depois aplicar estilos
  return combineTemplateWithStyles(contentWithVariables, cssContent);
};
