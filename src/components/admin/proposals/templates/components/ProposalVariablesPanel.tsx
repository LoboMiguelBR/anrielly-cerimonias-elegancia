
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getProposalVariablesGrouped } from '../../variables/proposalVariables';

interface ProposalVariablesPanelProps {
  onVariableClick: (variable: string) => void;
}

const ProposalVariablesPanel = ({ onVariableClick }: ProposalVariablesPanelProps) => {
  const variableGroups = getProposalVariablesGrouped();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Variáveis Disponíveis</CardTitle>
        <p className="text-sm text-gray-600">
          Clique nas variáveis abaixo para inseri-las no template
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {variableGroups.map((group) => (
            <div key={group.category} className="space-y-2">
              <h4 className="font-semibold text-sm text-gray-700">
                {group.label}
              </h4>
              <div className="space-y-1">
                {group.variables.map((variable) => (
                  <Button
                    key={variable.key}
                    variant="ghost"
                    size="sm"
                    onClick={() => onVariableClick(variable.variable)}
                    className="justify-start w-full text-left h-auto p-2"
                  >
                    <div>
                      <div className="text-xs text-gray-600">{variable.label}</div>
                      <Badge variant="secondary" className="text-xs">
                        {variable.variable}
                      </Badge>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProposalVariablesPanel;
