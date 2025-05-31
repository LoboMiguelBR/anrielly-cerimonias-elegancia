import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface QuestionarioCreateFormEnhancedProps {
  onQuestionarioCreated: () => void;
}

const QuestionarioCreateFormEnhanced = ({ onQuestionarioCreated }: QuestionarioCreateFormEnhancedProps) => {
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [newLink, setNewLink] = useState('');
  const [createEvent, setCreateEvent] = useState(false);
  const [eventData, setEventData] = useState({
    type: '',
    date: '',
    location: '',
    notes: ''
  });

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

    if (createEvent && (!eventData.type || !eventData.location)) {
      toast({
        title: "Erro",
        description: "Para criar um evento, tipo e local são obrigatórios",
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

      // Criar o questionário
      const { data: questionarioData, error: questionarioError } = await supabase
        .from('questionarios_noivos')
        .insert({
          link_publico: newLink,
          nome_responsavel: 'Aguardando preenchimento',
          email: 'aguardando@preenchimento.com',
          senha_hash: 'temp_hash_will_be_replaced_on_first_login'
        })
        .select()
        .single();

      if (questionarioError) {
        console.error('Erro ao criar questionário:', questionarioError);
        toast({
          title: "Erro",
          description: "Erro ao criar questionário no banco de dados",
          variant: "destructive",
        });
        return;
      }

      let eventId = null;

      // Criar evento se solicitado
      if (createEvent) {
        const { data: eventCreated, error: eventError } = await supabase
          .from('events')
          .insert({
            type: eventData.type,
            date: eventData.date || null,
            location: eventData.location,
            status: 'em_planejamento',
            notes: eventData.notes || null,
            tenant_id: 'anrielly_gomes'
          })
          .select()
          .single();

        if (eventError) {
          console.error('Erro ao criar evento:', eventError);
          toast({
            title: "Aviso",
            description: "Questionário criado, mas houve erro ao criar o evento",
            variant: "destructive",
          });
        } else {
          eventId = eventCreated.id;
          toast({
            title: "Sucesso!",
            description: "Questionário e evento criados com sucesso!",
          });
        }
      }

      // Gerar link completo
      let linkCompleto = `${window.location.origin}/questionario/${newLink}`;
      
      // Se evento foi criado, adicionar parâmetros
      if (eventId) {
        linkCompleto += `?event_id=${eventId}&role=cliente`;
      }
      
      toast({
        title: "Link criado com sucesso!",
        description: eventId ? "Questionário vinculado ao evento criado" : "Link criado e salvo no banco de dados",
      });

      setNewLink('');
      setCreateEvent(false);
      setEventData({ type: '', date: '', location: '', notes: '' });
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

  const handleCreateEventChange = (checked: boolean) => {
    setCreateEvent(checked);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Questionários de Noivos</CardTitle>
        <CardDescription>
          Gerencie os questionários de noivos e visualize as respostas. Agora suporta múltiplas pessoas por link (noivo e noiva) e criação automática de eventos.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
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
            </div>
          </div>

          {/* Opção para criar evento vinculado */}
          <div className="space-y-4 p-4 border rounded-lg bg-purple-50">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="create-event" 
                checked={createEvent}
                onCheckedChange={handleCreateEventChange}
              />
              <Label htmlFor="create-event" className="font-medium">
                Criar evento vinculado ao questionário
              </Label>
            </div>
            
            {createEvent && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="event-type">Tipo do Evento *</Label>
                  <Input
                    id="event-type"
                    value={eventData.type}
                    onChange={(e) => setEventData(prev => ({ ...prev, type: e.target.value }))}
                    placeholder="Ex: Casamento"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="event-date">Data do Evento</Label>
                  <Input
                    id="event-date"
                    type="date"
                    value={eventData.date}
                    onChange={(e) => setEventData(prev => ({ ...prev, date: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="event-location">Local do Evento *</Label>
                  <Input
                    id="event-location"
                    value={eventData.location}
                    onChange={(e) => setEventData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Local onde será realizado"
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="event-notes">Observações</Label>
                  <Input
                    id="event-notes"
                    value={eventData.notes}
                    onChange={(e) => setEventData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Observações sobre o evento"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <Button onClick={criarNovoQuestionario} disabled={isCreating}>
              <Plus className="w-4 h-4 mr-2" />
              {isCreating ? 'Criando...' : 'Criar Questionário'}
              {createEvent && ' + Evento'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionarioCreateFormEnhanced;
