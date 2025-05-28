
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, FileText, Trash2, Sparkles } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { Questionario } from "./QuestionarioGroup";

interface QuestionarioItemProps {
  questionario: Questionario;
  onViewAnswers: (questionario: Questionario) => void;
  onViewHistory: (questionario: Questionario) => void;
  onEdit: (questionario: Questionario) => void;
  onExport: (questionario: Questionario) => void;
  onDelete: (questionario: Questionario) => void;
  isExporting: boolean;
}

const QuestionarioItem = ({
  questionario,
  onViewAnswers,
  onViewHistory,
  onEdit,
  onExport,
  onDelete,
  isExporting
}: QuestionarioItemProps) => {
  const getStatusBadge = (status: string) => {
    const statusMap = {
      'rascunho': { label: 'Rascunho', variant: 'secondary' as const },
      'preenchido': { label: 'Preenchido', variant: 'default' as const },
      'revisado': { label: 'Revisado', variant: 'outline' as const },
      'concluido': { label: 'Concluído', variant: 'default' as const }
    };
    
    const config = statusMap[status as keyof typeof statusMap] || { label: status, variant: 'secondary' as const };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const calcularProgresso = (total_perguntas_resp: number) => {
    const totalPerguntas = 48;
    return Math.round((total_perguntas_resp / totalPerguntas) * 100);
  };

  return (
    <div className="border rounded-lg p-4 bg-white">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-2">
            <div>
              <p className="font-medium">
                {questionario.nome_responsavel === 'Aguardando preenchimento' ? 
                  <span className="text-gray-500 italic">Não preenchido</span> : 
                  questionario.nome_responsavel
                }
              </p>
              <p className="text-sm text-gray-600">
                {questionario.email === 'aguardando@preenchimento.com' ? 
                  <span className="text-gray-500">Email não definido</span> : 
                  questionario.email
                }
              </p>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(questionario.status)}
              {questionario.historia_gerada && (
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                  <Sparkles className="w-3 h-3 mr-1" />
                  História IA
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm">
              Progresso: {calcularProgresso(questionario.total_perguntas_resp)}%
            </span>
            <div className="w-32 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-rose-500 h-2 rounded-full transition-all"
                style={{ width: `${calcularProgresso(questionario.total_perguntas_resp)}%` }}
              />
            </div>
            <span className="text-xs text-gray-500">
              {questionario.total_perguntas_resp}/48
            </span>
          </div>
          
          <p className="text-xs text-gray-500">
            Criado em: {new Date(questionario.data_criacao).toLocaleDateString('pt-BR')}
          </p>
        </div>
        
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onViewAnswers(questionario)}
                className="h-8 w-8 p-0"
              >
                <Eye className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Ver respostas</TooltipContent>
          </Tooltip>

          {questionario.historia_gerada && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onViewHistory(questionario)}
                  className="h-8 w-8 p-0 text-purple-600"
                >
                  <Sparkles className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Ver História IA</TooltipContent>
            </Tooltip>
          )}

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onEdit(questionario)}
                className="h-8 w-8 p-0"
              >
                <Edit className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Editar</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onExport(questionario)}
                disabled={isExporting}
                className="h-8 w-8 p-0"
              >
                <FileText className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Exportar Word</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onDelete(questionario)}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Excluir</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default QuestionarioItem;
