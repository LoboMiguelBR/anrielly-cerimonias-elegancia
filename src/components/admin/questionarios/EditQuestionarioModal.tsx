
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuestionarioActions } from '@/hooks/useQuestionarioActions';
import { Questionario } from '@/components/admin/tabs/types/questionario';

interface EditQuestionarioModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  questionario: Questionario | null;
}

const EditQuestionarioModal = ({ open, onOpenChange, onSuccess, questionario }: EditQuestionarioModalProps) => {
  const [formData, setFormData] = useState({
    nome_responsavel: '',
    email: '',
    status: 'rascunho'
  });

  const { updateQuestionario, loading } = useQuestionarioActions();

  useEffect(() => {
    if (questionario) {
      setFormData({
        nome_responsavel: questionario.nome_responsavel,
        email: questionario.email,
        status: questionario.status
      });
    }
  }, [questionario]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!questionario) return;

    const success = await updateQuestionario(questionario.id, formData);

    if (success) {
      onSuccess();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Questionário</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nome_responsavel">Nome do Responsável</Label>
            <Input
              id="nome_responsavel"
              value={formData.nome_responsavel}
              onChange={(e) => setFormData({ ...formData, nome_responsavel: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rascunho">Rascunho</SelectItem>
                <SelectItem value="enviado">Enviado</SelectItem>
                <SelectItem value="respondido">Respondido</SelectItem>
                <SelectItem value="processado">Processado</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditQuestionarioModal;
