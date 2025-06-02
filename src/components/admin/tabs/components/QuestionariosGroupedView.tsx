
import { useState, useMemo } from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter, Users } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import QuestionarioGroup from "./QuestionarioGroup";
import { Questionario, EventoGroup } from '@/components/admin/tabs/types/questionario';
import { TIPOS_EVENTO } from '@/utils/eventSlugGenerator';

interface QuestionariosGroupedViewProps {
  questionarios: Questionario[];
  onViewAnswers: (questionario: Questionario) => void;
  onViewHistory: (questionario: Questionario) => void;
  onEdit: (questionario: Questionario) => void;
  onExport: (questionario: Questionario) => void;
  onDelete: (questionario: Questionario) => void;
  isExporting: boolean;
}

const QuestionariosGroupedView = ({
  questionarios,
  onViewAnswers,
  onViewHistory,
  onEdit,
  onExport,
  onDelete,
  isExporting
}: QuestionariosGroupedViewProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [tipoEventoFilter, setTipoEventoFilter] = useState('todos');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  // Agrupar questionários por link_publico (evento)
  const eventGroups = useMemo(() => {
    // Filtrar questionários primeiro
    const filteredQuestionarios = questionarios.filter(q => {
      const matchesSearch = 
        q.nome_evento?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.nome_responsavel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.link_publico.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'todos' || q.status === statusFilter;
      const matchesTipo = tipoEventoFilter === 'todos' || q.tipo_evento === tipoEventoFilter;

      return matchesSearch && matchesStatus && matchesTipo;
    });

    // Agrupar por link_publico
    const groupsMap = new Map<string, EventoGroup>();

    filteredQuestionarios.forEach(questionario => {
      const key = questionario.link_publico;
      
      if (!groupsMap.has(key)) {
        const totalRespostas = questionario.total_perguntas_resp || 0;
        const progresso = Math.round((totalRespostas / 48) * 100);

        groupsMap.set(key, {
          link_publico: questionario.link_publico,
          nome_evento: questionario.nome_evento || `Evento ${questionario.link_publico}`,
          tipo_evento: questionario.tipo_evento || 'Não definido',
          questionarios: [questionario],
          totalRespostas,
          progresso
        });
      } else {
        const group = groupsMap.get(key)!;
        group.questionarios.push(questionario);
        
        // Recalcular progresso do grupo (média)
        const totalProgressos = group.questionarios.reduce((sum, q) => {
          return sum + Math.round(((q.total_perguntas_resp || 0) / 48) * 100);
        }, 0);
        group.progresso = Math.round(totalProgressos / group.questionarios.length);
        
        // Somar total de respostas
        group.totalRespostas = group.questionarios.reduce((sum, q) => sum + (q.total_perguntas_resp || 0), 0);
      }
    });

    return Array.from(groupsMap.values()).sort((a, b) => {
      // Ordenar por nome do evento
      return a.nome_evento.localeCompare(b.nome_evento);
    });
  }, [questionarios, searchTerm, statusFilter, tipoEventoFilter]);

  const handleToggleGroup = (linkPublico: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(linkPublico)) {
        newSet.delete(linkPublico);
      } else {
        newSet.add(linkPublico);
      }
      return newSet;
    });
  };

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    toast({
      title: "Link copiado!",
      description: "O link do questionário foi copiado para a área de transferência.",
    });
  };

  const handleExpandAll = () => {
    if (expandedGroups.size === eventGroups.length) {
      setExpandedGroups(new Set());
    } else {
      setExpandedGroups(new Set(eventGroups.map(g => g.link_publico)));
    }
  };

  return (
    <div className="space-y-6">
      {/* Filtros e Busca */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar por evento, responsável ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os Status</SelectItem>
              <SelectItem value="rascunho">Rascunho</SelectItem>
              <SelectItem value="enviado">Enviado</SelectItem>
              <SelectItem value="preenchido">Preenchido</SelectItem>
              <SelectItem value="concluido">Concluído</SelectItem>
            </SelectContent>
          </Select>

          <Select value={tipoEventoFilter} onValueChange={setTipoEventoFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os Tipos</SelectItem>
              {TIPOS_EVENTO.map((tipo) => (
                <SelectItem key={tipo} value={tipo}>
                  {tipo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={handleExpandAll}
            className="flex items-center gap-2"
          >
            <Users className="h-4 w-4" />
            {expandedGroups.size === eventGroups.length ? 'Recolher' : 'Expandir'} Todos
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-rose-600">{eventGroups.length}</p>
            <p className="text-sm text-gray-600">Eventos</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-600">
              {eventGroups.reduce((sum, group) => sum + group.questionarios.length, 0)}
            </p>
            <p className="text-sm text-gray-600">Questionários</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">
              {eventGroups.reduce((sum, group) => sum + group.totalRespostas, 0)}
            </p>
            <p className="text-sm text-gray-600">Respostas Totais</p>
          </div>
        </div>
      </div>

      {/* Lista de Grupos */}
      <div className="space-y-4">
        {eventGroups.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-lg border">
            <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum evento encontrado
            </h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'todos' || tipoEventoFilter !== 'todos' 
                ? 'Tente ajustar os filtros de busca' 
                : 'Crie seu primeiro questionário para começar'
              }
            </p>
          </div>
        ) : (
          eventGroups.map((group) => (
            <QuestionarioGroup
              key={group.link_publico}
              grupo={{
                link_publico: group.link_publico,
                questionarios: group.questionarios,
                totalRespostas: group.totalRespostas,
                progresso: group.progresso,
                nome_evento: group.nome_evento,
                tipo_evento: group.tipo_evento
              }}
              expanded={expandedGroups.has(group.link_publico)}
              onToggle={() => handleToggleGroup(group.link_publico)}
              onCopyLink={handleCopyLink}
              onViewAnswers={onViewAnswers}
              onViewHistory={onViewHistory}
              onEdit={onEdit}
              onExport={onExport}
              onDelete={onDelete}
              isExporting={isExporting}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default QuestionariosGroupedView;
