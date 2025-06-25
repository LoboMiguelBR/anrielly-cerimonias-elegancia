
import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Save, X } from 'lucide-react'

interface QuestionarioTemplatePergunta {
  id: string
  template_id: string
  secao_id: string
  texto: string
  tipo_resposta: string
  placeholder?: string
  opcoes_resposta?: any
  validacoes?: any
  obrigatoria: boolean
  ordem: number
  ativo: boolean
  created_at: string
  updated_at: string
}

interface TemplatePerguntaModalProps {
  isOpen: boolean
  onClose: () => void
  pergunta?: QuestionarioTemplatePergunta
  secaoId: string
  templateId: string
  onSave: (perguntaId: string | null, perguntaData: any) => Promise<boolean>
}

const TIPOS_RESPOSTA = [
  { value: 'texto_curto', label: 'Texto Curto' },
  { value: 'texto_longo', label: 'Texto Longo' },
  { value: 'numero', label: 'Número' },
  { value: 'data', label: 'Data' },
  { value: 'email', label: 'E-mail' },
  { value: 'telefone', label: 'Telefone' },
  { value: 'multipla_escolha', label: 'Múltipla Escolha' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'radio', label: 'Radio Button' }
]

const TemplatePerguntaModal = ({ 
  isOpen, 
  onClose, 
  pergunta, 
  secaoId, 
  templateId, 
  onSave 
}: TemplatePerguntaModalProps) => {
  const [texto, setTexto] = useState('')
  const [tipoResposta, setTipoResposta] = useState('texto_longo')
  const [placeholder, setPlaceholder] = useState('')
  const [obrigatoria, setObrigatoria] = useState(false)
  const [ativo, setAtivo] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const isEditMode = !!pergunta

  useEffect(() => {
    if (pergunta) {
      setTexto(pergunta.texto)
      setTipoResposta(pergunta.tipo_resposta)
      setPlaceholder(pergunta.placeholder || '')
      setObrigatoria(pergunta.obrigatoria)
      setAtivo(pergunta.ativo)
    } else {
      // Reset para nova pergunta
      setTexto('')
      setTipoResposta('texto_longo')
      setPlaceholder('')
      setObrigatoria(false)
      setAtivo(true)
    }
  }, [pergunta, isOpen])

  const handleSave = async () => {
    if (!texto.trim()) return

    setIsSaving(true)
    try {
      const perguntaData = {
        template_id: templateId,
        secao_id: secaoId,
        texto: texto.trim(),
        tipo_resposta: tipoResposta,
        placeholder: placeholder.trim() || null,
        obrigatoria,
        ativo,
        ordem: pergunta?.ordem || 0
      }

      const success = await onSave(pergunta?.id || null, perguntaData)
      
      if (success) {
        onClose()
      }
    } finally {
      setIsSaving(false)
    }
  }

  const handleClose = () => {
    if (!isSaving) {
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? 'Editar Pergunta' : 'Nova Pergunta'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="texto">Texto da Pergunta *</Label>
            <Textarea
              id="texto"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Digite o texto da pergunta"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="tipo-resposta">Tipo de Resposta *</Label>
            <Select value={tipoResposta} onValueChange={setTipoResposta}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIPOS_RESPOSTA.map((tipo) => (
                  <SelectItem key={tipo.value} value={tipo.value}>
                    {tipo.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="placeholder">Placeholder (opcional)</Label>
            <Input
              id="placeholder"
              value={placeholder}
              onChange={(e) => setPlaceholder(e.target.value)}
              placeholder="Ex: Digite sua resposta aqui..."
            />
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="obrigatoria"
                checked={obrigatoria}
                onCheckedChange={setObrigatoria}
              />
              <Label htmlFor="obrigatoria">Pergunta obrigatória</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="ativo"
                checked={ativo}
                onCheckedChange={setAtivo}
              />
              <Label htmlFor="ativo">Pergunta ativa</Label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={handleClose} disabled={isSaving}>
              <X className="h-4 w-4 mr-1" />
              Cancelar
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={isSaving || !texto.trim()}
            >
              <Save className="h-4 w-4 mr-1" />
              {isSaving ? 'Salvando...' : (isEditMode ? 'Atualizar' : 'Criar')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default TemplatePerguntaModal
