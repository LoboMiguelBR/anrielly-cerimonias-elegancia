
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { TIPOS_EVENTO } from '@/utils/eventSlugGenerator';

interface QuestionarioTemplateFormProps {
  onSuccess: () => void;
}

const QuestionarioTemplateForm = ({ onSuccess }: QuestionarioTemplateFormProps) => {
  const [formData, setFormData] = useState({
    nome: '',
    tipo_evento: '',
    categoria: 'personalizado',
    descricao: '',
    is_default: false,
    ativo: true,
    ordem: 0,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('questionario_templates')
        .insert([formData]);

      if (error) throw error;

      toast.success('Template criado com sucesso!');
      setFormData({
        nome: '',
        tipo_evento: '',
        categoria: 'personalizado',
        descricao: '',
        is_default: false,
        ativo: true,
        ordem: 0,
      });
      onSuccess();
    } catch (error: any) {
      console.error('Erro ao criar template:', error);
      toast.error('Erro ao criar template: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="nome">Nome do Template *</Label>
        <Input
          id="nome"
          value={formData.nome}
          onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
          placeholder="Ex: Questionário de Casamento Completo"
          required
        />
      </div>

      <div>
        <Label htmlFor="tipo_evento">Tipo do Evento *</Label>
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
        <Label htmlFor="categoria">Categoria</Label>
        <Select 
          value={formData.categoria} 
          onValueChange={(value) => setFormData({ ...formData, categoria: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="personalizado">Personalizado</SelectItem>
            <SelectItem value="padrao">Padrão</SelectItem>
            <SelectItem value="premium">Premium</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="descricao">Descrição</Label>
        <Textarea
          id="descricao"
          value={formData.descricao}
          onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
          placeholder="Descrição opcional do template"
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="ordem">Ordem de Exibição</Label>
        <Input
          id="ordem"
          type="number"
          value={formData.ordem}
          onChange={(e) => setFormData({ ...formData, ordem: parseInt(e.target.value) || 0 })}
          min="0"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="is_default"
          checked={formData.is_default}
          onCheckedChange={(checked) => setFormData({ ...formData, is_default: checked })}
        />
        <Label htmlFor="is_default">Template Padrão</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="ativo"
          checked={formData.ativo}
          onCheckedChange={(checked) => setFormData({ ...formData, ativo: checked })}
        />
        <Label htmlFor="ativo">Ativo</Label>
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Criando...' : 'Criar Template'}
      </Button>
    </form>
  );
};

export default QuestionarioTemplateForm;
