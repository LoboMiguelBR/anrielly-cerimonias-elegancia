
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { generateUniqueEventSlug, TIPOS_EVENTO } from '@/utils/eventSlugGenerator';

interface QuestionarioCreateFormEnhancedProps {
  onSuccess: () => void;
}

const QuestionarioCreateFormEnhanced = ({ onSuccess }: QuestionarioCreateFormEnhancedProps) => {
  const [formData, setFormData] = useState({
    nome_evento: '',
    tipo_evento: '',
    nome_responsavel: '',
    email: '',
    link_publico: '',
  });
  const [loading, setLoading] = useState(false);
  const [generatingSlug, setGeneratingSlug] = useState(false);

  const generateRandomPassword = () => {
    return Math.random().toString(36).slice(-8);
  };

  const handleGenerateSlug = async () => {
    if (!formData.nome_evento.trim()) {
      toast.error('Digite o nome do evento para gerar o link público');
      return;
    }

    setGeneratingSlug(true);
    try {
      const slug = await generateUniqueEventSlug(
        formData.nome_evento,
        formData.tipo_evento || undefined
      );
      setFormData(prev => ({ ...prev, link_publico: slug }));
      toast.success('Link público gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar slug:', error);
      toast.error('Erro ao gerar link público');
    } finally {
      setGeneratingSlug(false);
    }
  };

  // Gerar slug automaticamente quando nome ou tipo do evento mudarem
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.nome_evento.trim() && !formData.link_publico) {
        handleGenerateSlug();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [formData.nome_evento, formData.tipo_evento]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.link_publico.trim()) {
        toast.error('Link público é obrigatório');
        return;
      }

      const senha = generateRandomPassword();
      
      const { error } = await supabase
        .from('questionarios_noivos')
        .insert([{
          nome_evento: formData.nome_evento,
          tipo_evento: formData.tipo_evento,
          nome_responsavel: formData.nome_responsavel,
          email: formData.email,
          senha_hash: senha,
          link_publico: formData.link_publico,
          status: 'rascunho'
        }]);

      if (error) throw error;

      toast.success('Questionário criado com sucesso!');
      setFormData({ 
        nome_evento: '', 
        tipo_evento: '', 
        nome_responsavel: '', 
        email: '', 
        link_publico: '' 
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
        <Label htmlFor="nome_evento">Nome do Evento *</Label>
        <Input
          id="nome_evento"
          value={formData.nome_evento}
          onChange={(e) => setFormData({ ...formData, nome_evento: e.target.value })}
          placeholder="Ex: Casamento João e Maria"
          required
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
        <Label htmlFor="link_publico">Link Público *</Label>
        <div className="flex gap-2">
          <Input
            id="link_publico"
            value={formData.link_publico}
            onChange={(e) => setFormData({ ...formData, link_publico: e.target.value })}
            placeholder="casamento-joao-maria"
            required
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleGenerateSlug}
            disabled={generatingSlug || !formData.nome_evento.trim()}
          >
            {generatingSlug ? 'Gerando...' : 'Gerar'}
          </Button>
        </div>
        {formData.link_publico && (
          <p className="text-xs text-gray-500 mt-1">
            URL: {window.location.origin}/questionario/{formData.link_publico}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="nome_responsavel">Nome do Responsável *</Label>
        <Input
          id="nome_responsavel"
          value={formData.nome_responsavel}
          onChange={(e) => setFormData({ ...formData, nome_responsavel: e.target.value })}
          placeholder="Nome da pessoa responsável"
          required
        />
      </div>

      <div>
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="email@exemplo.com"
          required
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Criando...' : 'Criar Questionário'}
      </Button>
    </form>
  );
};

export default QuestionarioCreateFormEnhanced;
