
import React, { useState } from 'react';
import { useClientes } from '@/hooks/useClientes';
import { Plus, Edit, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

const emptyCliente = {
  name: '',
  email: '',
  phone: '',
  event_type: '',
  event_date: '',
  event_location: '',
  message: '',
  status: '',
  tags: [],
  historical_interactions: [],
};

export default function ClientesTab() {
  const { clientes, loading, addCliente, updateCliente, deleteCliente } = useClientes();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<any>(emptyCliente);

  const handleEdit = (cli: any) => {
    setForm(cli);
    setEditId(cli.id);
    setOpen(true);
  };
  const handleAdd = () => {
    setForm(emptyCliente);
    setEditId(null);
    setOpen(true);
  };
  const handleDelete = async (id: string) => {
    if (window.confirm('Excluir este cliente?')) {
      await deleteCliente(id);
    }
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      if (editId) {
        await updateCliente(editId, form);
        toast.success('Cliente atualizado!');
      } else {
        await addCliente(form);
        toast.success('Cliente cadastrado!');
      }
      setOpen(false);
    } catch (e: any) {
      toast.error(e.message);
    }
  };
  return (
    <div className="min-h-screen space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-playfair text-2xl font-bold">Clientes</h2>
        <Button onClick={handleAdd} size="sm">
          <Plus className="w-4 h-4 mr-1" /> Novo Cliente
        </Button>
      </div>
      {/* Table */}
      <div className="overflow-x-auto rounded-lg bg-white shadow border">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b text-gray-700">
              <th className="p-3 text-left">Nome</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Telefone</th>
              <th className="p-3 text-left">Tipo Evento</th>
              <th className="p-3 text-left">Data Evento</th>
              <th className="p-3 text-left"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i}>
                  <td><Skeleton className="h-4 w-24" /></td>
                  <td><Skeleton className="h-4 w-28" /></td>
                  <td><Skeleton className="h-4 w-20" /></td>
                  <td><Skeleton className="h-4 w-20" /></td>
                  <td><Skeleton className="h-4 w-20" /></td>
                  <td></td>
                </tr>
              ))
            ) : clientes.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center text-gray-400 p-4">Nenhum cliente encontrado.</td>
              </tr>
            ) : (
              clientes.map(cli => (
                <tr key={cli.id} className="border-b hover:bg-blue-50 transition">
                  <td className="p-3">{cli.name}</td>
                  <td className="p-3">{cli.email}</td>
                  <td className="p-3">{cli.phone}</td>
                  <td className="p-3">{cli.event_type}</td>
                  <td className="p-3">{cli.event_date || '-'}</td>
                  <td className="p-3 flex gap-2">
                    <Button size="icon" variant="ghost" onClick={() => handleEdit(cli)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(cli.id)}>
                      <Trash className="w-4 h-4 text-red-600" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogTitle>{editId ? "Editar Cliente" : "Novo Cliente"}</DialogTitle>
          <DialogDescription>Preencha os campos obrigatórios.</DialogDescription>
          <form className="space-y-3" onSubmit={handleSubmit}>
            <div>
              <Label>Nome</Label>
              <Input value={form.name} onChange={e => setForm((f: any) => ({ ...f, name: e.target.value }))} required />
            </div>
            <div>
              <Label>Email</Label>
              <Input value={form.email} onChange={e => setForm((f: any) => ({ ...f, email: e.target.value }))} required />
            </div>
            <div>
              <Label>Telefone</Label>
              <Input value={form.phone} onChange={e => setForm((f: any) => ({ ...f, phone: e.target.value }))} required />
            </div>
            <div>
              <Label>Tipo do Evento</Label>
              <Input value={form.event_type} onChange={e => setForm((f: any) => ({ ...f, event_type: e.target.value }))} required />
            </div>
            <div>
              <Label>Data do Evento</Label>
              <Input type="date" value={form.event_date || ''} onChange={e => setForm((f: any) => ({ ...f, event_date: e.target.value }))} />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" type="button" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button type="submit">{editId ? "Salvar" : "Cadastrar"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
