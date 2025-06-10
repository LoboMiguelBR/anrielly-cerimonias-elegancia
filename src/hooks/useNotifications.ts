
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { NotificationData } from '@/types/integrations';

export const useNotifications = (userId?: string) => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async (unreadOnly = false) => {
    if (!userId) return;

    try {
      setLoading(true);
      const response = await supabase.functions.invoke('notifications', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        body: new URLSearchParams({ 
          user_id: userId,
          unread_only: unreadOnly.toString()
        }).toString()
      });

      if (response.error) throw response.error;

      const { notifications: data } = response.data;
      setNotifications(data || []);
      
      if (!unreadOnly) {
        setUnreadCount(data?.filter((n: NotificationData) => !n.read).length || 0);
      }
    } catch (error: any) {
      console.error('Erro ao buscar notificações:', error);
      toast.error('Erro ao carregar notificações');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await supabase.functions.invoke('notifications', {
        method: 'PUT',
        body: { notification_id: notificationId, read: true }
      });

      if (response.error) throw response.error;

      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error: any) {
      console.error('Erro ao marcar notificação como lida:', error);
      toast.error('Erro ao atualizar notificação');
    }
  };

  const sendNotification = async (data: {
    user_id: string;
    title: string;
    message: string;
    type?: 'info' | 'success' | 'warning' | 'error';
    action_url?: string;
    metadata?: Record<string, any>;
  }) => {
    try {
      const response = await supabase.functions.invoke('notifications', {
        method: 'POST',
        body: data
      });

      if (response.error) throw response.error;

      toast.success('Notificação enviada com sucesso!');
      return response.data.notification;
    } catch (error: any) {
      console.error('Erro ao enviar notificação:', error);
      toast.error('Erro ao enviar notificação');
      throw error;
    }
  };

  // Configurar WebSocket para notificações em tempo real
  useEffect(() => {
    if (!userId) return;

    const channel = supabase.channel(`notifications:${userId}`)
      .on('broadcast', { event: 'new_notification' }, (payload) => {
        const newNotification = payload.payload;
        setNotifications(prev => [newNotification, ...prev]);
        setUnreadCount(prev => prev + 1);
        
        // Mostrar toast para nova notificação
        toast(newNotification.title, {
          description: newNotification.message,
          action: newNotification.action_url ? {
            label: 'Ver',
            onClick: () => window.open(newNotification.action_url, '_blank')
          } : undefined
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  useEffect(() => {
    fetchNotifications();
  }, [userId]);

  return {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAsRead,
    sendNotification,
    refetch: () => fetchNotifications()
  };
};
