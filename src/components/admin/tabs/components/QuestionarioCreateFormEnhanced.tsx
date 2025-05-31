
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface QuestionarioCreateFormEnhancedProps {
  onSuccess: () => void;
}

const QuestionarioCreateFormEnhanced = ({ onSuccess }: QuestionarioCreateFormEnhancedProps) => {
  const [formData, setFormData] = useState({
    nome_responsavel: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);

  const generateRandomPassword = () => {
    return Math.random().toString(36).slice(-8);
  };

  const generatePublicLink = (email: string) => {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 8);
    const emailHash = email.split('@')[0].toLowerCase();
    return `${emailHash}-${timestamp}-${randomStr}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const senha = generateRandomPassword();
      const linkPublico = generatePublicLink(formData.email);
      
      const { error } = await supabase
        .from('questionarios_noivos')
        .insert([{
          nome_responsavel: formData.nome_responsavel,
          email: formData.email,
          senha_hash: senha,
          link_publico: linkPublico,
          status: 'rascunho'
        }]);

      if (error) throw error;

      toast.success('Questionário criado com sucesso!');
      setFormData({ nome_responsavel: '', email: '' });
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
        <Label htmlFor="nome_responsavel">Nome do Responsável</Label>
        <Input
          id="nome_responsavel"
          value={formData.nome_responsavel}
          onChange={(e) => setFormData({ ...formData, nome_responsavel: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
