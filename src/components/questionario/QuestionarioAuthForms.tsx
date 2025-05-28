
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuestionarioAuth } from '@/hooks/useQuestionarioAuth'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Loader2, Lock, Mail, User } from 'lucide-react'

interface QuestionarioAuthFormsProps {
  linkPublico: string
}

const QuestionarioAuthForms = ({ linkPublico }: QuestionarioAuthFormsProps) => {
  const navigate = useNavigate()
  const { login, register } = useQuestionarioAuth(linkPublico)
  
  const [loginData, setLoginData] = useState({ email: '', senha: '' })
  const [registerData, setRegisterData] = useState({ email: '', senha: '', nomeResponsavel: '' })
  const [loginLoading, setLoginLoading] = useState(false)
  const [registerLoading, setRegisterLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!loginData.email || !loginData.senha) {
      toast.error('Por favor, preencha todos os campos')
      return
    }

    setLoginLoading(true)
    try {
      const result = await login(loginData.email, loginData.senha)
      
      if (result.success) {
        toast.success('Login realizado com sucesso!')
        if (result.redirect) {
          // Pequeno delay para mostrar o toast antes de redirecionar
          setTimeout(() => {
            navigate(`/questionario/${linkPublico}/formulario`)
          }, 500)
        }
      } else {
        toast.error(result.error || 'Erro no login')
      }
    } catch (error) {
      toast.error('Erro inesperado. Tente novamente.')
    } finally {
      setLoginLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!registerData.email || !registerData.senha || !registerData.nomeResponsavel) {
      toast.error('Por favor, preencha todos os campos')
      return
    }

    if (registerData.senha.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres')
      return
    }

    setRegisterLoading(true)
    try {
      const result = await register(registerData.email, registerData.senha, registerData.nomeResponsavel)
      
      if (result.success) {
        toast.success('Cadastro realizado com sucesso!')
        if (result.redirect) {
          // Pequeno delay para mostrar o toast antes de redirecionar
          setTimeout(() => {
            navigate(`/questionario/${linkPublico}/formulario`)
          }, 500)
        }
      } else {
        toast.error(result.error || 'Erro no cadastro')
      }
    } catch (error) {
      toast.error('Erro inesperado. Tente novamente.')
    } finally {
      setRegisterLoading(false)
    }
  }

  return (
    <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-rose-200">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-xl font-playfair text-gray-800">
          Acesso ao Questionário
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="login" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login" className="data-[state=active]:bg-rose-100">
              Entrar
            </TabsTrigger>
            <TabsTrigger value="register" className="data-[state=active]:bg-rose-100">
              Cadastrar
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email" className="text-sm font-medium text-gray-700">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={loginData.email}
                    onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                    className="pl-10 border-rose-200 focus:border-rose-400 focus:ring-rose-400"
                    disabled={loginLoading}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="login-senha" className="text-sm font-medium text-gray-700">
                  Senha
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="login-senha"
                    type="password"
                    placeholder="••••••"
                    value={loginData.senha}
                    onChange={(e) => setLoginData(prev => ({ ...prev, senha: e.target.value }))}
                    className="pl-10 border-rose-200 focus:border-rose-400 focus:ring-rose-400"
                    disabled={loginLoading}
                    required
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white"
                disabled={loginLoading}
              >
                {loginLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  'Entrar'
                )}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="register" className="space-y-4">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="register-nome" className="text-sm font-medium text-gray-700">
                  Nome Completo
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="register-nome"
                    type="text"
                    placeholder="Seu nome completo"
                    value={registerData.nomeResponsavel}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, nomeResponsavel: e.target.value }))}
                    className="pl-10 border-rose-200 focus:border-rose-400 focus:ring-rose-400"
                    disabled={registerLoading}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="register-email" className="text-sm font-medium text-gray-700">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={registerData.email}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                    className="pl-10 border-rose-200 focus:border-rose-400 focus:ring-rose-400"
                    disabled={registerLoading}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="register-senha" className="text-sm font-medium text-gray-700">
                  Senha
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="register-senha"
                    type="password"
                    placeholder="••••••"
                    value={registerData.senha}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, senha: e.target.value }))}
                    className="pl-10 border-rose-200 focus:border-rose-400 focus:ring-rose-400"
                    disabled={registerLoading}
                    required
                    minLength={6}
                  />
                </div>
                <p className="text-xs text-gray-500">Mínimo de 6 caracteres</p>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white"
                disabled={registerLoading}
              >
                {registerLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Cadastrando...
                  </>
                ) : (
                  'Cadastrar'
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
