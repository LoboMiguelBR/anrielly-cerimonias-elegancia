
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ChevronDown, ChevronUp, Edit, Trash2, Plus, GripVertical } from 'lucide-react'
import { useQuestionarioStructure } from '@/hooks/useQuestionarioStructure'

interface QuestionarioStructureEditorProps {
  questionarioId: string
  structure: any
}

const QuestionarioStructureEditor = ({ questionarioId, structure }: QuestionarioStructureEditorProps) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())
  const [editingPergunta, setEditingPergunta] = useState<any>(null)
  const [showAddPergunta, setShowAddPergunta] = useState<string | null>(null)
  
  const {
    updateSecao,
    updatePergunta,
    deletePergunta,
    addPergunta,
    reorderPerguntas
  } = useQuestionarioStructure(questionarioId)

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId)
    } else {
      newExpanded.add(sectionId)
    }
    setExpandedSections(newExpanded)
  }

  const handleEditPergunta = (pergunta: any) => {
    setEditingPergunta(pergunta)
  }

  const handleSavePergunta = async (perguntaData: any) => {
    if (editingPergunta) {
      await updatePergunta(editingPergunta.id, perguntaData)
    } else if (showAddPergunta) {
      const maxOrdem = Math.max(
        ...structure.perguntas
          .filter((p: any) => p.secao_id === showAddPergunta)
          .map((p: any) => p.ordem),
        0
      )
      
      await addPergunta(showAddPergunta, {
        questionario_id: questionarioId,
        secao_id: showAddPergunta,
        ordem: maxOrdem + 1,
        ...perguntaData
      })
    }
    
    setEditingPergunta(null)
    setShowAddPergunta(null)
  }

  const handleDeletePergunta = async (perguntaId: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta pergunta?')) {
      await deletePergunta(perguntaId)
    }
  }

  const movePergunta = async (perguntaId: string, direction: 'up' | 'down') => {
    const pergunta = structure.perguntas.find((p: any) => p.id === perguntaId)
    if (!pergunta) return

    const perguntasSecao = structure.perguntas
      .filter((p: any) => p.secao_id === pergunta.secao_id)
      .sort((a: any, b: any) => a.ordem - b.ordem)

    const currentIndex = perguntasSecao.findIndex((p: any) => p.id === perguntaId)
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1

    if (targetIndex < 0 || targetIndex >= perguntasSecao.length) return

    // Trocar ordens
    const updates = [
      { id: perguntasSecao[currentIndex].id, ordem: perguntasSecao[targetIndex].ordem },
      { id: perguntasSecao[targetIndex].id, ordem: perguntasSecao[currentIndex].ordem }
    ]

    await reorderPerguntas(updates)
  }

  if (!structure) return null

  return (
    <TooltipProvider>
      <div className="h-full flex flex-col">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {structure.secoes.map((secao: any) => {
              const perguntasSecao = structure.perguntas
                .filter((p: any) => p.secao_id === secao.id)
                .sort((a: any, b: any) => a.ordem - b.ordem)
              
              const isExpanded = expandedSections.has(secao.id)
              
              return (
                <Card key={secao.id}>
                  <CardHeader 
                    className="cursor-pointer" 
                    onClick={() => toggleSection(secao.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{secao.titulo}</CardTitle>
                        {secao.descricao && (
                          <p className="text-sm text-gray-600 mt-1">{secao.descricao}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {perguntasSecao.length} {perguntasSecao.length === 1 ? 'pergunta' : 'perguntas'}
                        </Badge>
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </div>
                    </div>
                  </CardHeader>
                  
                  {isExpanded && (
                    <CardContent>
                      <div className="space-y-3">
                        {perguntasSecao.map((pergunta: any, index: number) => (
                          <div key={pergunta.id} className="border rounded-lg p-4 bg-gray-50">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                  <GripVertical className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                  <span className="text-sm font-medium">#{pergunta.ordem}</span>
                                  <Badge variant={pergunta.ativo ? 'default' : 'secondary'} className="text-xs">
                                    {pergunta.ativo ? 'Ativa' : 'Inativa'}
                                  </Badge>
                                  {pergunta.obrigatoria && (
                                    <Badge variant="destructive" className="text-xs">Obrigatória</Badge>
                                  )}
                                </div>
                                <p className="text-sm font-medium text-gray-900 mb-1">{pergunta.texto}</p>
                                <p className="text-xs text-gray-500">
                                  Tipo: {pergunta.tipo_resposta}
                                </p>
                              </div>
                              
                              <div className="flex items-center gap-1 flex-shrink-0">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => movePergunta(pergunta.id, 'up')}
                                      disabled={index === 0}
                                      className="h-8 w-8 p-0"
                                    >
                                      <ChevronUp className="h-3 w-3" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Mover para cima</TooltipContent>
                                </Tooltip>
                                
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => movePergunta(pergunta.id, 'down')}
                                      disabled={index === perguntasSecao.length - 1}
                                      className="h-8 w-8 p-0"
                                    >
                                      <ChevronDown className="h-3 w-3" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Mover para baixo</TooltipContent>
                                </Tooltip>
                                
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleEditPergunta(pergunta)}
                                      className="h-8 w-8 p-0"
                                    >
                                      <Edit className="h-3 w-3" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Editar pergunta</TooltipContent>
                                </Tooltip>
                                
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleDeletePergunta(pergunta.id)}
                                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Excluir pergunta</TooltipContent>
                                </Tooltip>
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowAddPergunta(secao.id)}
                          className="w-full"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Adicionar Pergunta
                        </Button>
                      </div>
                    </CardContent>
                  )}
                </Card>
              )
            })}
          </div>
        </ScrollArea>

        {/* Modal de Edição/Adição de Pergunta */}
        <PerguntaEditModal
          pergunta={editingPergunta}
          isOpen={!!(editingPergunta || showAddPergunta)}
          onClose={() => {
            setEditingPergunta(null)
            setShowAddPergunta(null)
          }}
          onSave={handleSavePergunta}
        />
      </div>
    </TooltipProvider>
  )
}

interface PerguntaEditModalProps {
  pergunta: any
  isOpen: boolean
  onClose: () => void
  onSave: (perguntaData: any) => void
}

const PerguntaEditModal = ({ pergunta, isOpen, onClose, onSave }: PerguntaEditModalProps) => {
  const [formData, setFormData] = useState({
    texto: pergunta?.texto || '',
    tipo_resposta: pergunta?.tipo_resposta || 'texto_longo',
    placeholder: pergunta?.placeholder || '',
    obrigatoria: pergunta?.obrigatoria || false,
    ativo: pergunta?.ativo !== false
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      await onSave(formData)
      onClose()
    } catch (error) {
      console.error('Erro ao salvar pergunta:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {pergunta ? 'Editar Pergunta' : 'Nova Pergunta'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="texto">Texto da Pergunta *</Label>
            <Textarea
              id="texto"
              value={formData.texto}
              onChange={(e) => setFormData({ ...formData, texto: e.target.value })}
              placeholder="Digite a pergunta..."
              required
            />
          </div>

          <div>
            <Label htmlFor="tipo_resposta">Tipo de Resposta</Label>
            <Select
              value={formData.tipo_resposta}
              onValueChange={(value) => setFormData({ ...formData, tipo_resposta: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="texto_curto">Texto Curto</SelectItem>
                <SelectItem value="texto_longo">Texto Longo</SelectItem>
                <SelectItem value="numero">Número</SelectItem>
                <SelectItem value="data">Data</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="telefone">Telefone</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="placeholder">Placeholder (opcional)</Label>
            <Input
              id="placeholder"
              value={formData.placeholder}
              onChange={(e) => setFormData({ ...formData, placeholder: e.target.value })}
              placeholder="Texto de exemplo para o campo..."
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="obrigatoria"
              checked={formData.obrigatoria}
              onCheckedChange={(checked) => setFormData({ ...formData, obrigatoria: checked })}
            />
            <Label htmlFor="obrigatoria">Pergunta obrigatória</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="ativo"
              checked={formData.ativo}
              onCheckedChange={(checked) => setFormData({ ...formData, ativo: checked })}
            />
            <Label htmlFor="ativo">Pergunta ativa</Label>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default QuestionarioStructureEditor
