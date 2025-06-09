
import { forwardRef, useImperativeHandle } from 'react';
import { ContractData } from '../../hooks/contract/types';
import { usePDFGeneration } from './hooks/usePDFGeneration';
import PDFActionButtons from './components/PDFActionButtons';
import CompactPDFView from './components/CompactPDFView';

interface ContractPDFGeneratorProps {
  contract: ContractData;
  onPDFGenerated?: (url: string) => void;
  compact?: boolean;
}

interface ContractPDFGeneratorRef {
  generatePDF: () => void;
  viewPDF: () => void;
}

const ContractPDFGenerator = forwardRef<ContractPDFGeneratorRef, ContractPDFGeneratorProps>(
  ({ contract, onPDFGenerated, compact = false }, ref) => {
    const {
      generatePDF,
      viewPDF,
      isGenerating,
      isViewing
    } = usePDFGeneration(contract, onPDFGenerated);

    useImperativeHandle(ref, () => ({
      generatePDF,
      viewPDF
    }), [generatePDF, viewPDF]);

    if (compact) {
      return (
        <CompactPDFView
          onGeneratePDF={generatePDF}
          isGenerating={isGenerating}
        />
      );
    }

    return (
      <PDFActionButtons
        onViewPDF={viewPDF}
        onGeneratePDF={generatePDF}
        isViewing={isViewing}
        isGenerating={isGenerating}
      />
    );
  }
);

ContractPDFGenerator.displayName = 'ContractPDFGenerator';

export default ContractPDFGenerator;
