
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Edit3, Save, X, Trash2 } from 'lucide-react'

interface QuestionarioTemplateSecao {
  id: string
  template_id: string
  titulo: string
  descricao?: string
  ordem: number
  ativo: boolean
  created_at: string
  updated_at: string
}

interface TemplateSecaoEditorProps {
  secao: QuestionarioTemplateSecao
  onUpdate: (secaoId: string, updates: Partial<QuestionarioTemplateSecao>) => Promise<boolean>
  onDelete: (secaoId: string) => Promise<boolean>
}

const TemplateSecaoEditor = ({ secao, onUpdate, onDelete }: TemplateSecaoEditorProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [titulo, setTitulo] = useState(secao.titulo)
  const [descricao, setDescricao] = useState(secao.descricao || '')
  const [ativo, setAtivo] = useState(secao.ativo)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const success = await onUpdate(secao.id, {
        titulo,
        descricao: descricao || null,
        ativo
      })
      
      if (success) {
        setIsEditing(false)
      }
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setTitulo(secao.titulo)
    setDescricao(secao.descricao || '')
    setAtivo(secao.ativo)
    setIsEditing(false)
  }

  const handleDelete = async () => {
    if (window.confirm('Tem certeza que deseja excluir esta seção? Todas as perguntas da seção também serão excluídas.')) {
      await onDelete(secao.id)
    }
  }

  if (isEditing) {
    return (
      <div className="border rounded-lg p-4 space-y-4 bg-blue-50">
        <div>
          <Label htmlFor={`titulo-${secao.id}`}>Título da Seção</Label>
          <Input
            id={`titulo-${secao.id}`}
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Digite o título da seção"
          />
        </div>
        
        <div>
          <Label htmlFor={`descricao-${secao.id}`}>Descrição (opcional)</Label>
          <Textarea
            id={`descricao-${secao.id}`}
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Digite uma descrição para a seção"
            rows={2}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id={`ativo-${secao.id}`}
            checked={ativo}
            onCheckedChange={setAtivo}
          />
          <Label htmlFor={`ativo-${secao.id}`}>Seção ativa</Label>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={handleSave} 
            disabled={isSaving || !titulo.trim()}
            size="sm"
          >
            <Save className="h-4 w-4 mr-1" />
            {isSaving ? 'Salvando...' : 'Salvar'}
          </Button>
          <Button 
            variant="outline" 
            onClick={handleCancel}
            size="sm"
          >
            <X className="h-4 w-4 mr-1" />
            Cancelar
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="border rounded-lg p-4 hover:bg-gray-50">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium">{secao.titulo}</h4>
            <Badge variant="outline" className="text-xs">
              Ordem: {secao.ordem}
            </Badge>
            {!secao.ativo && (
              <Badge variant="secondary" className="text-xs">
                Inativa
              </Badge>
            )}
          </div>
          {secao.descricao && (
            <p className="text-sm text-gray-600">{secao.descricao}</p>
          )}
        </div>
        
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
          >
            <Edit3 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default TemplateSecaoEditor
