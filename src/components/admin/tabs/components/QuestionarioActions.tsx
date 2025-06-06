
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { 
  Eye, 
  Edit, 
  Copy, 
  FileText, 
  Trash2,
  ExternalLink 
} from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import { useQuestionarioWordExport } from '@/hooks/useQuestionarioWordExport'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface QuestionarioActionsProps {
  questionario: {
    id: string
    link_publico: string
    nome_responsavel: string
    respostas_json?: Record<string, string>
  }
  onView: () => void
  onEdit?: () => void
  onDelete?: () => void
}

const QuestionarioActions = ({ 
  questionario, 
  onView, 
  onEdit, 
  onDelete 
}: QuestionarioActionsProps) => {
  const { toast } = useToast()
  const { exportQuestionario, isExporting } = useQuestionarioWordExport()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const copyLink = async () => {
    const link = `${window.location.origin}/questionario/${questionario.link_publico}`
    try {
      await navigator.clipboard.writeText(link)
      toast({
        title: "Link copiado!",
        description: "Link do questionário copiado para a área de transferência",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar o link",
        variant: "destructive",
      })
    }
  }

  const openQuestionario = () => {
    const url = `${window.location.origin}/questionario/${questionario.link_publico}`
    window.open(url, '_blank')
  }

  const handleWordExport = async () => {
    await exportQuestionario(questionario)
  }

  const handleDelete = () => {
    setShowDeleteDialog(false)
    onDelete?.()
  }

  return (
    <>
      <div className="flex items-center gap-1">
        {/* Botão Ver */}
        <Button
          size="sm"
          variant="outline"
          onClick={onView}
          className="h-8 w-8 p-0"
        >
          <Eye className="h-4 w-4" />
        </Button>

        {/* Botão Editar */}
        {onEdit && (
          <Button
            size="sm"
            variant="outline"
            onClick={onEdit}
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
          </Button>
        )}

        {/* Botão Abrir Link */}
        <Button
          size="sm"
          variant="outline"
          onClick={openQuestionario}
          className="h-8 w-8 p-0"
        >
          <ExternalLink className="h-4 w-4" />
        </Button>

        {/* Botão Exportar Word */}
        <Button
          size="sm"
          variant="outline"
          onClick={handleWordExport}
          disabled={isExporting}
          className="h-8 w-8 p-0"
        >
          <FileText className="h-4 w-4" />
        </Button>

        {/* Botão Copiar Link */}
        <Button
          size="sm"
          variant="outline"
          onClick={copyLink}
          className="h-8 w-8 p-0"
        >
          <Copy className="h-4 w-4" />
        </Button>

        {/* Botão Excluir */}
        {onDelete && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowDeleteDialog(true)}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Dialog de Confirmação de Exclusão */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Questionário</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o questionário de{' '}
              <strong>{questionario.nome_responsavel}</strong>?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default QuestionarioActions
