
import { useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/components/ui/use-toast'

export const useQuestionarioExport = () => {
  const [isExporting, setIsExporting] = useState(false)
  const { toast } = useToast()

  const exportQuestionario = async (questionarioId: string, format: 'pdf' | 'word') => {
    setIsExporting(true)
    try {
      // Primeiro, obter o conteúdo em formato texto
      const { data, error } = await supabase.functions.invoke('export-questionario', {
        body: {
          questionarioId,
          format: 'txt'
        }
      })

      if (error || !data.success) {
        throw new Error(data?.error || 'Erro ao gerar exportação')
      }

      // Criar e fazer download do arquivo
      const blob = new Blob([data.content], { type: 'text/plain;charset=utf-8' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      
      if (format === 'pdf') {
        link.download = data.filename.replace('.txt', '.txt') // Para agora, mantém como txt
      } else {
        link.download = data.filename.replace('.txt', '.txt') // Para agora, mantém como txt
      }
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast({
        title: "Exportação realizada com sucesso!",
        description: `Arquivo baixado em formato ${format.toUpperCase()}`,
      })

    } catch (error) {
      console.error('Erro na exportação:', error)
      toast({
        title: "Erro na exportação",
        description: "Não foi possível exportar o questionário",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  return {
    exportQuestionario,
    isExporting
  }
}
