
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { Plus, ExternalLink, Eye, Copy, Users } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import useSWR from 'swr'
import type { Database } from '@/integrations/supabase/types'

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
}

interface QuestionarioGroup {
  link_publico: string
  questionarios: Questionario[]
  totalRespostas: number
  progresso: number
}

const QuestionariosTab = () => {
  const { toast } = useToast()
  const [isCreating, setIsCreating] = useState(false)
  const [newLink, setNewLink] = useState('')
  const [selectedQuestionario, setSelectedQuestionario] = useState<Questionario | null>(null)
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())

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
      respostas_json: row.respostas_json as Record<string, string> | null
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
          const respostas = q.respostas_json ? Object.values(q.respostas_json).filter(r => r && r.trim().length > 0).length : 0
          return total + respostas
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

  const abrirQuestionario = (linkPublico: string) => {
    const url = `${window.location.origin}/questionario/${linkPublico}`
    window.open(url, '_blank')
  }

  const calcularProgresso = (respostas: Record<string, string> | null) => {
    if (!respostas) return 0
    const totalPerguntas = 48
    const respostasPreenchidas = Object.values(respostas).filter(r => r && r.trim().length > 0).length
    return Math.round((respostasPreenchidas / totalPerguntas) * 100)
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
                                  <Copy className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Copiar link</p>
                              </TooltipContent>
                            </Tooltip>
                            
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    abrirQuestionario(grupo.link_publico)
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
                        <div className="border rounded-lg overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Responsável</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Progresso</TableHead>
                                <TableHead>Criado em</TableHead>
                                <TableHead>Ações</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {grupo.questionarios.map((questionario) => (
                                <TableRow key={questionario.id}>
                                  <TableCell className="font-medium">
                                    {questionario.nome_responsavel === 'Aguardando preenchimento' ? 
                                      <span className="text-gray-500 italic">Não preenchido</span> : 
                                      questionario.nome_responsavel
                                    }
                                  </TableCell>
                                  <TableCell>
                                    {questionario.email === 'aguardando@preenchimento.com' ? 
                                      <span className="text-gray-500">-</span> : 
                                      questionario.email
                                    }
                                  </TableCell>
                                  <TableCell>{getStatusBadge(questionario.status)}</TableCell>
                                  <TableCell>
                                    {calcularProgresso(questionario.respostas_json)}%
                                  </TableCell>
                                  <TableCell>
                                    {new Date(questionario.data_criacao).toLocaleDateString('pt-BR')}
                                  </TableCell>
                                  <TableCell>
                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Button
                                              size="sm"
                                              variant="outline"
                                              onClick={() => setSelectedQuestionario(questionario)}
                                            >
                                              <Eye className="w-4 h-4" />
                                            </Button>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p>Ver respostas</p>
                                          </TooltipContent>
                                        </Tooltip>
                                      </DialogTrigger>
                                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                        <DialogHeader>
                                          <DialogTitle>Respostas do Questionário</DialogTitle>
                                          <DialogDescription>
                                            {selectedQuestionario?.nome_responsavel} - {selectedQuestionario?.email}
                                          </DialogDescription>
                                        </DialogHeader>
                                        
                                        {selectedQuestionario?.respostas_json && (
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
                                        )}
                                        
                                        {(!selectedQuestionario?.respostas_json || Object.keys(selectedQuestionario.respostas_json).length === 0) && (
                                          <div className="text-center py-8 text-gray-500">
                                            Nenhuma resposta registrada ainda
                                          </div>
                                        )}
                                      </DialogContent>
                                    </Dialog>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
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
      </div>
    </TooltipProvider>
  )
}

export default QuestionariosTab
