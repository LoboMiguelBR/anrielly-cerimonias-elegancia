
import { Button } from "@/components/ui/button";
import { Download, Eye, Loader2 } from 'lucide-react';

interface PDFActionButtonsProps {
  onViewPDF: () => void;
  onGeneratePDF: () => void;
  isViewing: boolean;
  isGenerating: boolean;
}

const PDFActionButtons = ({
  onViewPDF,
  onGeneratePDF,
  isViewing,
  isGenerating
}: PDFActionButtonsProps) => {
  return (
    <div className="flex gap-3">
      <Button
        onClick={onViewPDF}
        disabled={isViewing}
        variant="outline"
        className="flex items-center gap-2"
      >
        {isViewing ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
        Ver PDF
      </Button>
      
      <Button
        onClick={onGeneratePDF}
        disabled={isGenerating}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
      >
        {isGenerating ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Download className="h-4 w-4" />
        )}
        Download PDF
      </Button>
    </div>
  );
};

export default PDFActionButtons;
