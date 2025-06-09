
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getAvailableVariables } from '../html-editor/variableUtils';

interface ProposalVariablesPanelProps {
  onVariableClick: (variable: string) => void;
}

const ProposalVariablesPanel = ({ onVariableClick }: ProposalVariablesPanelProps) => {
  const allVariables = getAvailableVariables();
  
  // Group variables by category
  const variablesByCategory = allVariables.reduce((acc, variable) => {
    if (!acc[variable.category]) {
      acc[variable.category] = [];
    }
    acc[variable.category].push(variable);
    return acc;
  }, {} as Record<string, typeof allVariables>);

  // Define category icons and colors
  const categoryConfig = {
    'Cliente': { icon: '👤', color: 'bg-blue-100 text-blue-800' },
    'Evento': { icon: '🎉', color: 'bg-purple-100 text-purple-800' },
    'Financeiro': { icon: '💰', color: 'bg-green-100 text-green-800' },
    'Serviços': { icon: '📋', color: 'bg-orange-100 text-orange-800' },
    'Galeria': { icon: '🖼️', color: 'bg-pink-100 text-pink-800' },
    'Depoimentos': { icon: '💬', color: 'bg-indigo-100 text-indigo-800' },
    'Outros': { icon: '📝', color: 'bg-gray-100 text-gray-800' }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Variáveis Disponíveis</CardTitle>
        <p className="text-sm text-gray-600">
          Clique nas variáveis abaixo para inseri-las no template
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.entries(variablesByCategory).map(([category, variables]) => {
            const config = categoryConfig[category as keyof typeof categoryConfig] || categoryConfig['Outros'];
            
            return (
              <div key={category} className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{config.icon}</span>
                  <h4 className="font-semibold text-sm text-gray-700">{category}</h4>
                  <Badge variant="secondary" className={`text-xs ${config.color}`}>
                    {variables.length}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 gap-2">
                  {variables.map((variable) => (
                    <Button
                      key={`${variable.category}.${variable.name}`}
                      variant="ghost"
                      size="sm"
                      onClick={() => onVariableClick(`{{${variable.name}}}`)}
                      className="justify-start w-full text-left h-auto p-3 hover:bg-gray-50"
                    >
                      <div className="w-full">
                        <div className="flex items-center justify-between mb-1">
                          <Badge variant="outline" className="text-xs font-mono">
                            {`{{${variable.name}}}`}
                          </Badge>
                          {variable.name.includes(':') && (
                            <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
                              Dinâmica
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-gray-600">{variable.description}</div>
                      </div>
                    </Button>
                  ))}
                </div>
                
                {/* Show examples for dynamic categories */}
                {category === 'Galeria' && (
                  <div className="mt-2 p-3 bg-pink-50 rounded-lg">
                    <p className="text-xs text-pink-700 font-medium mb-1">💡 Exemplos de uso:</p>
                    <div className="text-xs text-pink-600 space-y-1">
                      <div><code>{'{{gallery_images}}'}</code> - Todas as imagens</div>
                      <div><code>{'{{gallery_images:6}}'}</code> - Primeiras 6 imagens</div>
                      <div><code>{'{{gallery_images:4:grid:2}}'}</code> - Grid 2 colunas, 4 imagens</div>
                      <div><code>{'{{gallery_images:3:carousel}}'}</code> - Carrossel com 3 imagens</div>
                    </div>
                  </div>
                )}
                
                {category === 'Depoimentos' && (
                  <div className="mt-2 p-3 bg-indigo-50 rounded-lg">
                    <p className="text-xs text-indigo-700 font-medium mb-1">💡 Exemplos de uso:</p>
                    <div className="text-xs text-indigo-600 space-y-1">
                      <div><code>{'{{testimonials}}'}</code> - Todos os depoimentos</div>
                      <div><code>{'{{testimonials:3}}'}</code> - Primeiros 3 depoimentos</div>
                      <div><code>{'{{testimonials:2:grid}}'}</code> - Grid com 2 depoimentos</div>
                      <div><code>{'{{testimonials:4:carousel}}'}</code> - Carrossel com 4 depoimentos</div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProposalVariablesPanel;
