
import { FileText } from 'lucide-react';

interface CompactPDFViewProps {
  onGeneratePDF: () => void;
  isGenerating: boolean;
}

const CompactPDFView = ({ onGeneratePDF, isGenerating }: CompactPDFViewProps) => {
  return (
    <div className="flex items-center gap-2 w-full">
      <FileText className="h-4 w-4" />
      <span onClick={onGeneratePDF} className="cursor-pointer">
        {isGenerating ? 'Gerando...' : 'Download PDF'}
      </span>
    </div>
  );
};

export default CompactPDFView;
