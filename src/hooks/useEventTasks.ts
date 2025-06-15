import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface EventTask {
  id: string;
  event_id: string;
  title: string;
  description?: string;
  due_date?: string;
  assigned_to?: string;
  completed: boolean;
  completed_at?: string;
  created_at?: string;
  updated_at?: string;
}

export function useEventTasks(eventId: string | null) {
  const [tasks, setTasks] = useState<EventTask[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTasks = useCallback(async () => {
    if (!eventId) {
      setTasks([]);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from("event_tasks")
      .select("*")
      .eq("event_id", eventId)
      .order("due_date", { ascending: true });

    if (!error) setTasks(data || []);
    setLoading(false);
  }, [eventId]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks, eventId]);

  const addTask = async (task: Omit<EventTask, "id" | "created_at" | "updated_at" | "completed" | "completed_at">) => {
    const { data, error } = await supabase
      .from("event_tasks")
      .insert([{ ...task, event_id: eventId }])
      .select()
      .single();
    if (!error && data) {
      setTasks(prev => [...prev, data]);
    }
    return { data, error };
  };

  const updateTask = async (id: string, updates: Partial<EventTask>) => {
    const { data, error } = await supabase
      .from("event_tasks")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    if (!error && data) {
      setTasks(prev => prev.map(t => (t.id === id ? data : t)));
    }
    return { data, error };
  };

  const deleteTask = async (id: string) => {
    const { error } = await supabase
      .from("event_tasks")
      .delete()
      .eq("id", id);
    if (!error) {
      setTasks(prev => prev.filter(t => t.id !== id));
    }
    return { error };
  };

  // Nova função para reordenar tarefas
  const reorderTasks = async (newOrder: string[]) => {
    // Atualiza todos no Supabase, sequencialmente (simples, pode otimizar depois em batch)
    for (let i = 0; i < newOrder.length; i++) {
      await supabase
        .from("event_tasks")
        .update({ order_index: i })
        .eq("id", newOrder[i]);
    }
    // Refaz busca no final para garantir ordem correta
    fetchTasks();
  };

  return {
    tasks,
    loading,
    fetchTasks,
    addTask,
    updateTask,
    deleteTask,
    setTasks,
    reorderTasks,
  };
}
