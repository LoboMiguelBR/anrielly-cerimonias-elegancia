
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ClientTag {
  id: string;
  name: string;
  color: string;
  description?: string;
  created_at: string;
}

export const useClientTags = () => {
  const [tags, setTags] = useState<ClientTag[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTags = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('client_tags')
        .select('*')
        .order('name');

      if (error) throw error;
      setTags(data || []);
    } catch (err: any) {
      console.error('Error fetching tags:', err);
      toast.error('Erro ao carregar tags');
    } finally {
      setIsLoading(false);
    }
  };

  const addTag = async (tagData: Omit<ClientTag, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('client_tags')
        .insert([tagData])
        .select()
        .single();

      if (error) throw error;
      
      setTags(prev => [...prev, data]);
      toast.success('Tag criada com sucesso!');
      return data;
    } catch (err: any) {
      console.error('Error adding tag:', err);
      toast.error('Erro ao criar tag');
      throw err;
    }
  };

  const deleteTag = async (id: string) => {
    try {
      const { error } = await supabase
        .from('client_tags')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTags(prev => prev.filter(tag => tag.id !== id));
      toast.success('Tag removida com sucesso!');
    } catch (err: any) {
      console.error('Error deleting tag:', err);
      toast.error('Erro ao remover tag');
      throw err;
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  return {
    tags,
    isLoading,
    fetchTags,
    addTag,
    deleteTag
  };
};
