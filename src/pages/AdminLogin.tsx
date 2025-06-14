
import { useState, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Eye, EyeOff, Loader2 } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Verificar conectividade
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Verificar se já está logado
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          console.log('AdminLogin: Usuário já autenticado, redirecionando...');
          navigate('/admin/dashboard', { replace: true });
        }
      } catch (error) {
        console.error('AdminLogin: Erro ao verificar sessão existente:', error);
      }
    };
    
    checkAuth();
  }, [navigate]);

  const validateForm = () => {
    if (!email.trim()) {
      toast({
        title: "Email obrigatório",
        description: "Por favor, insira seu email",
        variant: "destructive",
      });
      return false;
    }

    if (!email.includes('@')) {
      toast({
        title: "Email inválido",
        description: "Por favor, insira um email válido",
        variant: "destructive",
      });
      return false;
    }

    if (!password.trim()) {
      toast({
        title: "Senha obrigatória",
        description: "Por favor, insira sua senha",
        variant: "destructive",
      });
      return false;
    }

    if (password.length < 6) {
      toast({
        title: "Senha muito curta",
        description: "A senha deve ter pelo menos 6 caracteres",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    if (!isOnline) {
      toast({
        title: "Sem conexão",
        description: "Verifique sua conexão com a internet",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      console.log('AdminLogin: Iniciando processo de login...');
      
      // Limpar canais realtime antes do login
      supabase.removeAllChannels();
      
      // Fazer logout para limpar qualquer sessão corrompida
      await supabase.auth.signOut();
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim()
      });

      if (error) {
        console.error('AdminLogin: Erro de autenticação:', error);
        
        let errorMessage = "Erro de autenticação";
        
        switch (error.message) {
          case 'Invalid login credentials':
            errorMessage = "Email ou senha incorretos";
            break;
          case 'Email not confirmed':
            errorMessage = "Email não confirmado. Verifique sua caixa de entrada";
            break;
          case 'Too many requests':
            errorMessage = "Muitas tentativas. Tente novamente em alguns minutos";
            break;
          case 'User not found':
            errorMessage = "Usuário não encontrado";
            break;
          default:
            errorMessage = error.message || "Erro desconhecido";
        }
        
        toast({
          title: "Erro no login",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }

      if (data.user && data.session) {
        console.log('AdminLogin: Login bem-sucedido:', data.user.email);
        
        // Salvar informações básicas no localStorage
        localStorage.setItem('adminUser', data.user.email || '');
        localStorage.setItem('adminLoginTime', new Date().toISOString());
        
        toast({
          title: "Login realizado",
          description: `Bem-vindo, ${data.user.email}`,
        });
        
        // Aguardar um pouco para o estado ser atualizado
        setTimeout(() => {
          navigate('/admin/dashboard', { replace: true });
        }, 500);
      }
    } catch (error: any) {
      console.error('AdminLogin: Erro crítico:', error);
      
      const errorMessage = error?.message?.includes('fetch') 
        ? "Erro de conexão. Verifique sua internet"
        : "Erro inesperado. Tente novamente";
        
      toast({
        title: "Erro crítico",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="font-playfair text-3xl font-bold text-gray-800 mb-2">
              Área Administrativa
            </h1>
            <p className="text-gray-600 text-sm">
              Anrielly Gomes - Cerimonialista
            </p>
          </div>

          {!isOnline && (
            <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-orange-700 text-sm text-center">
                ⚠️ Você está offline. Verifique sua conexão.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading || !isOnline}
                placeholder="seu@email.com"
                className="w-full"
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading || !isOnline}
                  placeholder="Sua senha"
                  className="w-full pr-10"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading || !isOnline}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 rounded-lg transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <a 
              href="/" 
              className="text-purple-600 hover:text-purple-700 hover:underline text-sm transition-colors"
            >
              ← Voltar para o site principal
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
