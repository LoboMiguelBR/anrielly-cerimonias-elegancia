
import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'

interface QuestionarioData {
  id: string
  nomeResponsavel: string
  email: string
  respostasJson: Record<string, string>
  status: string
}

interface AuthState {
  isAuthenticated: boolean
  questionario: QuestionarioData | null
  isLoading: boolean
}

export function useQuestionarioAuth(linkPublico: string) {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    questionario: null,
    isLoading: true
  })

  useEffect(() => {
    console.log('🔍 useQuestionarioAuth: Verificando auth para link:', linkPublico)
    
    if (!linkPublico) {
      console.log('❌ useQuestionarioAuth: Link público não fornecido')
      setAuthState(prev => ({ ...prev, isLoading: false }))
      return
    }

    // Verificar se há dados salvos no localStorage
    const savedAuth = localStorage.getItem(`questionario_auth_${linkPublico}`)
    if (savedAuth) {
      try {
        const parsed = JSON.parse(savedAuth)
        console.log('✅ useQuestionarioAuth: Auth recuperada do localStorage:', parsed)
        setAuthState({
          isAuthenticated: true,
          questionario: parsed,
          isLoading: false
        })
      } catch (error) {
        console.error('❌ Erro ao recuperar autenticação salva:', error)
        localStorage.removeItem(`questionario_auth_${linkPublico}`)
        setAuthState(prev => ({ ...prev, isLoading: false }))
      }
    } else {
      console.log('ℹ️ useQuestionarioAuth: Nenhuma auth salva encontrada')
      setAuthState(prev => ({ ...prev, isLoading: false }))
    }
  }, [linkPublico])

  const login = async (email: string, senha: string): Promise<{ success: boolean; error?: string; redirect?: boolean }> => {
    if (!email || !senha) {
      return { success: false, error: 'Email e senha são obrigatórios' }
    }

    try {
      console.log('🔄 Login: Tentando login para:', { email, linkPublico })
      
      const { data, error } = await supabase.functions.invoke('questionario-auth', {
        body: { action: 'login', email, senha, linkPublico }
      })

      console.log('📨 Login: Resposta da função:', { data, error })

      if (error) {
        console.error('❌ Login: Erro na função:', error)
        
        // Tratar erros específicos baseados no status/mensagem
        if (error.message?.includes('401') || error.message?.includes('Unauthorized') || error.message?.includes('Credenciais inválidas')) {
          return { success: false, error: 'Email ou senha incorretos' }
        }
        if (error.message?.includes('404') || error.message?.includes('Not Found')) {
          return { success: false, error: 'Link de questionário não encontrado' }
        }
        if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
          return { success: false, error: 'Erro de conexão. Verifique sua internet e tente novamente.' }
        }
        
        return { success: false, error: 'Erro de conexão com o servidor' }
      }

      if (!data) {
        console.error('❌ Login: Resposta vazia do servidor')
        return { success: false, error: 'Resposta vazia do servidor' }
      }

      if (data.error) {
        console.error('❌ Login: Erro retornado pela função:', data.error)
        return { success: false, error: data.error }
      }

      if (!data.questionario) {
        console.error('❌ Login: Dados do questionário não encontrados na resposta')
        return { success: false, error: 'Dados do questionário não encontrados' }
      }

      const questionarioData = data.questionario
      
      // Salvar no localStorage
      localStorage.setItem(`questionario_auth_${linkPublico}`, JSON.stringify(questionarioData))
      
      setAuthState({
        isAuthenticated: true,
        questionario: questionarioData,
        isLoading: false
      })

      console.log('✅ Login: Realizado com sucesso')
      return { success: true, redirect: true }
    } catch (error) {
      console.error('❌ Login: Erro no catch:', error)
      return { success: false, error: 'Erro de conexão. Verifique sua internet e tente novamente.' }
    }
  }

  const register = async (email: string, senha: string, nomeResponsavel: string): Promise<{ success: boolean; error?: string; redirect?: boolean }> => {
    if (!email || !senha || !nomeResponsavel) {
      return { success: false, error: 'Todos os campos são obrigatórios' }
    }

    if (senha.length < 6) {
      return { success: false, error: 'A senha deve ter pelo menos 6 caracteres' }
    }

    try {
      console.log('🔄 Register: Tentando registro para:', { email, nomeResponsavel, linkPublico })
      
      const { data, error } = await supabase.functions.invoke('questionario-auth', {
        body: { action: 'register', email, senha, nomeResponsavel, linkPublico }
      })

      console.log('📨 Register: Resposta da função:', { data, error })

      if (error) {
        console.error('❌ Register: Erro na função:', error)
        
        // Tratar erros específicos baseados no status/mensagem
        if (error.message?.includes('409') || error.message?.includes('Conflict') || error.message?.includes('Já existe uma conta')) {
          return { success: false, error: 'Já existe uma conta com este email para este questionário' }
        }
        if (error.message?.includes('404') || error.message?.includes('Not Found')) {
          return { success: false, error: 'Link de questionário não encontrado' }
        }
        if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
          return { success: false, error: 'Erro de conexão. Verifique sua internet e tente novamente.' }
        }
        
        return { success: false, error: 'Erro de conexão com o servidor' }
      }

      if (!data) {
        console.error('❌ Register: Resposta vazia do servidor')
        return { success: false, error: 'Resposta vazia do servidor' }
      }

      if (data.error) {
        console.error('❌ Register: Erro retornado pela função:', data.error)
        return { success: false, error: data.error }
      }

      if (!data.questionario) {
        console.error('❌ Register: Dados do questionário não encontrados na resposta')
        return { success: false, error: 'Dados do questionário não encontrados' }
      }

      const questionarioData = data.questionario
      
      // Salvar no localStorage
      localStorage.setItem(`questionario_auth_${linkPublico}`, JSON.stringify(questionarioData))
      
      setAuthState({
        isAuthenticated: true,
        questionario: questionarioData,
        isLoading: false
      })

      console.log('✅ Register: Realizado com sucesso')
      return { success: true, redirect: true }
    } catch (error) {
      console.error('❌ Register: Erro no catch:', error)
      return { success: false, error: 'Erro de conexão. Verifique sua internet e tente novamente.' }
    }
  }

  const logout = () => {
    console.log('🚪 Logout: Fazendo logout para link:', linkPublico)
    localStorage.removeItem(`questionario_auth_${linkPublico}`)
    setAuthState({
      isAuthenticated: false,
      questionario: null,
      isLoading: false
    })
  }

  const updateQuestionario = (questionario: QuestionarioData) => {
    console.log('🔄 UpdateQuestionario: Atualizando dados:', questionario)
    if (linkPublico) {
      localStorage.setItem(`questionario_auth_${linkPublico}`, JSON.stringify(questionario))
      setAuthState(prev => ({
        ...prev,
        questionario
      }))
    }
  }

  return {
    ...authState,
    login,
    register,
    logout,
    updateQuestionario
  }
}
