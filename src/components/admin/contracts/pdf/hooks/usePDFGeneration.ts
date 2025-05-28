
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { ContractData } from '../../../hooks/contract/types';
import { generateContractHTML } from '../utils/contractHtmlTemplate';

export const usePDFGeneration = (
  contract: ContractData | null,
  onPDFGenerated?: (url: string) => void
) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isViewing, setIsViewing] = useState(false);

  const generatePDF = useCallback(async () => {
    if (!contract) {
      toast.error('Contrato não encontrado');
      return;
    }

    setIsGenerating(true);
    try {
      const htmlContent = generateContractHTML(contract);
      
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      const printWindow = window.open(url, '_blank');
      if (printWindow) {
        printWindow.onload = () => {
          setTimeout(() => {
            printWindow.print();
          }, 500);
        };
      }
      
      onPDFGenerated?.(url);
      toast.success('PDF gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast.error('Erro ao gerar PDF');
    } finally {
      setIsGenerating(false);
    }
  }, [contract, onPDFGenerated]);

  const viewPDF = useCallback(async () => {
    if (!contract) {
      toast.error('Contrato não encontrado');
      return;
    }

    setIsViewing(true);
    try {
      const htmlContent = generateContractHTML(contract);
      
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      window.open(url, '_blank');
      
      toast.success('PDF aberto para visualização!');
    } catch (error) {
      console.error('Erro ao visualizar PDF:', error);
      toast.error('Erro ao visualizar PDF');
    } finally {
      setIsViewing(false);
    }
  }, [contract]);

  return {
    generatePDF,
    viewPDF,
    isGenerating,
    isViewing
  };
};
