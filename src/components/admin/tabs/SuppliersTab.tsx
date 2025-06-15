
import React, { useState } from 'react';
import { useSuppliers } from '@/hooks/useSuppliers';
import { Plus, Edit, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

const emptySupplier = {
  name: '',
  email: '',
  phone: '',
  category: '',
  rating: 0,
  contracts: [],
  portfolio_images: [],
  tags: [],
};

export default function SuppliersTab() {
  const { suppliers, loading, addSupplier, updateSupplier, deleteSupplier } = useSuppliers();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<any>(emptySupplier);

  const handleEdit = (sup: any) => {
    setForm(sup);
    setEditId(sup.id);
    setOpen(true);
  };
  const handleAdd = () => {
    setForm(emptySupplier);
    setEditId(null);
    setOpen(true);
  };
  const handleDelete = async (id: string) => {
    if (window.confirm('Excluir este fornecedor?')) {
      await deleteSupplier(id);
    }
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      if (editId) {
        await updateSupplier(editId, form);
        toast.success('Fornecedor atualizado!');
      } else {
        await addSupplier(form);
        toast.success('Fornecedor cadastrado!');
      }
      setOpen(false);
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <div className="min-h-screen space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-playfair text-2xl font-bold">Fornecedores</h2>
        <Button onClick={handleAdd} size="sm">
          <Plus className="w-4 h-4 mr-1" /> Novo Fornecedor
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
              <th className="p-3 text-left">Categoria</th>
              <th className="p-3 text-left">Avaliação</th>
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
            ) : suppliers.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center text-gray-400 p-4">Nenhum fornecedor encontrado.</td>
              </tr>
            ) : (
              suppliers.map(sup => (
                <tr key={sup.id} className="border-b hover:bg-blue-50 transition">
                  <td className="p-3">{sup.name}</td>
                  <td className="p-3">{sup.email}</td>
                  <td className="p-3">{sup.phone}</td>
                  <td className="p-3">{sup.category}</td>
                  <td className="p-3">{sup.rating ?? '-'}</td>
                  <td className="p-3 flex gap-2">
                    <Button size="icon" variant="ghost" onClick={() => handleEdit(sup)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(sup.id)}>
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
          <DialogTitle>{editId ? "Editar Fornecedor" : "Novo Fornecedor"}</DialogTitle>
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
              <Label>Categoria</Label>
              <Input value={form.category} onChange={e => setForm((f: any) => ({ ...f, category: e.target.value }))} required />
            </div>
            <div>
              <Label>Avaliação</Label>
              <Input type="number" value={form.rating ?? 0} onChange={e => setForm((f: any) => ({ ...f, rating: Number(e.target.value) }))} min={0} max={5} step={0.1} />
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
