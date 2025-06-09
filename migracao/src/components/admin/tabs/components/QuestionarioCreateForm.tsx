
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface QuestionarioCreateFormProps {
  onQuestionarioCreated: () => void;
}

const QuestionarioCreateForm = ({ onQuestionarioCreated }: QuestionarioCreateFormProps) => {
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [newLink, setNewLink] = useState('');

  const generateUniqueLink = () => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const generated = `noivos-${timestamp}-${random}`;
    setNewLink(generated);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copiado!",
        description: "Link copiado para a área de transferência",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar o link",
        variant: "destructive",
      });
    }
  };

  const criarNovoQuestionario = async () => {
    if (!newLink.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira um identificador para o link",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    try {
      // Verificar se o link já existe
      const { data: existing } = await supabase
        .from('questionarios_noivos')
        .select('id')
        .eq('link_publico', newLink)
        .limit(1);

      if (existing && existing.length > 0) {
        toast({
          title: "Erro",
          description: "Já existe um questionário com este link",
          variant: "destructive",
        });
        return;
      }

      // Criar um registro inicial para reservar o link
      const { error: insertError } = await supabase
        .from('questionarios_noivos')
        .insert({
          link_publico: newLink,
          nome_responsavel: 'Aguardando preenchimento',
          email: 'aguardando@preenchimento.com',
          senha_hash: 'temp_hash_will_be_replaced_on_first_login'
        });

      if (insertError) {
        console.error('Erro ao criar questionário:', insertError);
        toast({
          title: "Erro",
          description: "Erro ao criar questionário no banco de dados",
          variant: "destructive",
        });
        return;
      }

      const linkCompleto = `${window.location.origin}/questionario/${newLink}`;
      
      toast({
        title: "Link criado com sucesso!",
        description: `Link criado e salvo no banco de dados`,
      });

      setNewLink('');
      onQuestionarioCreated();
      copyToClipboard(linkCompleto);
      
    } catch (error) {
      console.error('Erro ao criar questionário:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar questionário",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
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
      </CardContent>
    </Card>
  );
};

export default QuestionarioCreateForm;
