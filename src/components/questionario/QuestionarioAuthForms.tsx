
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LogIn, UserPlus, AlertCircle, Loader2 } from 'lucide-react'
import { useQuestionarioAuth } from '@/hooks/useQuestionarioAuth'
import { useNavigate } from 'react-router-dom'

interface QuestionarioAuthFormsProps {
  linkPublico: string
}

const QuestionarioAuthForms = ({ linkPublico }: QuestionarioAuthFormsProps) => {
  const navigate = useNavigate()
  const { login, register } = useQuestionarioAuth(linkPublico)
  
  const [activeTab, setActiveTab] = useState('login')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  // Login form
  const [loginEmail, setLoginEmail] = useState('')
  const [loginSenha, setLoginSenha] = useState('')
  
  // Register form
  const [registerEmail, setRegisterEmail] = useState('')
  const [registerSenha, setRegisterSenha] = useState('')
  const [registerNome, setRegisterNome] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    console.log('Tentativa de login:', { loginEmail, linkPublico })

    try {
      const result = await login(loginEmail, loginSenha)
      
      if (result.success) {
        setSuccess('Login realizado com sucesso! Redirecionando...')
        setTimeout(() => {
          navigate(`/questionario/${linkPublico}/formulario`)
        }, 1000)
      } else {
        setError(result.error || 'Erro desconhecido')
      }
    } catch (error) {
      console.error('Erro no login:', error)
      setError('Erro inesperado. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    console.log('Tentativa de cadastro:', { registerEmail, registerNome, linkPublico })

    try {
      const result = await register(registerEmail, registerSenha, registerNome)
      
      if (result.success) {
        setSuccess('Cadastro realizado com sucesso! Redirecionando...')
        setTimeout(() => {
          navigate(`/questionario/${linkPublico}/formulario`)
        }, 1000)
      } else {
        setError(result.error || 'Erro desconhecido')
      }
    } catch (error) {
      console.error('Erro no cadastro:', error)
      setError('Erro inesperado. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="shadow-lg border-rose-100">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-xl text-gray-800">Acesso ao Questionário</CardTitle>
        <CardDescription className="text-gray-600">
          Entre com sua conta ou crie uma nova para continuar
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="mb-4 border-green-200 bg-green-50">
            <AlertCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login" className="flex items-center gap-2">
              <LogIn className="w-4 h-4" />
              Entrar
            </TabsTrigger>
            <TabsTrigger value="register" className="flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Cadastrar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4 mt-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="login-senha">Senha</Label>
                <Input
                  id="login-senha"
                  type="password"
                  value={loginSenha}
                  onChange={(e) => setLoginSenha(e.target.value)}
                  placeholder="Sua senha"
                  required
                  disabled={isLoading}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-rose-600 hover:bg-rose-700" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 mr-2" />
                    Entrar
                  </>
                )}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register" className="space-y-4 mt-4">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="register-nome">Nome Completo</Label>
                <Input
                  id="register-nome"
                  type="text"
                  value={registerNome}
                  onChange={(e) => setRegisterNome(e.target.value)}
                  placeholder="Seu nome completo"
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="register-email">Email</Label>
                <Input
                  id="register-email"
                  type="email"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="register-senha">Senha</Label>
                <Input
                  id="register-senha"
                  type="password"
                  value={registerSenha}
                  onChange={(e) => setRegisterSenha(e.target.value)}
                  placeholder="Crie uma senha"
                  required
                  minLength={6}
                  disabled={isLoading}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-rose-600 hover:bg-rose-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Cadastrando...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Criar Conta
                  </>
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default QuestionarioAuthForms
