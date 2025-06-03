
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface FinancialTransaction {
  id: string;
  type: 'entrada' | 'saida';
  category: string;
  description: string;
  amount: number;
  transaction_date: string;
  payment_method?: string;
  reference_id?: string;
  reference_type?: string;
  created_at: string;
  updated_at: string;
}

export interface FinancialCategory {
  id: string;
  name: string;
  type: 'entrada' | 'saida';
  color: string;
  is_active: boolean;
}

export const useFinancialTransactions = () => {
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [categories, setCategories] = useState<FinancialCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('financial_transactions')
        .select('*')
        .order('transaction_date', { ascending: false });

      if (error) throw error;
      
      // Type assertion com validação de runtime
      const typedData = (data || []).map(item => ({
        ...item,
        type: item.type as 'entrada' | 'saida'
      })) as FinancialTransaction[];
      
      setTransactions(typedData);
    } catch (err: any) {
      console.error('Error fetching transactions:', err);
      toast.error('Erro ao carregar transações');
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('financial_categories')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      
      // Type assertion com validação de runtime
      const typedData = (data || []).map(item => ({
        ...item,
        type: item.type as 'entrada' | 'saida'
      })) as FinancialCategory[];
      
      setCategories(typedData);
    } catch (err: any) {
      console.error('Error fetching categories:', err);
      toast.error('Erro ao carregar categorias');
    }
  };

  const createTransaction = async (transaction: Omit<FinancialTransaction, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('financial_transactions')
        .insert([transaction])
        .select()
        .single();

      if (error) throw error;
      
      const typedData = {
        ...data,
        type: data.type as 'entrada' | 'saida'
      } as FinancialTransaction;
      
      setTransactions(prev => [typedData, ...prev]);
      toast.success('Transação criada com sucesso!');
      return typedData;
    } catch (err: any) {
      console.error('Error creating transaction:', err);
      toast.error('Erro ao criar transação');
      throw err;
    }
  };

  const updateTransaction = async (id: string, updates: Partial<FinancialTransaction>) => {
    try {
      const { data, error } = await supabase
        .from('financial_transactions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      const typedData = {
        ...data,
        type: data.type as 'entrada' | 'saida'
      } as FinancialTransaction;
      
      setTransactions(prev => prev.map(t => t.id === id ? typedData : t));
      toast.success('Transação atualizada com sucesso!');
      return typedData;
    } catch (err: any) {
      console.error('Error updating transaction:', err);
      toast.error('Erro ao atualizar transação');
      throw err;
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      const { error } = await supabase
        .from('financial_transactions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setTransactions(prev => prev.filter(t => t.id !== id));
      toast.success('Transação removida com sucesso!');
    } catch (err: any) {
      console.error('Error deleting transaction:', err);
      toast.error('Erro ao remover transação');
      throw err;
    }
  };

  const getFinancialSummary = () => {
    const entradas = transactions.filter(t => t.type === 'entrada');
    const saidas = transactions.filter(t => t.type === 'saida');

    const totalEntradas = entradas.reduce((sum, t) => sum + Number(t.amount), 0);
    const totalSaidas = saidas.reduce((sum, t) => sum + Number(t.amount), 0);
    const saldoLiquido = totalEntradas - totalSaidas;

    return {
      totalEntradas,
      totalSaidas,
      saldoLiquido,
      transactionsByCategory: getTransactionsByCategory()
    };
  };

  const getTransactionsByCategory = () => {
    const grouped = transactions.reduce((acc, transaction) => {
      const category = transaction.category;
      if (!acc[category]) {
        acc[category] = {
          category,
          transactions: [],
          total: 0
        };
      }
      acc[category].transactions.push(transaction);
      acc[category].total += Number(transaction.amount);
      return acc;
    }, {} as Record<string, { category: string; transactions: FinancialTransaction[]; total: number }>);

    return Object.values(grouped);
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchTransactions(), fetchCategories()]);
      setIsLoading(false);
    };

    loadData();
  }, []);

  return {
    transactions,
    categories,
    isLoading,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    fetchTransactions,
    getFinancialSummary
  };
};
