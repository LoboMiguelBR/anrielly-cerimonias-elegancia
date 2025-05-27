
import { useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/components/ui/use-toast'

export const useQuestionarioExport = () => {
  const [isExporting, setIsExporting] = useState(false)
  const { toast } = useToast()

  const exportQuestionario = async (questionarioId: string, format: 'pdf' | 'word' | 'txt') => {
    setIsExporting(true)
    try {
      console.log(`Iniciando exportação ${format.toUpperCase()}...`)
      
      const { data, error } = await supabase.functions.invoke('export-questionario', {
        body: {
          questionarioId,
          format
        },
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (error) {
        console.error('Erro na função:', error)
        throw new Error(error.message || 'Erro ao gerar exportação')
      }

      if (!data) {
        throw new Error('Nenhum dado retornado do servidor')
      }

      let blob: Blob
      let filename: string
      let mimeType: string

      if (format === 'txt') {
        // Para TXT, os dados vêm como string
        if (typeof data !== 'string') {
          throw new Error('Formato de resposta inválido para TXT')
        }
        blob = new Blob([data], { type: 'text/plain;charset=utf-8' })
        filename = `questionario_${Date.now()}.txt`
        mimeType = 'text/plain'
      } else {
        // Para PDF e Word, os dados vêm como ArrayBuffer
        if (!(data instanceof ArrayBuffer)) {
          throw new Error('Formato de resposta inválido para arquivo binário')
        }
        
        if (format === 'pdf') {
          mimeType = 'application/pdf'
          filename = `questionario_${Date.now()}.pdf`
        } else { // word
          mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          filename = `questionario_${Date.now()}.docx`
        }
        
        blob = new Blob([data], { type: mimeType })
      }

      // Criar URL e fazer download
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      const formatLabels = {
        pdf: 'PDF',
        word: 'Word',
        txt: 'TXT'
      }

      toast({
        title: "Exportação realizada com sucesso!",
        description: `Arquivo baixado em formato ${formatLabels[format]}`,
      })

    } catch (error) {
      console.error('Erro na exportação:', error)
      toast({
        title: "Erro na exportação",
        description: error instanceof Error ? error.message : "Não foi possível exportar o questionário",
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
