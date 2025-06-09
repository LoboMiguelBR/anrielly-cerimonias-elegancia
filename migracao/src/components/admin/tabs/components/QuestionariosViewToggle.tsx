
import { Button } from "@/components/ui/button";
import { List, LayoutGrid } from "lucide-react";

interface QuestionariosViewToggleProps {
  viewMode: 'grouped' | 'table';
  onViewModeChange: (mode: 'grouped' | 'table') => void;
}

const QuestionariosViewToggle = ({ viewMode, onViewModeChange }: QuestionariosViewToggleProps) => {
  return (
    <div className="flex items-center border rounded-lg p-1">
      <Button
        variant={viewMode === 'grouped' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewModeChange('grouped')}
        className="flex items-center gap-2"
      >
        <LayoutGrid className="h-4 w-4" />
        Agrupado
      </Button>
      <Button
        variant={viewMode === 'table' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewModeChange('table')}
        className="flex items-center gap-2"
      >
        <List className="h-4 w-4" />
        Lista
      </Button>
    </div>
  );
};

export default QuestionariosViewToggle;
