import React, { useState, useRef } from "react";
import { useEventTasks } from "@/hooks/useEventTasks";
import { Plus, Trash, Edit, CheckCircle2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface EventTasksProps {
  eventId: string;
}

const emptyForm = {
  title: "",
  description: "",
  due_date: "",
  assigned_to: "",
};

export default function EventTasks({ eventId }: EventTasksProps) {
  const { tasks, loading, addTask, updateTask, deleteTask, reorderTasks } = useEventTasks(eventId);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<any>(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const dragItem = useRef<number | null>(null);

  const handleOpenNew = () => {
    setForm(emptyForm);
    setEditId(null);
    setOpen(true);
  };

  const handleOpenEdit = (task: any) => {
    setForm({
      title: task.title,
      description: task.description || "",
      due_date: task.due_date || "",
      assigned_to: task.assigned_to || "",
    });
    setEditId(task.id);
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) {
      toast.error("Título é obrigatório");
      return;
    }
    if (editId) {
      const { error } = await updateTask(editId, form);
      if (error) toast.error("Erro ao atualizar tarefa");
      else toast.success("Tarefa atualizada");
    } else {
      const { error } = await addTask(form);
      if (error) toast.error("Erro ao adicionar tarefa");
      else toast.success("Tarefa adicionada");
    }
    setOpen(false);
  };

  const handleToggleComplete = async (task: any) => {
    await updateTask(task.id, {
      completed: !task.completed,
      completed_at: !task.completed ? new Date().toISOString() : null,
    });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Excluir esta tarefa?")) {
      const { error } = await deleteTask(id);
      if (error) toast.error("Erro ao excluir tarefa");
      else toast.success("Tarefa excluída");
    }
  };

  // Função para aplicar nova ordem
  const onDrop = () => {
    if (draggedIndex !== null && dragOverIndex !== null && draggedIndex !== dragOverIndex) {
      const newTasks = [...tasks];
      const [removed] = newTasks.splice(draggedIndex, 1);
      newTasks.splice(dragOverIndex, 0, removed);

      reorderTasks(newTasks.map(t => t.id));
      setDraggedIndex(null);
      setDragOverIndex(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Checklist / Tarefas</h3>
        <Button size="sm" onClick={handleOpenNew}>
          <Plus className="w-4 h-4 mr-1" /> Nova Tarefa
        </Button>
      </div>
      <div className="bg-white rounded shadow border divide-y">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3">
              <Skeleton className="w-5 h-5 rounded-full" />
              <Skeleton className="w-28 h-4" />
              <Skeleton className="w-14 h-4" />
            </div>
          ))
        ) : tasks.length === 0 ? (
          <div className="text-gray-400 text-center py-8">Nenhuma tarefa cadastrada.</div>
        ) : (
          tasks
            .slice()
            .sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0)) // Corrigido uso do campo order_index
            .map((task, index) => (
            <div
              key={task.id}
              className={`flex items-center gap-3 p-3 hover:bg-blue-50 transition 
                ${draggedIndex === index ? "opacity-40" : ""}
                ${dragOverIndex === index ? "ring-2 ring-blue-400" : ""}
              `}
              draggable
              onDragStart={() => {
                setDraggedIndex(index);
                dragItem.current = index;
              }}
              onDragEnter={() => {
                if (draggedIndex !== null && draggedIndex !== index) setDragOverIndex(index);
              }}
              onDragOver={e => e.preventDefault()}
              onDrop={onDrop}
              onDragEnd={() => {
                setDraggedIndex(null);
                setDragOverIndex(null);
              }}
              style={{
                cursor: "grab",
                userSelect: "none",
              }}
              title="Arraste para reordenar"
            >
              <button
                className={`mr-2 rounded-full border-none bg-transparent ${task.completed ? "text-green-500" : "text-gray-400"}`}
                onClick={() => handleToggleComplete(task)}
                title="Marcar como concluída"
              >
                {task.completed ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
              </button>
              <div className="flex-1">
                <div className={`font-medium ${task.completed ? "line-through text-gray-500" : ""}`}>
                  {task.title}
                </div>
                {task.description && (
                  <div className="text-xs text-gray-500">{task.description}</div>
                )}
                <div className="text-xs text-gray-400">
                  {task.due_date && <>Prazo: {task.due_date} </>}
                  {task.assigned_to && <> | Responsável: {task.assigned_to}</>}
                </div>
              </div>
              <Button size="icon" variant="ghost" onClick={() => handleOpenEdit(task)} title="Editar">
                <Edit className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => handleDelete(task.id)} title="Excluir">
                <Trash className="w-4 h-4 text-red-600" />
              </Button>
              {/* Ícone visual de arrastar */}
              <span className="ml-2 text-gray-400 cursor-grab hover:scale-110 transition" title="Arrastar para reordenar">
                <svg width="16" height="16" fill="none" viewBox="0 0 20 20">
                  <circle cx="6" cy="6" r="1.5" fill="currentColor"/>
                  <circle cx="14" cy="6" r="1.5" fill="currentColor"/>
                  <circle cx="6" cy="14" r="1.5" fill="currentColor"/>
                  <circle cx="14" cy="14" r="1.5" fill="currentColor"/>
                </svg>
              </span>
            </div>
          ))
        )}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogTitle>{editId ? "Editar Tarefa" : "Nova Tarefa"}</DialogTitle>
          <form className="space-y-3" onSubmit={handleSubmit}>
            <div>
              <Input
                value={form.title}
                placeholder="Título"
                onChange={e => setForm((f: any) => ({ ...f, title: e.target.value }))}
                required
              />
            </div>
            <div>
              <Textarea
                value={form.description}
                placeholder="Descrição"
                rows={2}
                onChange={e => setForm((f: any) => ({ ...f, description: e.target.value }))}
              />
            </div>
            <div className="flex gap-2">
              <Input
                value={form.due_date}
                type="date"
                onChange={e => setForm((f: any) => ({ ...f, due_date: e.target.value }))}
                className="max-w-xs"
                placeholder="Prazo"
              />
              <Input
                value={form.assigned_to}
                placeholder="Responsável"
                onChange={e => setForm((f: any) => ({ ...f, assigned_to: e.target.value }))}
                className="max-w-xs"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">{editId ? "Salvar" : "Cadastrar"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
