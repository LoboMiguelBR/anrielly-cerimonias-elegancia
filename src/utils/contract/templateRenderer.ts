
import { ContractData } from '@/components/admin/hooks/contract/types';
import { replaceTemplateVariables } from './templateVariables';
import { combineTemplateWithStyles } from './templateStyling';

/**
 * Renderiza o template completo com dados e estilos
 */
export const renderContractTemplate = (
  htmlContent: string,
  cssContent: string | undefined,
  contract: ContractData
): string => {
  // Primeiro substituir variáveis
  const contentWithVariables = replaceTemplateVariables(htmlContent, contract);
  
  // Depois aplicar estilos
  return combineTemplateWithStyles(contentWithVariables, cssContent);
};
