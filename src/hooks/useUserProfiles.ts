
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type UserRole = 'admin' | 'cerimonialista' | 'noivo';

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  professional_id?: string;
  status: string;
  invited_by?: string;
  invited_at?: string;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface UserInvitation {
  id: string;
  email: string;
  role: UserRole;
  professional_id?: string;
  invited_by: string;
  token: string;
  expires_at: string;
  accepted_at?: string;
  created_at: string;
  updated_at: string;
}

export const useUserProfiles = () => {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [invitations, setInvitations] = useState<UserInvitation[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProfiles(data || []);
    } catch (error: any) {
      console.error('Erro ao buscar perfis:', error);
      toast.error('Erro ao carregar perfis de usuário');
    } finally {
      setLoading(false);
    }
  };

  const fetchInvitations = async () => {
    try {
      const { data, error } = await supabase
        .from('user_invitations')
        .select('*')
        .is('accepted_at', null)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInvitations(data || []);
    } catch (error: any) {
      console.error('Erro ao buscar convites:', error);
      toast.error('Erro ao carregar convites');
    }
  };

  const createInvitation = async (invitation: {
    email: string;
    role: UserRole;
    professional_id?: string;
  }) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_invitations')
        .insert([invitation])
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Convite enviado com sucesso!');
      await fetchInvitations();
      return data;
    } catch (error: any) {
      console.error('Erro ao criar convite:', error);
      toast.error('Erro ao enviar convite');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (id: string, updates: Partial<UserProfile>) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Perfil atualizado com sucesso!');
      await fetchProfiles();
    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error);
      toast.error('Erro ao atualizar perfil');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteInvitation = async (id: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('user_invitations')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Convite removido com sucesso!');
      await fetchInvitations();
    } catch (error: any) {
      console.error('Erro ao remover convite:', error);
      toast.error('Erro ao remover convite');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const hasRole = async (userId: string, role: UserRole): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .rpc('has_role', { _user_id: userId, _role: role });

      if (error) throw error;
      return data || false;
    } catch (error) {
      console.error('Erro ao verificar role:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchProfiles();
    fetchInvitations();
  }, []);

  return {
    profiles,
    invitations,
    loading,
    fetchProfiles,
    fetchInvitations,
    createInvitation,
    updateProfile,
    deleteInvitation,
    hasRole
  };
};
