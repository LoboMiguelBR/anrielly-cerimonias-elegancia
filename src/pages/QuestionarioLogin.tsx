
import { useState } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { useToast } from '@/components/ui/use-toast'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useQuestionarioAuth } from '@/hooks/useQuestionarioAuth'

const QuestionarioLogin = () => {
  const { linkPublico } = useParams<{ linkPublico: string }>()
  const { toast } = useToast()
  const { isAuthenticated, isLoading, login, register } = useQuestionarioAuth(linkPublico || '')

  const [loginData, setLoginData] = useState({ email: '', senha: '' })
  const [registerData, setRegisterData] = useState({ email: '', senha: '', nomeResponsavel: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to={`/questionario/${linkPublico}/formulario`} replace />
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const result = await login(loginData.email, loginData.senha)
    
    if (result.success) {
      toast({
        title: "Login realizado com sucesso!",
        description: "Redirecionando para o questionário...",
      })
    } else {
      toast({
        title: "Erro no login",
        description: result.error,
        variant: "destructive",
      })
    }
    
    setIsSubmitting(false)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const result = await register(registerData.email, registerData.senha, registerData.nomeResponsavel)
    
    if (result.success) {
      toast({
        title: "Conta criada com sucesso!",
        description: "Redirecionando para o questionário...",
      })
    } else {
      toast({
        title: "Erro ao criar conta",
        description: result.error,
        variant: "destructive",
      })
    }
    
    setIsSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-playfair text-gray-800">
            Questionário de Noivos
          </CardTitle>
          <CardDescription>
            Acesse ou crie sua conta para preencher o questionário
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Entrar</TabsTrigger>
              <TabsTrigger value="register">Criar Conta</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    value={loginData.email}
                    onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="seu@email.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-senha">Senha</Label>
                  <Input
                    id="login-senha"
                    type="password"
                    value={loginData.senha}
                    onChange={(e) => setLoginData(prev => ({ ...prev, senha: e.target.value }))}
                    placeholder="Sua senha"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Entrando...' : 'Entrar'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-nome">Nome Completo</Label>
                  <Input
                    id="register-nome"
                    type="text"
                    value={registerData.nomeResponsavel}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, nomeResponsavel: e.target.value }))}
                    placeholder="Seu nome completo"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    value={registerData.email}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="seu@email.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-senha">Senha</Label>
                  <Input
                    id="register-senha"
                    type="password"
                    value={registerData.senha}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, senha: e.target.value }))}
                    placeholder="Escolha uma senha"
                    required
                    minLength={6}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Criando...' : 'Criar Conta'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

export default QuestionarioLogin
