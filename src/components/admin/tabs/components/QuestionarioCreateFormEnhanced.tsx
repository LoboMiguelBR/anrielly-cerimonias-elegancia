
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface QuestionarioCreateFormEnhancedProps {
  onSuccess: () => void;
}

const QuestionarioCreateFormEnhanced = ({ onSuccess }: QuestionarioCreateFormEnhancedProps) => {
  const [formData, setFormData] = useState({
    link_publico: '',
    tipo_evento: 'casamento',
    observacoes: '',
  });
  const [loading, setLoading] = useState(false);

  const generateRandomPassword = () => {
    return Math.random().toString(36).slice(-8);
  };

  const generatePublicLink = () => {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 8);
    return `casal-${timestamp}-${randomStr}`;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Link copiado para a área de transferência!');
    } catch (error) {
      toast.error('Erro ao copiar o link');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const linkPublico = formData.link_publico || generatePublicLink();
      const senha = generateRandomPassword();
      
      // Verificar se o link já existe
      const { data: existing } = await supabase
        .from('questionarios_noivos')
        .select('id')
        .eq('link_publico', linkPublico)
        .limit(1);

      if (existing && existing.length > 0) {
        toast.error('Já existe um questionário com este link público');
        return;
      }

      // Criar registro inicial para o casal (será compartilhado)
      const { error } = await supabase
        .from('questionarios_noivos')
        .insert([{
          nome_responsavel: 'Aguardando preenchimento',
          email: 'aguardando@preenchimento.com',
          senha_hash: senha,
          link_publico: linkPublico,
          status: 'rascunho'
        }]);

      if (error) throw error;

      const linkCompleto = `${window.location.origin}/questionario/${linkPublico}`;
      
      toast.success('Link público criado com sucesso!');
      copyToClipboard(linkCompleto);
      
      setFormData({ 
        link_publico: '', 
        tipo_evento: 'casamento', 
        observacoes: '' 
      });
      onSuccess();
    } catch (error: any) {
      console.error('Erro ao criar questionário:', error);
      toast.error('Erro ao criar questionário: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="link_publico">Link Público (opcional)</Label>
        <Input
          id="link_publico"
          value={formData.link_publico}
          onChange={(e) => setFormData({ ...formData, link_publico: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
          placeholder="ex: casamento-joao-maria (deixe vazio para gerar automaticamente)"
        />
        <p className="text-sm text-gray-500 mt-1">
          Este link será compartilhado pelos noivos para responderem juntos
        </p>
      </div>

      <div>
        <Label htmlFor="tipo_evento">Tipo de Evento</Label>
        <Select value={formData.tipo_evento} onValueChange={(value) => setFormData({ ...formData, tipo_evento: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="casamento">Casamento</SelectItem>
            <SelectItem value="renovacao_votos">Renovação de Votos</SelectItem>
            <SelectItem value="noivado">Noivado</SelectItem>
            <SelectItem value="outro">Outro</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="observacoes">Observações (opcional)</Label>
        <Input
          id="observacoes"
          value={formData.observacoes}
          onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
          placeholder="Observações sobre o questionário"
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Criando...' : 'Criar Link Público do Casal'}
      </Button>
    </form>
  );
};

export default QuestionarioCreateFormEnhanced;
