
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  role: 'noivo' | 'noiva' | 'cliente' | 'cerimonialista' | 'admin';
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Simular fetch do perfil até que o Supabase types seja atualizado
          // Por enquanto, usamos uma implementação temporária
          const mockProfile: UserProfile = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0],
            role: session.user.user_metadata?.role || 'cliente',
            avatar_url: session.user.user_metadata?.avatar_url,
            created_at: session.user.created_at,
            updated_at: new Date().toISOString()
          };
          
          console.log('Profile criado:', mockProfile);
          setProfile(mockProfile);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Session inicial:', session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const mockProfile: UserProfile = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0],
          role: session.user.user_metadata?.role || 'cliente',
          avatar_url: session.user.user_metadata?.avatar_url,
          created_at: session.user.created_at,
          updated_at: new Date().toISOString()
        };
        setProfile(mockProfile);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signUp = async (email: string, password: string, name?: string, role: UserProfile['role'] = 'cliente') => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, role }
      }
    });
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return { error: new Error('No user logged in') };

    // Implementação temporária até que o Supabase types seja atualizado
    setProfile(prev => prev ? { ...prev, ...updates } : null);
    return { data: profile, error: null };
  };

  return {
    user,
    session,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    isAuthenticated: !!user,
    isAdmin: profile?.role === 'admin'
  };
};
