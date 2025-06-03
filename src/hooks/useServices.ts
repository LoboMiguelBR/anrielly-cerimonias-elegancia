
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  is_active: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export const useServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchServices = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true });

      if (error) throw error;
      setServices(data || []);
    } catch (err: any) {
      console.error('Error fetching services:', err);
      toast.error('Erro ao carregar serviços');
    } finally {
      setIsLoading(false);
    }
  };

  const createService = async (serviceData: Omit<Service, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('services')
        .insert([serviceData])
        .select()
        .single();

      if (error) throw error;
      
      setServices(prev => [...prev, data]);
      toast.success('Serviço criado com sucesso!');
      return data;
    } catch (err: any) {
      console.error('Error creating service:', err);
      toast.error('Erro ao criar serviço');
      throw err;
    }
  };

  const updateService = async (id: string, updates: Partial<Service>) => {
    try {
      const { data, error } = await supabase
        .from('services')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setServices(prev => prev.map(service => 
        service.id === id ? { ...service, ...data } : service
      ));
      toast.success('Serviço atualizado com sucesso!');
      return data;
    } catch (err: any) {
      console.error('Error updating service:', err);
      toast.error('Erro ao atualizar serviço');
      throw err;
    }
  };

  const deleteService = async (id: string) => {
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setServices(prev => prev.filter(service => service.id !== id));
      toast.success('Serviço removido com sucesso!');
    } catch (err: any) {
      console.error('Error deleting service:', err);
      toast.error('Erro ao remover serviço');
      throw err;
    }
  };

  const toggleServiceActive = async (id: string, isActive: boolean) => {
    return updateService(id, { is_active: isActive });
  };

  const reorderServices = async (reorderedServices: Service[]) => {
    try {
      const updates = reorderedServices.map((service, index) => ({
        id: service.id,
        order_index: index + 1
      }));

      for (const update of updates) {
        await supabase
          .from('services')
          .update({ order_index: update.order_index })
          .eq('id', update.id);
      }

      await fetchServices();
      toast.success('Ordem dos serviços atualizada!');
    } catch (err: any) {
      console.error('Error reordering services:', err);
      toast.error('Erro ao reordenar serviços');
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return {
    services,
    isLoading,
    fetchServices,
    createService,
    updateService,
    deleteService,
    toggleServiceActive,
    reorderServices
  };
};
