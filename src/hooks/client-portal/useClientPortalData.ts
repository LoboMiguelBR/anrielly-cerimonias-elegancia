import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ClientNotification {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  action_url?: string;
  created_at: string;
}

export interface ProjectTimelineItem {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  due_date?: string;
  completed_at?: string;
  order_index: number;
}

export interface ClientDocument {
  id: string;
  title: string;
  description?: string;
  file_url: string;
  file_type: string;
  file_size?: number;
  category: string;
  is_downloadable: boolean;
  download_count: number;
  created_at: string;
}

export interface ClientMessage {
  id: string;
  sender_type: string;
  sender_name: string;
  message: string;
  is_read: boolean;
  attachments: any;
  created_at: string;
  reply_to_id?: string;
}

export const useClientPortalData = (clientId: string | null) => {
  const [notifications, setNotifications] = useState<ClientNotification[]>([]);
  const [timeline, setTimeline] = useState<ProjectTimelineItem[]>([]);
  const [documents, setDocuments] = useState<ClientDocument[]>([]);
  const [messages, setMessages] = useState<ClientMessage[]>([]);
  const [loading, setLoading] = useState(false);

  // Buscar notificações
  const fetchNotifications = async () => {
    if (!clientId) return;
    
    const { data, error } = await supabase
      .from('client_notifications')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching notifications:', error);
      return;
    }

    setNotifications(data || []);
  };

  // Buscar timeline
  const fetchTimeline = async () => {
    if (!clientId) return;
    
    const { data, error } = await supabase
      .from('project_timeline')
      .select('*')
      .eq('client_id', clientId)
      .eq('is_visible_to_client', true)
      .order('order_index', { ascending: true });

    if (error) {
      console.error('Error fetching timeline:', error);
      return;
    }

    setTimeline(data || []);
  };

  // Buscar documentos
  const fetchDocuments = async () => {
    if (!clientId) return;
    
    const { data, error } = await supabase
      .from('client_documents')
      .select('*')
      .eq('client_id', clientId)
      .eq('is_downloadable', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching documents:', error);
      return;
    }

    setDocuments(data || []);
  };

  // Buscar mensagens
  const fetchMessages = async () => {
    if (!clientId) return;
    
    const { data, error } = await supabase
      .from('client_messages')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching messages:', error);
      return;
    }

    setMessages(data || []);
  };

  // Marcar notificação como lida
  const markNotificationAsRead = async (notificationId: string) => {
    const { error } = await supabase
      .from('client_notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    if (error) {
      toast.error('Erro ao marcar notificação como lida');
      return;
    }

    setNotifications(prev => prev.map(n => 
      n.id === notificationId ? { ...n, is_read: true } : n
    ));
  };

  // Enviar mensagem
  const sendMessage = async (message: string, replyToId?: string) => {
    if (!clientId) return false;

    const { error } = await supabase
      .from('client_messages')
      .insert({
        client_id: clientId,
        sender_type: 'client',
        sender_name: 'Cliente', // Será atualizado com o nome real
        message,
        reply_to_id: replyToId
      });

    if (error) {
      toast.error('Erro ao enviar mensagem');
      return false;
    }

    toast.success('Mensagem enviada!');
    fetchMessages();
    return true;
  };

  // Carregar todos os dados
  const loadAllData = async () => {
    if (!clientId) return;
    
    setLoading(true);
    await Promise.all([
      fetchNotifications(),
      fetchTimeline(),
      fetchDocuments(),
      fetchMessages()
    ]);
    setLoading(false);
  };

  useEffect(() => {
    loadAllData();
  }, [clientId]);

  // Subscrever a mudanças em tempo real
  useEffect(() => {
    if (!clientId) return;

    const notificationsSubscription = supabase
      .channel('client_notifications')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'client_notifications', filter: `client_id=eq.${clientId}` },
        () => fetchNotifications()
      )
      .subscribe();

    const messagesSubscription = supabase
      .channel('client_messages')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'client_messages', filter: `client_id=eq.${clientId}` },
        () => fetchMessages()
      )
      .subscribe();

    return () => {
      notificationsSubscription.unsubscribe();
      messagesSubscription.unsubscribe();
    };
  }, [clientId]);

  return {
    notifications,
    timeline,
    documents,
    messages,
    loading,
    markNotificationAsRead,
    sendMessage,
    refetch: loadAllData,
    unreadNotifications: notifications.filter(n => !n.is_read).length,
    unreadMessages: messages.filter(m => m.sender_type === 'admin' && !m.is_read).length
  };
};