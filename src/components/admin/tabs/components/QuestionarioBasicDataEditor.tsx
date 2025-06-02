
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from 'sonner'
import { supabase } from '@/integrations/supabase/client'
import { TIPOS_EVENTO } from '@/utils/eventSlugGenerator'

interface QuestionarioBasicDataEditorProps {
  questionario: any
  onSuccess: () => void
}

const QuestionarioBasicDataEditor = ({ questionario, onSuccess }: QuestionarioBasicDataEditorProps) => {
  const [formData, setFormData] = useState({
    nome_evento: questionario.nome_evento || '',
    tipo_evento: questionario.tipo_evento || '',
    nome_responsavel: questionario.nome_responsavel || '',
    email: questionario.email || '',
    link_publico: questionario.link_publico || '',
    status: questionario.status || 'rascunho'
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from('questionarios_noivos')
        .update({
          nome_evento: formData.nome_evento,
          tipo_evento: formData.tipo_evento,
          nome_responsavel: formData.nome_responsavel,
          email: formData.email,
          link_publico: formData.link_publico,
          status: formData.status
        })
        .eq('id', questionario.id)

      if (error) throw error

      toast.success('Questionário atualizado com sucesso!')
      onSuccess()
    } catch (error: any) {
      console.error('Erro ao atualizar questionário:', error)
      toast.error(`Erro ao atualizar questionário: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      <div>
        <Label htmlFor="nome_evento">Nome do Evento</Label>
        <Input
          id="nome_evento"
          value={formData.nome_evento}
          onChange={(e) => setFormData({ ...formData, nome_evento: e.target.value })}
          placeholder="Ex: Casamento João e Maria"
        />
      </div>

      <div>
        <Label htmlFor="tipo_evento">Tipo do Evento</Label>
        <Select 
          value={formData.tipo_evento} 
          onValueChange={(value) => setFormData({ ...formData, tipo_evento: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo de evento" />
          </SelectTrigger>
          <SelectContent>
            {TIPOS_EVENTO.map((tipo) => (
              <SelectItem key={tipo} value={tipo}>
                {tipo}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="nome_responsavel">Nome do Responsável</Label>
        <Input
          id="nome_responsavel"
          value={formData.nome_responsavel}
          onChange={(e) => setFormData({ ...formData, nome_responsavel: e.target.value })}
          placeholder="Nome da pessoa responsável"
        />
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="email@exemplo.com"
        />
      </div>

      <div>
        <Label htmlFor="link_publico">Link Público</Label>
        <Input
          id="link_publico"
          value={formData.link_publico}
          onChange={(e) => setFormData({ ...formData, link_publico: e.target.value })}
          placeholder="casamento-joao-maria"
        />
        {formData.link_publico && (
          <p className="text-xs text-gray-500 mt-1">
            URL: {window.location.origin}/questionario/{formData.link_publico}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="status">Status</Label>
        <Select 
          value={formData.status} 
          onValueChange={(value) => setFormData({ ...formData, status: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rascunho">Rascunho</SelectItem>
            <SelectItem value="ativo">Ativo</SelectItem>
            <SelectItem value="finalizado">Finalizado</SelectItem>
            <SelectItem value="arquivado">Arquivado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? 'Salvando...' : 'Salvar Alterações'}
      </Button>
    </form>
  )
}

export default QuestionarioBasicDataEditor
