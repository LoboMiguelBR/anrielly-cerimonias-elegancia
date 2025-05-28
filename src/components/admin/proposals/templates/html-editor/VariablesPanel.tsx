
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { getAvailableVariables } from './variableUtils';

interface VariablesPanelProps {
  onInsertVariable: (category: string, variableName: string) => void;
}

const VariablesPanel: React.FC<VariablesPanelProps> = ({ onInsertVariable }) => {
  // Get variables with proper typing
  const allVariables = getAvailableVariables();
  
  // Group variables by category with proper typing
  const variablesByCategory = allVariables.reduce((acc, variable) => {
    if (!acc[variable.category]) {
      acc[variable.category] = [];
    }
    acc[variable.category].push(variable);
    return acc;
  }, {} as Record<string, typeof allVariables>);

  return (
    <div className="variables-panel">
      <Accordion type="multiple" defaultValue={['Cliente']}>
        {Object.entries(variablesByCategory).map(([category, variables]) => (
          <AccordionItem key={category} value={category}>
            <AccordionTrigger className="text-sm capitalize">
              {category}
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-2 gap-2 p-2">
                {variables.map(variable => (
                  <Button
                    key={`${variable.category}.${variable.name}`}
                    variant="outline"
                    size="sm"
                    className="justify-start text-xs"
                    title={variable.description}
                    onClick={() => onInsertVariable(variable.category, variable.name)}
                  >
                    {variable.name}
                  </Button>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default VariablesPanel;
