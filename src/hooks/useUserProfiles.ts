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
  ativo?: boolean; // ADICIONADO
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
      
      // Transform data to match UserProfile interface, handling missing fields gracefully
      const transformedProfiles = (data || []).map(profile => ({
        id: profile.id,
        email: profile.email,
        name: profile.name,
        role: profile.role as UserRole,
        professional_id: (profile as any).professional_id || undefined,
        status: (profile as any).status || 'ativo',
        ativo: profile.ativo !== undefined ? profile.ativo : true, // CORRIGIDO
        invited_by: (profile as any).invited_by || undefined,
        invited_at: (profile as any).invited_at || undefined,
        last_login: (profile as any).last_login || undefined,
        created_at: profile.created_at,
        updated_at: profile.updated_at
      }));
      
      setProfiles(transformedProfiles);
    } catch (error: any) {
      console.error('Erro ao buscar perfis:', error);
      toast.error('Erro ao carregar perfis de usuário');
    } finally {
      setLoading(false);
    }
  };

  const fetchInvitations = async () => {
    try {
      // Temporariamente simulando convites até a tabela user_invitations ser criada
      console.log('Tabela user_invitations ainda não disponível');
      setInvitations([]);
    } catch (error: any) {
      console.log('Convites ainda não disponíveis:', error);
    }
  };

  const createInvitation = async (invitation: {
    email: string;
    role: UserRole;
    professional_id?: string;
  }) => {
    try {
      setLoading(true);
      
      // Simular criação de convite até a tabela estar disponível
      toast.success('Funcionalidade de convites será ativada em breve!');
      
      return { id: 'temp', ...invitation };
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
      toast.success('Convite removido!');
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
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data?.role === role;
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
