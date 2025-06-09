
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface SupplierReview {
  id: string;
  supplier_id: string;
  event_id: string;
  client_id: string;
  rating: number;
  comment?: string;
  service_quality: number;
  punctuality: number;
  value_for_money: number;
  created_at: string;
  updated_at: string;
}

export const useSupplierReviews = (supplierId?: string) => {
  const [reviews, setReviews] = useState<SupplierReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      let query = supabase
        .from('supplier_reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (supplierId) {
        query = query.eq('supplier_id', supplierId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setReviews(data || []);
    } catch (err: any) {
      console.error('Error fetching reviews:', err);
      toast.error('Erro ao carregar avaliações');
    } finally {
      setIsLoading(false);
    }
  };

  const addReview = async (reviewData: Omit<SupplierReview, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('supplier_reviews')
        .insert([reviewData])
        .select()
        .single();

      if (error) throw error;
      
      setReviews(prev => [data, ...prev]);
      toast.success('Avaliação adicionada com sucesso!');
      return data;
    } catch (err: any) {
      console.error('Error adding review:', err);
      toast.error('Erro ao adicionar avaliação');
      throw err;
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [supplierId]);

  return {
    reviews,
    isLoading,
    fetchReviews,
    addReview
  };
};
