
import { useState } from 'react'

export const useQuestionarioValidation = () => {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

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

  const clearFieldErrors = () => {
    setFieldErrors({})
  }

  return {
    fieldErrors,
    validateField,
    clearFieldErrors
  }
}
