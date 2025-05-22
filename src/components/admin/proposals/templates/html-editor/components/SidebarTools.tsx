
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import VariablesPanel from '../VariablesPanel';
import AssetsPanel from '../AssetsPanel';
import { TemplateAsset } from '../types';

interface SidebarToolsProps {
  activeEditor: 'html' | 'css';
  currentCursorPosition: number;
  onInsertVariable: (category: string, variableName: string) => void;
  onSelectAsset: (asset: TemplateAsset) => void;
}

const SidebarTools: React.FC<SidebarToolsProps> = ({
  activeEditor,
  currentCursorPosition,
  onInsertVariable,
  onSelectAsset
}) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Variáveis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 max-h-[250px] overflow-y-auto">
          <VariablesPanel 
            onInsertVariable={onInsertVariable}
          />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Imagens e Recursos</CardTitle>
        </CardHeader>
        <CardContent>
          <AssetsPanel onSelectAsset={onSelectAsset} />
        </CardContent>
      </Card>
    </div>
  );
};

export default SidebarTools;
