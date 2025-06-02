
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface QuestionarioTemplateDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  templateName: string;
  isDefault: boolean;
  onConfirm: () => void;
}

const QuestionarioTemplateDeleteDialog = ({
  open,
  onOpenChange,
  templateName,
  isDefault,
  onConfirm
}: QuestionarioTemplateDeleteDialogProps) => {
  if (isDefault) {
    return (
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Não é possível excluir</AlertDialogTitle>
            <AlertDialogDescription>
              O template "{templateName}" é um template padrão e não pode ser excluído.
              Templates padrão são necessários para o funcionamento do sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Entendi</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir o template "{templateName}"?
            <br /><br />
            <strong>Esta ação não pode ser desfeita.</strong> Todas as seções e perguntas 
            deste template também serão excluídas permanentemente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700"
          >
            Excluir Template
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default QuestionarioTemplateDeleteDialog;
