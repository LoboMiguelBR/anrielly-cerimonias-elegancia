
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { Plus, ExternalLink, Download, Eye } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import useSWR from 'swr'

interface Questionario {
  id: string
  link_publico: string
  nome_responsavel: string
  email: string
  status: string
  data_criacao: string
  data_atualizacao: string
  respostas_json: Record<string, string>
}

const QuestionariosTab = () => {
  const { toast } = useToast()
  const [isCreating, setIsCreating] = useState(false)
  const [newLink, setNewLink] = useState('')
  const [selectedQuestionario, setSelectedQuestionario] = useState<Questionario | null>(null)

  const fetcher = async (): Promise<Questionario[]> => {
    const { data, error } = await supabase
      .from('questionarios_noivos')
      .select('*')
      .order('data_criacao', { ascending: false })
      
    if (error) throw error
    return data || []
  }

  const { data: questionarios, error, mutate } = useSWR('questionarios_noivos', fetcher)

  const generateUniqueLink = () => {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 8)
    return `noivos-${timestamp}-${random}`
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
        .single()

      if (existing) {
        toast({
          title: "Erro",
          description: "Já existe um questionário com este link",
          variant: "destructive",
        })
        return
      }

      const linkCompleto = `${window.location.origin}/questionario/${newLink}`
      
      toast({
        title: "Link criado com sucesso!",
        description: `Link: ${linkCompleto}`,
      })

      setNewLink('')
      
      // Copiar para clipboard
      navigator.clipboard.writeText(linkCompleto)
      
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

  const calcularProgresso = (respostas: Record<string, string>) => {
    const totalPerguntas = 48
    const respostasPreenchidas = Object.values(respostas).filter(r => r && r.trim().length > 0).length
    return Math.round((respostasPreenchidas / totalPerguntas) * 100)
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Questionários de Noivos</CardTitle>
          <CardDescription>
            Gerencie os questionários de noivos e visualize as respostas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <Label htmlFor="new-link">Identificador do Link</Label>
              <Input
                id="new-link"
                value={newLink}
                onChange={(e) => setNewLink(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                placeholder="ex: casamento-joao-maria"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={generateUniqueLink} variant="outline" className="mr-2">
                Gerar Automático
              </Button>
              <Button onClick={criarNovoQuestionario} disabled={isCreating}>
                <Plus className="w-4 h-4 mr-2" />
                {isCreating ? 'Criando...' : 'Criar Link'}
              </Button>
            </div>
          </div>

          <div className="border rounded-lg">
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
                {questionarios?.map((questionario) => (
                  <TableRow key={questionario.id}>
                    <TableCell className="font-medium">
                      {questionario.nome_responsavel || 'Não preenchido'}
                    </TableCell>
                    <TableCell>{questionario.email || '-'}</TableCell>
                    <TableCell>{getStatusBadge(questionario.status)}</TableCell>
                    <TableCell>
                      {questionario.respostas_json ? 
                        `${calcularProgresso(questionario.respostas_json)}%` : '0%'
                      }
                    </TableCell>
                    <TableCell>
                      {new Date(questionario.data_criacao).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => abrirQuestionario(questionario.link_publico)}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                        
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedQuestionario(questionario)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
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
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                
                {questionarios?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      Nenhum questionário criado ainda
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default QuestionariosTab
