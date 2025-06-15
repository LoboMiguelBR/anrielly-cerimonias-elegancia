
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface InternalNotification {
  id: string;
  type: string;
  message: string;
  read: boolean;
  metadata?: any;
  user_id?: string;
  created_at: string;
}

export const useInternalNotifications = () => {
  const [notifications, setNotifications] = useState<InternalNotification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('internal_notifications')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) {
      setNotifications(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id: string) => {
    await supabase
      .from('internal_notifications')
      .update({ read: true })
      .eq('id', id);
    await fetchNotifications();
  };

  const addNotification = async (notif: Partial<InternalNotification>) => {
    await supabase
      .from('internal_notifications')
      .insert([notif]);
    await fetchNotifications();
  };

  return { notifications, loading, fetchNotifications, markAsRead, addNotification };
};
