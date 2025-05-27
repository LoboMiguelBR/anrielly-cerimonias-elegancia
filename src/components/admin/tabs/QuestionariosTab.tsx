
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { Plus, ExternalLink, Users, Eye, Edit, Trash2, Download, Copy } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import useSWR from 'swr'
import type { Database } from '@/integrations/supabase/types'
import KPICards from './components/KPICards'
import QuestionarioEditModal from './components/QuestionarioEditModal'
import { useQuestionarioExport } from '@/hooks/useQuestionarioExport'

type QuestionarioRow = Database['public']['Tables']['questionarios_noivos']['Row']

interface Questionario {
  id: string
  link_publico: string
  nome_responsavel: string
  email: string
  status: string
  data_criacao: string
  data_atualizacao: string
  respostas_json: Record<string, string> | null
  total_perguntas_resp: number
}

interface QuestionarioGroup {
  link_publico: string
  questionarios: Questionario[]
  totalRespostas: number
  progresso: number
}

const QuestionariosTab = () => {
  const { toast } = useToast()
  const { exportQuestionario, isExporting } = useQuestionarioExport()
  const [isCreating, setIsCreating] = useState(false)
  const [newLink, setNewLink] = useState('')
  const [selectedQuestionario, setSelectedQuestionario] = useState<Questionario | null>(null)
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())
  const [editingQuestionario, setEditingQuestionario] = useState<Questionario | null>(null)
  const [deletingQuestionario, setDeletingQuestionario] = useState<Questionario | null>(null)

  const fetcher = async (): Promise<Questionario[]> => {
    const { data, error } = await supabase
      .from('questionarios_noivos')
      .select('*')
      .order('data_criacao', { ascending: false })
      
    if (error) throw error
    
    return (data || []).map((row: QuestionarioRow): Questionario => ({
      id: row.id,
      link_publico: row.link_publico,
      nome_responsavel: row.nome_responsavel,
      email: row.email,
      status: row.status || 'rascunho',
      data_criacao: row.data_criacao || '',
      data_atualizacao: row.data_atualizacao || '',
      respostas_json: row.respostas_json as Record<string, string> | null,
      total_perguntas_resp: row.total_perguntas_resp || 0
    }))
  }

  const { data: questionarios, error, mutate } = useSWR('questionarios_noivos', fetcher)

  // Agrupar questionários por link_publico
  const groupedQuestionarios: QuestionarioGroup[] = questionarios 
    ? Object.entries(
        questionarios.reduce((groups: Record<string, Questionario[]>, questionario) => {
          if (!groups[questionario.link_publico]) {
            groups[questionario.link_publico] = []
          }
          groups[questionario.link_publico].push(questionario)
          return groups
        }, {})
      ).map(([link_publico, questionariosDoGrupo]) => {
        const totalRespostas = questionariosDoGrupo.reduce((total, q) => {
          return total + (q.total_perguntas_resp || 0)
        }, 0)
        
        const maxPossivel = questionariosDoGrupo.length * 48 // 48 perguntas por pessoa
        const progresso = maxPossivel > 0 ? Math.round((totalRespostas / maxPossivel) * 100) : 0

        return {
          link_publico,
          questionarios: questionariosDoGrupo,
          totalRespostas,
          progresso
        }
      })
    : []

  const generateUniqueLink = () => {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 8)
    const generated = `noivos-${timestamp}-${random}`
    setNewLink(generated)
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copiado!",
        description: "Link copiado para a área de transferência",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar o link",
        variant: "destructive",
      })
    }
  }

  const criarNovoQuestionario = async () => {
    if (!newLink.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira um identificador para o link",
        variant: "destructive",
      })
      return
    }

    setIsCreating(true)
    try {
      // Verificar se o link já existe
      const { data: existing } = await supabase
        .from('questionarios_noivos')
        .select('id')
        .eq('link_publico', newLink)
        .limit(1)

      if (existing && existing.length > 0) {
        toast({
          title: "Erro",
          description: "Já existe um questionário com este link",
          variant: "destructive",
        })
        return
      }

      // Criar um registro inicial para reservar o link
      const { error: insertError } = await supabase
        .from('questionarios_noivos')
        .insert({
          link_publico: newLink,
          nome_responsavel: 'Aguardando preenchimento',
          email: 'aguardando@preenchimento.com',
          senha_hash: 'temp_hash_will_be_replaced_on_first_login'
        })

      if (insertError) {
        console.error('Erro ao criar questionário:', insertError)
        toast({
          title: "Erro",
          description: "Erro ao criar questionário no banco de dados",
          variant: "destructive",
        })
        return
      }

      const linkCompleto = `${window.location.origin}/questionario/${newLink}`
      
      toast({
        title: "Link criado com sucesso!",
        description: `Link criado e salvo no banco de dados`,
      })

      setNewLink('')
      
      // Atualizar a lista
      mutate()
      
      // Copiar para clipboard
      copyToClipboard(linkCompleto)
      
    } catch (error) {
      console.error('Erro ao criar questionário:', error)
      toast({
        title: "Erro",
        description: "Erro ao criar questionário",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusMap = {
      'rascunho': { label: 'Rascunho', variant: 'secondary' as const },
      'preenchido': { label: 'Preenchido', variant: 'default' as const },
      'revisado': { label: 'Revisado', variant: 'outline' as const },
      'concluido': { label: 'Concluído', variant: 'default' as const }
    }
    
    const config = statusMap[status as keyof typeof statusMap] || { label: status, variant: 'secondary' as const }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const calcularProgresso = (total_perguntas_resp: number) => {
    const totalPerguntas = 48
    return Math.round((total_perguntas_resp / totalPerguntas) * 100)
  }

  const getQuestionarioLink = (linkPublico: string) => {
    return `${window.location.origin}/questionario/${linkPublico}`
  }

  const toggleGroupExpansion = (linkPublico: string) => {
    const newExpanded = new Set(expandedGroups)
    if (newExpanded.has(linkPublico)) {
      newExpanded.delete(linkPublico)
    } else {
      newExpanded.add(linkPublico)
    }
    setExpandedGroups(newExpanded)
  }

  const handleDeleteQuestionario = async () => {
    if (!deletingQuestionario) return

    try {
      const { error } = await supabase
        .from('questionarios_noivos')
        .delete()
        .eq('id', deletingQuestionario.id)

      if (error) throw error

      toast({
        title: "Questionário excluído!",
        description: "O questionário foi removido com sucesso.",
      })

      mutate()
      setDeletingQuestionario(null)
    } catch (error) {
      console.error('Erro ao excluir:', error)
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir o questionário.",
        variant: "destructive",
      })
    }
  }

  const handleExport = async (questionario: Questionario, format: 'pdf' | 'word') => {
    await exportQuestionario(questionario.id, format)
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-red-500">Erro ao carregar questionários: {error.message}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* KPI Cards */}
        {questionarios && <KPICards questionarios={questionarios} />}

        <Card>
          <CardHeader>
            <CardTitle>Questionários de Noivos</CardTitle>
            <CardDescription>
              Gerencie os questionários de noivos e visualize as respostas. Agora suporta múltiplas pessoas por link (noivo e noiva).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <Label htmlFor="new-link">Identificador do Link</Label>
                <Input
                  id="new-link"
                  value={newLink}
                  onChange={(e) => setNewLink(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  placeholder="ex: casamento-joao-maria"
                />
              </div>
              <div className="flex flex-col sm:flex-row items-end gap-2">
                <Button onClick={generateUniqueLink} variant="outline">
                  Gerar Automático
                </Button>
                <Button onClick={criarNovoQuestionario} disabled={isCreating}>
                  <Plus className="w-4 h-4 mr-2" />
                  {isCreating ? 'Criando...' : 'Criar Link'}
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {groupedQuestionarios.map((grupo) => (
                <Card key={grupo.link_publico} className="border-l-4 border-l-rose-200">
                  <Collapsible 
                    open={expandedGroups.has(grupo.link_publico)}
                    onOpenChange={() => toggleGroupExpansion(grupo.link_publico)}
                  >
                    <CollapsibleTrigger asChild>
                      <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Users className="w-5 h-5 text-rose-500" />
                            <div>
                              <CardTitle className="text-lg">
                                Questionário: {grupo.link_publico}
                              </CardTitle>
                              <CardDescription>
                                {grupo.questionarios.length} pessoa(s) cadastrada(s) • Progresso geral: {grupo.progresso}%
                              </CardDescription>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    copyToClipboard(getQuestionarioLink(grupo.link_publico))
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
                                    e.stopPropagation()
                                    window.open(getQuestionarioLink(grupo.link_publico), '_blank')
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
                            <div key={questionario.id} className="border rounded-lg p-4 bg-white">
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
                                        onClick={() => setSelectedQuestionario(questionario)}
                                        className="h-8 w-8 p-0"
                                      >
                                        <Eye className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Ver respostas</TooltipContent>
                                  </Tooltip>

                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => setEditingQuestionario(questionario)}
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
                                        onClick={() => handleExport(questionario, 'pdf')}
                                        disabled={isExporting}
                                        className="h-8 w-8 p-0"
                                      >
                                        <Download className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Exportar PDF</TooltipContent>
                                  </Tooltip>

                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => setDeletingQuestionario(questionario)}
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
                          ))}
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              ))}
              
              {groupedQuestionarios.length === 0 && (
                <Card>
                  <CardContent className="text-center py-8 text-gray-500">
                    Nenhum questionário criado ainda
                  </CardContent>
                </Card>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Modal de Visualização de Respostas */}
        {selectedQuestionario && (
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle>Respostas do Questionário</CardTitle>
              <CardDescription>
                {selectedQuestionario.nome_responsavel} - {selectedQuestionario.email}
              </CardDescription>
              <Button onClick={() => setSelectedQuestionario(null)} variant="outline">
                Fechar
              </Button>
            </CardHeader>
            <CardContent className="max-h-[60vh] overflow-y-auto">
              {selectedQuestionario.respostas_json && Object.keys(selectedQuestionario.respostas_json).length > 0 ? (
                <div className="space-y-4">
                  {Object.entries(selectedQuestionario.respostas_json).map(([perguntaIndex, resposta]) => (
                    <div key={perguntaIndex} className="border-b pb-4">
                      <p className="font-medium text-sm text-gray-600 mb-2">
                        Pergunta {parseInt(perguntaIndex) + 1}
                      </p>
                      <p className="bg-gray-50 p-3 rounded text-sm">
                        {resposta || 'Não respondida'}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Nenhuma resposta registrada ainda
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Modal de Edição */}
        <QuestionarioEditModal
          open={!!editingQuestionario}
          onClose={() => setEditingQuestionario(null)}
          questionario={editingQuestionario}
          onSave={mutate}
        />

        {/* Dialog de Confirmação de Exclusão */}
        <AlertDialog open={!!deletingQuestionario} onOpenChange={(open) => !open && setDeletingQuestionario(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir Questionário</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir o questionário de{' '}
                <strong>{deletingQuestionario?.nome_responsavel}</strong>?
                Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteQuestionario} className="bg-red-600 hover:bg-red-700">
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </TooltipProvider>
  )
}

export default QuestionariosTab
