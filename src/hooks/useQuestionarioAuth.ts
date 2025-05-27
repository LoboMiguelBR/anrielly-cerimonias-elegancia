
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
    // Verificar se há dados salvos no localStorage
    const savedAuth = localStorage.getItem(`questionario_auth_${linkPublico}`)
    if (savedAuth) {
      try {
        const parsed = JSON.parse(savedAuth)
        setAuthState({
          isAuthenticated: true,
          questionario: parsed,
          isLoading: false
        })
      } catch (error) {
        console.error('Erro ao recuperar autenticação salva:', error)
        localStorage.removeItem(`questionario_auth_${linkPublico}`)
        setAuthState(prev => ({ ...prev, isLoading: false }))
      }
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }))
    }
  }, [linkPublico])

  const login = async (email: string, senha: string): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('Tentando login:', { email, linkPublico })
      
      const { data, error } = await supabase.functions.invoke('questionario-auth', {
        body: { action: 'login', email, senha, linkPublico }
      })

      console.log('Resposta da função:', { data, error })

      if (error) {
        console.error('Erro na função:', error)
        if (error.message?.includes('401')) {
          return { success: false, error: 'Credenciais inválidas' }
        }
        if (error.message?.includes('404')) {
          return { success: false, error: 'Link de questionário não encontrado' }
        }
        return { success: false, error: 'Erro de conexão com o servidor' }
      }

      if (!data) {
        console.error('Resposta vazia do servidor')
        return { success: false, error: 'Resposta vazia do servidor' }
      }

      if (data.error) {
        console.error('Erro retornado pela função:', data.error)
        return { success: false, error: data.error }
      }

      if (!data.questionario) {
        console.error('Dados do questionário não encontrados na resposta')
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

      console.log('Login realizado com sucesso')
      return { success: true }
    } catch (error) {
      console.error('Erro no login (catch):', error)
      return { success: false, error: 'Erro de conexão. Verifique sua internet e tente novamente.' }
    }
  }

  const register = async (email: string, senha: string, nomeResponsavel: string): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('Tentando registro:', { email, nomeResponsavel, linkPublico })
      
      const { data, error } = await supabase.functions.invoke('questionario-auth', {
        body: { action: 'register', email, senha, nomeResponsavel, linkPublico }
      })

      console.log('Resposta da função (register):', { data, error })

      if (error) {
        console.error('Erro na função:', error)
        if (error.message?.includes('409')) {
          return { success: false, error: 'Já existe uma conta com este email para este questionário' }
        }
        if (error.message?.includes('404')) {
          return { success: false, error: 'Link de questionário não encontrado' }
        }
        return { success: false, error: 'Erro de conexão com o servidor' }
      }

      if (!data) {
        console.error('Resposta vazia do servidor')
        return { success: false, error: 'Resposta vazia do servidor' }
      }

      if (data.error) {
        console.error('Erro retornado pela função:', data.error)
        return { success: false, error: data.error }
      }

      if (!data.questionario) {
        console.error('Dados do questionário não encontrados na resposta')
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

      console.log('Registro realizado com sucesso')
      return { success: true }
    } catch (error) {
      console.error('Erro no registro (catch):', error)
      return { success: false, error: 'Erro de conexão. Verifique sua internet e tente novamente.' }
    }
  }

  const logout = () => {
    localStorage.removeItem(`questionario_auth_${linkPublico}`)
    setAuthState({
      isAuthenticated: false,
      questionario: null,
      isLoading: false
    })
  }

  const updateQuestionario = (questionario: QuestionarioData) => {
    localStorage.setItem(`questionario_auth_${linkPublico}`, JSON.stringify(questionario))
    setAuthState(prev => ({
      ...prev,
      questionario
    }))
  }

  return {
    ...authState,
    login,
    register,
    logout,
    updateQuestionario
  }
}
