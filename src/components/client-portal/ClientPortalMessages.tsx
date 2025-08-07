import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Send, MessageCircle, User } from 'lucide-react';
import { ClientMessage } from '@/hooks/client-portal/useClientPortalData';
import { useClientPortalData } from '@/hooks/client-portal/useClientPortalData';
import { useClientPortalAuth } from '@/hooks/client-portal/useClientPortalAuth';
import { toast } from 'sonner';

interface ClientPortalMessagesProps {
  messages: ClientMessage[];
  loading: boolean;
  clientName: string;
}

export const ClientPortalMessages = ({ messages, loading, clientName }: ClientPortalMessagesProps) => {
  const { session } = useClientPortalAuth();
  const { sendMessage } = useClientPortalData(session?.client?.id);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) {
      toast.error('Digite uma mensagem');
      return;
    }

    setSending(true);
    const success = await sendMessage(newMessage);
    
    if (success) {
      setNewMessage('');
    }
    
    setSending(false);
  };

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 24 * 7) {
      return date.toLocaleDateString('pt-BR', { weekday: 'short', hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse flex space-x-4">
                <div className="rounded-full bg-muted h-10 w-10"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-1/4"></div>
                  <div className="h-16 bg-muted rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Mensagens</CardTitle>
          <CardDescription>Converse diretamente com nossa equipe</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Área de mensagens */}
          <div className="space-y-4 max-h-96 overflow-y-auto mb-6">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhuma mensagem ainda</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Envie uma mensagem para iniciar a conversa
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex space-x-3 ${message.sender_type === 'client' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.sender_type === 'admin' && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        A
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div 
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender_type === 'client' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium">
                        {message.sender_name}
                      </span>
                      <span className={`text-xs ${
                        message.sender_type === 'client' 
                          ? 'text-primary-foreground/70' 
                          : 'text-muted-foreground'
                      }`}>
                        {formatMessageTime(message.created_at)}
                      </span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                    
                    {!message.is_read && message.sender_type === 'admin' && (
                      <Badge variant="secondary" className="mt-2 text-xs">
                        Nova
                      </Badge>
                    )}
                  </div>
                  
                  {message.sender_type === 'client' && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-secondary">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Campo de nova mensagem */}
          <div className="space-y-3 border-t pt-4">
            <Textarea
              placeholder="Digite sua mensagem..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="min-h-[80px]"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                  handleSendMessage();
                }
              }}
            />
            <div className="flex justify-between items-center">
              <p className="text-xs text-muted-foreground">
                Pressione Ctrl+Enter para enviar
              </p>
              <Button 
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || sending}
                size="sm"
              >
                {sending ? (
                  <>Enviando...</>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Enviar
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};