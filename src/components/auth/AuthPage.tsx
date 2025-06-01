
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth, UserProfile } from '@/hooks/useAuth';
import { useNavigate, useSearchParams } from 'react-router-dom';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserProfile['role']>('cliente');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { signIn, signUp, profile } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectParam = searchParams.get('redirect');

  useEffect(() => {
    // Se o usuário já está autenticado, redireciona baseado no parâmetro
    if (profile) {
      handleRedirect();
    }
  }, [profile]);

  const handleRedirect = () => {
    if (redirectParam) {
      switch (redirectParam) {
        case 'area-cliente':
          navigate('/area-cliente');
          break;
        case 'area-profissional':
          navigate('/area-profissional');
          break;
        default:
          navigate('/dashboard');
      }
    } else {
      // Redirecionamento padrão baseado no role
      switch (profile?.role) {
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'cerimonialista':
          navigate('/area-profissional');
          break;
        case 'cliente':
        case 'noivo':
        case 'noiva':
          navigate('/area-cliente');
          break;
        default:
          navigate('/dashboard');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) throw error;
      } else {
        // Definir role baseado no redirecionamento
        let userRole = role;
        if (redirectParam === 'area-profissional') {
          userRole = 'cerimonialista';
        } else if (redirectParam === 'area-cliente') {
          userRole = 'cliente';
        }

        const { error } = await signUp(email, password, name, userRole);
        if (error) throw error;
      }
      
      // O redirecionamento será feito pelo useEffect quando o profile for carregado
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getPageTitle = () => {
    switch (redirectParam) {
      case 'area-cliente':
        return 'Área do Cliente';
      case 'area-profissional':
        return 'Área do Profissional';
      default:
        return 'Portal de Acesso';
    }
  };

  const getRoleLabel = () => {
    switch (redirectParam) {
      case 'area-cliente':
        return 'Cliente';
      case 'area-profissional':
        return 'Cerimonialista';
      default:
        return 'Usuário';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {getPageTitle()}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isLogin ? 'Entre na sua conta' : `Crie sua conta como ${getRoleLabel()}`}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{isLogin ? 'Login' : 'Cadastro'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {!isLogin && (
                <div>
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={!isLogin}
                  />
                </div>
              )}

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {!isLogin && !redirectParam && (
                <div>
                  <Label htmlFor="role">Tipo de Usuário</Label>
                  <Select value={role} onValueChange={(value: UserProfile['role']) => setRole(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cliente">Cliente</SelectItem>
                      <SelectItem value="noivo">Noivo</SelectItem>
                      <SelectItem value="noiva">Noiva</SelectItem>
                      <SelectItem value="cerimonialista">Cerimonialista</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Carregando...' : (isLogin ? 'Entrar' : 'Cadastrar')}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                {isLogin ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Entre'}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
