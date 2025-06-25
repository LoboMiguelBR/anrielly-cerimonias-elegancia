
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Copy, ExternalLink, Calendar, Tag, Sparkles } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import QuestionarioItem from "./QuestionarioItem";
import { Questionario } from '@/components/admin/tabs/types/questionario';

export interface QuestionarioGroup {
  link_publico: string;
  questionarios: Questionario[];
  totalRespostas: number;
  progresso: number;
  nome_evento?: string;
  tipo_evento?: string;
}

interface QuestionarioGroupProps {
  grupo: QuestionarioGroup;
  expanded: boolean;
  onToggle: () => void;
  onCopyLink: (link: string) => void;
  onViewAnswers: (questionario: Questionario) => void;
  onViewHistory: (questionario: Questionario) => void;
  onEdit: (questionario: Questionario) => void;
  onExport: (questionario: Questionario) => void;
  onDelete: (questionario: Questionario) => void;
  onHistoriaIA: (linkPublico: string) => void;
  isExporting: boolean;
}

const QuestionarioGroup = ({
  grupo,
  expanded,
  onToggle,
  onCopyLink,
  onViewAnswers,
  onViewHistory,
  onEdit,
  onExport,
  onDelete,
  onHistoriaIA,
  isExporting
}: QuestionarioGroupProps) => {
  const getQuestionarioLink = (linkPublico: string) => {
    return `${window.location.origin}/questionario/${linkPublico}`;
  };

  const getTipoEventoBadgeColor = (tipo?: string) => {
    switch (tipo?.toLowerCase()) {
      case 'casamento':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'aniversário':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'formatura':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'batizado':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Verifica se algum questionário do grupo já tem história gerada
  const hasHistoria = grupo.questionarios.some(q => q.historia_gerada);

  return (
    <Card className="border-l-4 border-l-rose-200">
      <Collapsible open={expanded} onOpenChange={onToggle}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Users className="w-5 h-5 text-rose-500" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold">
                      {grupo.nome_evento || grupo.link_publico}
                    </h3>
                    {grupo.tipo_evento && (
                      <Badge 
                        variant="outline" 
                        className={getTipoEventoBadgeColor(grupo.tipo_evento)}
                      >
                        <Tag className="w-3 h-3 mr-1" />
                        {grupo.tipo_evento}
                      </Badge>
                    )}
                    {hasHistoria && (
                      <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
                        <Sparkles className="w-3 h-3 mr-1" />
                        História IA
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {grupo.questionarios.length} pessoa(s)
                    </span>
                    <span>
                      Progresso geral: {grupo.progresso}%
                    </span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {grupo.link_publico}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        onHistoriaIA(grupo.link_publico);
                      }}
                      className={hasHistoria ? "bg-purple-50 border-purple-200 text-purple-700" : ""}
                    >
                      <Sparkles className="w-4 h-4 mr-1" />
                      História IA
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{hasHistoria ? 'Editar personalização da história' : 'Personalizar história com IA'}</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        onCopyLink(getQuestionarioLink(grupo.link_publico));
                      }}
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Copiar Link
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Copiar link do questionário</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(getQuestionarioLink(grupo.link_publico), '_blank');
                      }}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Abrir questionário</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="pt-0">
            <div className="space-y-4">
              {grupo.questionarios.map((questionario) => (
                <QuestionarioItem
                  key={questionario.id}
                  questionario={questionario}
                  onViewAnswers={onViewAnswers}
                  onViewHistory={onViewHistory}
                  onEdit={onEdit}
                  onExport={onExport}
                  onDelete={onDelete}
                  isExporting={isExporting}
                />
              ))}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default QuestionarioGroup;
