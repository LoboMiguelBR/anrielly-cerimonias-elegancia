
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Copy, ExternalLink, Sparkles } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import QuestionarioItem from "./QuestionarioItem";

export interface Questionario {
  id: string;
  link_publico: string;
  nome_responsavel: string;
  email: string;
  status: string;
  data_criacao: string;
  data_atualizacao: string;
  respostas_json: Record<string, string> | null;
  total_perguntas_resp: number;
  historia_gerada?: string;
}

export interface QuestionarioGroup {
  link_publico: string;
  questionarios: Questionario[];
  totalRespostas: number;
  progresso: number;
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
  isExporting
}: QuestionarioGroupProps) => {
  const getQuestionarioLink = (linkPublico: string) => {
    return `${window.location.origin}/questionario/${linkPublico}`;
  };

  return (
    <Card className="border-l-4 border-l-rose-200">
      <Collapsible open={expanded} onOpenChange={onToggle}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Users className="w-5 h-5 text-rose-500" />
                <div>
                  <h3 className="text-lg font-semibold">
                    Questionário: {grupo.link_publico}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {grupo.questionarios.length} pessoa(s) cadastrada(s) • Progresso geral: {grupo.progresso}%
                  </p>
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
