
import { useState } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { useToast } from '@/components/ui/use-toast'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, Shield } from 'lucide-react'
import { useQuestionarioAuth } from '@/hooks/useQuestionarioAuth'

const QuestionarioLogin = () => {
  const { linkPublico } = useParams<{ linkPublico: string }>()
  const { toast } = useToast()
  const { isAuthenticated, isLoading, login, register } = useQuestionarioAuth(linkPublico || '')

  const [loginData, setLoginData] = useState({ email: '', senha: '' })
  const [registerData, setRegisterData] = useState({ email: '', senha: '', nomeResponsavel: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to={`/questionario/${linkPublico}/formulario`} replace />
  }

  const validateField = (name: string, value: string) => {
    const errors = { ...fieldErrors }
    
    if (!value.trim()) {
      errors[name] = 'Campo obrigatório'
    } else {
      delete errors[name]
      
      if (name === 'email' && !/\S+@\S+\.\S+/.test(value)) {
        errors[name] = 'Email inválido'
      }
      
      if (name === 'senha' && value.length < 6) {
        errors[name] = 'Senha deve ter pelo menos 6 caracteres'
      }
    }
    
    setFieldErrors(errors)
  }

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
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-100 flex items-center justify-center p-4">
      <div className="w-full max-w-[420px] space-y-6 animate-fadeIn">
        {/* Logo */}
        <div className="text-center">
          <img 
            src="/LogoAG_192x192.png" 
            alt="Anrielly Gomes Cerimonialista" 
            className="w-20 h-20 mx-auto mb-4 transition-transform hover:scale-105"
          />
          <h1 className="text-3xl font-playfair font-bold text-gray-800 mb-2">
            Anrielly Gomes Cerimonialista
          </h1>
        </div>

        {/* Card de Cadastro Essencial */}
        <Card className="bg-rose-50 border border-rose-200 rounded-2xl shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Shield className="w-6 h-6 text-rose-600 mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-lg font-medium text-gray-700 mb-3">
                  🔐 Cadastro Essencial para sua Segurança
                </h2>
                <div className="text-sm font-medium text-gray-700 space-y-3">
                  <p>
                    Para garantir que cada noivo(a) tenha um <strong>acesso exclusivo, seguro e individual</strong>, é necessário realizar um cadastro antes de preencher o questionário.
                  </p>
                  <p>
                    ✅ Isso assegura que suas respostas fiquem salvas com total privacidade, permitindo que você preencha no seu tempo, com tranquilidade, e possa retornar sempre que desejar.
                  </p>
                  <p>
                    🔒 O cadastro é essencial para manter a <strong>confiabilidade, autenticidade e segurança</strong> das informações, além de garantir que cada história seja tratada com o carinho e o cuidado que ela merece.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Formulários de Login/Cadastro */}
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

        {/* Mensagem de Boas-vindas */}
        <Card className="bg-white border border-rose-100 rounded-2xl shadow-sm">
          <CardContent className="p-6">
            <h2 className="text-lg font-playfair text-center text-gray-800 mb-4">
              📝 Mensagem de Boas-vindas ao Questionário
            </h2>
            <div className="text-sm text-gray-700 space-y-3">
              <p>
                Olá! Seja muito bem-vindo(a) ao nosso <strong>Questionário de Celebração do Amor</strong>.
              </p>
              <p>
                Queremos te lembrar que este não é um simples formulário... é um momento especial para você refletir, reviver memórias e contar a linda história de vocês, com todo carinho, verdade e coração.
              </p>
              <p className="text-rose-600 font-medium">
                💖 Não tenha pressa!
              </p>
              <p>
                Sinta-se totalmente à vontade para responder no seu tempo, com toda sinceridade e tranquilidade.
              </p>
              <p>
                Você pode salvar suas respostas a qualquer momento e, sempre que desejar, retornar para continuar de onde parou. Basta usar o seu email e senha cadastrados no início do preenchimento.
              </p>
              <p>
                Nosso maior desejo é que esse questionário seja uma experiência leve, divertida e cheia de amor. Afinal, cada detalhe que você compartilha nos ajuda a tornar a cerimônia ainda mais única, verdadeira e especial.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default QuestionarioLogin
