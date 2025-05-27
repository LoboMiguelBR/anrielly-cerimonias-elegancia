
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
        }
      })

      if (error) {
        console.error('Erro na função:', error)
        throw new Error(error.message || 'Erro ao gerar exportação')
      }

      // Para formatos binários (PDF e Word), a resposta vem diretamente como blob
      if (format === 'pdf' || format === 'word') {
        if (!data || !(data instanceof ArrayBuffer || data instanceof Blob)) {
          throw new Error('Resposta inválida do servidor para formato binário')
        }

        // Converter para blob se necessário
        const blob = data instanceof Blob ? data : new Blob([data])
        
        // Definir tipo MIME correto
        const mimeType = format === 'pdf' 
          ? 'application/pdf' 
          : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        
        const finalBlob = new Blob([blob], { type: mimeType })
        
        // Criar URL e fazer download
        const url = window.URL.createObjectURL(finalBlob)
        const link = document.createElement('a')
        link.href = url
        
        // Gerar nome do arquivo baseado no timestamp
        const timestamp = Date.now()
        const extension = format === 'pdf' ? 'pdf' : 'docx'
        link.download = `questionario_${timestamp}.${extension}`
        
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)

      } else if (format === 'txt') {
        // Para TXT, manter lógica existente
        if (!data || typeof data !== 'string') {
          throw new Error('Resposta inválida do servidor para formato texto')
        }

        const blob = new Blob([data], { type: 'text/plain;charset=utf-8' })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `questionario_${Date.now()}.txt`
        
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      }

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
