
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
      const { data, error } = await supabase.functions.invoke('questionario-auth', {
        body: { action: 'login', email, senha, linkPublico }
      })

      if (error) {
        console.error('Erro na função:', error)
        return { success: false, error: 'Erro de conexão com o servidor' }
      }

      if (!data) {
        return { success: false, error: 'Resposta vazia do servidor' }
      }

      if (data.error) {
        return { success: false, error: data.error }
      }

      const questionarioData = data.questionario
      
      // Salvar no localStorage
      localStorage.setItem(`questionario_auth_${linkPublico}`, JSON.stringify(questionarioData))
      
      setAuthState({
        isAuthenticated: true,
        questionario: questionarioData,
        isLoading: false
      })

      return { success: true }
    } catch (error) {
      console.error('Erro no login:', error)
      return { success: false, error: 'Erro de conexão' }
    }
  }

  const register = async (email: string, senha: string, nomeResponsavel: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.functions.invoke('questionario-auth', {
        body: { action: 'register', email, senha, nomeResponsavel, linkPublico }
      })

      if (error) {
        console.error('Erro na função:', error)
        return { success: false, error: 'Erro de conexão com o servidor' }
      }

      if (!data) {
        return { success: false, error: 'Resposta vazia do servidor' }
      }

      if (data.error) {
        return { success: false, error: data.error }
      }

      const questionarioData = data.questionario
      
      // Salvar no localStorage
      localStorage.setItem(`questionario_auth_${linkPublico}`, JSON.stringify(questionarioData))
      
      setAuthState({
        isAuthenticated: true,
        questionario: questionarioData,
        isLoading: false
      })

      return { success: true }
    } catch (error) {
      console.error('Erro no registro:', error)
      return { success: false, error: 'Erro de conexão' }
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
