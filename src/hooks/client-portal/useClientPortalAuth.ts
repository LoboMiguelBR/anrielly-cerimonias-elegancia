import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ClientPortalSession {
  sessionToken: string;
  client: any;
  expiresAt: string;
}

export const useClientPortalAuth = () => {
  const [session, setSession] = useState<ClientPortalSession | null>(null);
  const [loading, setLoading] = useState(true);

  // Verificar sessão existente no localStorage
  useEffect(() => {
    const savedSession = localStorage.getItem('client_portal_session');
    if (savedSession) {
      try {
        const parsedSession = JSON.parse(savedSession);
        if (new Date(parsedSession.expiresAt) > new Date()) {
          setSession(parsedSession);
        } else {
          localStorage.removeItem('client_portal_session');
        }
      } catch (error) {
        console.error('Error parsing saved session:', error);
        localStorage.removeItem('client_portal_session');
      }
    }
    setLoading(false);
  }, []);

  const authenticateWithToken = useCallback(async (token: string) => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('client-portal-auth', {
        body: {
          token,
          userAgent: navigator.userAgent,
          ipAddress: 'unknown' // Will be populated by edge function if needed
        }
      });

      if (error) throw error;

      if (data.success) {
        const newSession = {
          sessionToken: data.sessionToken,
          client: data.client,
          expiresAt: data.expiresAt
        };
        
        setSession(newSession);
        localStorage.setItem('client_portal_session', JSON.stringify(newSession));
        toast.success('Acesso autorizado com sucesso!');
        return true;
      } else {
        toast.error(data.error || 'Erro na autenticação');
        return false;
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      toast.error(error.message || 'Erro ao acessar o portal');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setSession(null);
    localStorage.removeItem('client_portal_session');
    toast.success('Sessão encerrada');
  }, []);

  const validateSession = useCallback(async () => {
    if (!session) return false;
    
    if (new Date(session.expiresAt) <= new Date()) {
      logout();
      toast.error('Sessão expirada');
      return false;
    }
    
    return true;
  }, [session, logout]);

  return {
    session,
    loading,
    authenticateWithToken,
    logout,
    validateSession,
    isAuthenticated: !!session
  };
};