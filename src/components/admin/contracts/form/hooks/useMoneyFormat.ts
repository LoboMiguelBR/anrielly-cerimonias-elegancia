
import { useState, useCallback } from 'react';

export const useMoneyFormat = () => {
  const formatMoney = useCallback((value: string | number): string => {
    const numericValue = typeof value === 'string' 
      ? parseFloat(value.replace(/[^\d,.-]/g, '').replace(',', '.')) 
      : value;
    
    if (isNaN(numericValue)) return '';
    
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    }).format(numericValue);
  }, []);

  const parseMoney = useCallback((value: string): number => {
    const cleaned = value.replace(/[^\d,.-]/g, '').replace(',', '.');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  }, []);

  return { formatMoney, parseMoney };
};
