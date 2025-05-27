
import { useState } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { useQuestionarioAuth } from '@/hooks/useQuestionarioAuth'
import { useQuestionarioValidation } from '@/hooks/useQuestionarioValidation'

interface QuestionarioAuthFormsProps {
  linkPublico: string
}

const QuestionarioAuthForms = ({ linkPublico }: QuestionarioAuthFormsProps) => {
  const { toast } = useToast()
  const { login, register } = useQuestionarioAuth(linkPublico)
  const { fieldErrors, validateField } = useQuestionarioValidation()

  const [loginData, setLoginData] = useState({ email: '', senha: '' })
  const [registerData, setRegisterData] = useState({ email: '', senha: '', nomeResponsavel: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    // Validate fields
    validateField('email', loginData.email)
    validateField('senha', loginData.senha)
    
    if (Object.keys(fieldErrors).length > 0 || !loginData.email || !loginData.senha) {
      return
    }
    
    setIsSubmitting(true)

    console.log('Iniciando login...')
    const result = await login(loginData.email, loginData.senha)
    
    if (result.success) {
      toast({
        title: "Login realizado com sucesso!",
        description: "Redirecionando para o questionário...",
      })
    } else {
      console.error('Erro no login:', result.error)
      setError(result.error || 'Erro desconhecido no login')
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
    setError('')
    
    // Validate fields
    validateField('nomeResponsavel', registerData.nomeResponsavel)
    validateField('email', registerData.email)
    validateField('senha', registerData.senha)
    
    if (Object.keys(fieldErrors).length > 0 || !registerData.email || !registerData.senha || !registerData.nomeResponsavel) {
      return
    }
    
    setIsSubmitting(true)

    console.log('Iniciando registro...')
    const result = await register(registerData.email, registerData.senha, registerData.nomeResponsavel)
    
    if (result.success) {
      toast({
        title: "Conta criada com sucesso!",
        description: "Um email de boas-vindas foi enviado. Redirecionando para o questionário...",
      })
    } else {
      console.error('Erro no registro:', result.error)
      setError(result.error || 'Erro desconhecido no registro')
      toast({
        title: "Erro ao criar conta",
        description: result.error,
        variant: "destructive",
      })
    }
    
    setIsSubmitting(false)
  }

  return (
    <Card className="rounded-2xl shadow-md hover:shadow-lg transition-shadow bg-white">
      <CardHeader className="text-center p-8">
        <CardTitle className="text-2xl font-playfair font-bold text-gray-800">
          Questionário de Noivos
        </CardTitle>
        <CardDescription className="text-base text-gray-600">
          Acesse ou crie sua conta para preencher o questionário
        </CardDescription>
      </CardHeader>
      <CardContent className="p-8 pt-0">
        {error && (
          <Alert variant="destructive" className="mb-6 bg-rose-50 border-rose-200">
            <AlertCircle className="h-5 w-5" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid grid-cols-2 bg-neutral-100 rounded-full mb-6">
            <TabsTrigger 
              value="login" 
              className="data-[state=active]:bg-rose-100 data-[state=active]:text-rose-700 rounded-full text-[15px] font-medium"
            >
              Entrar
            </TabsTrigger>
            <TabsTrigger 
              value="register" 
              className="data-[state=active]:bg-rose-100 data-[state=active]:text-rose-700 rounded-full text-[15px] font-medium"
            >
              Criar Conta
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="login-email" className="text-sm font-medium text-gray-700">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  value={loginData.email}
                  onChange={(e) => {
                    setError('')
                    setLoginData(prev => ({ ...prev, email: e.target.value }))
                    validateField('email', e.target.value)
                  }}
                  placeholder="seu@email.com"
                  className="bg-neutral-50 border-neutral-300 focus-visible:ring-rose-400 placeholder:text-gray-400"
                  required
                />
                {fieldErrors.email && (
                  <p className="text-xs text-red-500">{fieldErrors.email}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-senha" className="text-sm font-medium text-gray-700">Senha</Label>
                <PasswordInput
                  id="login-senha"
                  value={loginData.senha}
                  onChange={(e) => {
                    setError('')
                    setLoginData(prev => ({ ...prev, senha: e.target.value }))
                    validateField('senha', e.target.value)
                  }}
                  placeholder="Sua senha"
                  className="bg-neutral-50 border-neutral-300 focus-visible:ring-rose-400 placeholder:text-gray-400"
                  required
                />
                {fieldErrors.senha && (
                  <p className="text-xs text-red-500">{fieldErrors.senha}</p>
                )}
              </div>
              <Button 
                type="submit" 
                className="w-full bg-rose-500 hover:bg-rose-600 text-white rounded-full font-medium"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register">
            <form onSubmit={handleRegister} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="register-nome" className="text-sm font-medium text-gray-700">Nome Completo</Label>
                <Input
                  id="register-nome"
                  type="text"
                  value={registerData.nomeResponsavel}
                  onChange={(e) => {
                    setError('')
                    setRegisterData(prev => ({ ...prev, nomeResponsavel: e.target.value }))
                    validateField('nomeResponsavel', e.target.value)
                  }}
                  placeholder="Seu nome completo"
                  className="bg-neutral-50 border-neutral-300 focus-visible:ring-rose-400 placeholder:text-gray-400"
                  required
                />
                {fieldErrors.nomeResponsavel && (
                  <p className="text-xs text-red-500">{fieldErrors.nomeResponsavel}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-email" className="text-sm font-medium text-gray-700">Email</Label>
                <Input
                  id="register-email"
                  type="email"
                  value={registerData.email}
                  onChange={(e) => {
                    setError('')
                    setRegisterData(prev => ({ ...prev, email: e.target.value }))
                    validateField('email', e.target.value)
                  }}
                  placeholder="seu@email.com"
                  className="bg-neutral-50 border-neutral-300 focus-visible:ring-rose-400 placeholder:text-gray-400"
                  required
                />
                {fieldErrors.email && (
                  <p className="text-xs text-red-500">{fieldErrors.email}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-senha" className="text-sm font-medium text-gray-700">Senha</Label>
                <PasswordInput
                  id="register-senha"
                  value={registerData.senha}
                  onChange={(e) => {
                    setError('')
                    setRegisterData(prev => ({ ...prev, senha: e.target.value }))
                    validateField('senha', e.target.value)
                  }}
                  placeholder="Escolha uma senha (mín. 6 caracteres)"
                  className="bg-neutral-50 border-neutral-300 focus-visible:ring-rose-400 placeholder:text-gray-400"
                  required
                  minLength={6}
                />
                {fieldErrors.senha && (
                  <p className="text-xs text-red-500">{fieldErrors.senha}</p>
                )}
              </div>
              <Button 
                type="submit" 
                className="w-full bg-rose-500 hover:bg-rose-600 text-white rounded-full font-medium"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Criando...' : 'Criar Conta'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default QuestionarioAuthForms
