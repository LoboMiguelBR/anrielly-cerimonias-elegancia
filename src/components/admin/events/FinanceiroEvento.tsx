
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BadgeDollarSign, Banknote } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

type Transaction = {
  id: string;
  amount: number;
  type: "entrada" | "saida";
  description: string;
  transaction_date: string;
  category: string;
  payment_method?: string;
};

interface FinanceiroEventoProps {
  eventId: string;
}

const emptyForm = {
  amount: "",
  type: "entrada",
  description: "",
  transaction_date: "",
  category: "",
  payment_method: "",
};

const categoriaPadrao = "Evento";

const categorias = [
  { value: "Evento", label: "Evento" },
  { value: "Fornecedor", label: "Fornecedor" },
  { value: "Cliente", label: "Cliente" },
];

export default function FinanceiroEvento({ eventId }: FinanceiroEventoProps) {
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [form, setForm] = useState<any>(emptyForm);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const fetchTransactions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("financial_transactions")
      .select("*")
      .eq("reference_id", eventId)
      .order("transaction_date", { ascending: true });
    if (!error) {
      setTransactions((data || []).map((t: any) => ({
        ...t,
        amount: Number(t.amount),
        type: t.type,
      })));
    }
    setLoading(false);
  };

  useEffect(() => {
    if (eventId) fetchTransactions();
    // eslint-disable-next-line
  }, [eventId]);

  const handleOpenForm = () => {
    setForm(emptyForm);
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const valor = Number(form.amount);
    if (!valor || !form.transaction_date) {
      toast.error("Preencha o valor e a data!");
      return;
    }
    const { error } = await supabase
      .from("financial_transactions")
      .insert([{
        amount: valor,
        type: form.type,
        description: form.description,
        transaction_date: form.transaction_date,
        category: form.category || categoriaPadrao,
        payment_method: form.payment_method,
        reference_id: eventId,
        reference_type: "event",
      }]);
    if (!error) {
      toast.success("Transação adicionada!");
      setIsFormOpen(false);
      fetchTransactions();
    } else {
      toast.error("Erro ao adicionar transação.");
    }
  };

  const tipoBadge = (type: string) => {
    return type === "entrada"
      ? <BadgeDollarSign className="text-green-600 inline mr-1" />
      : <Banknote className="text-yellow-800 inline mr-1" />;
  };

  const somaEntradas = transactions.filter((t) => t.type === "entrada").reduce((sum, t) => sum + t.amount, 0);
  const somaSaidas = transactions.filter((t) => t.type === "saida").reduce((sum, t) => sum + t.amount, 0);
  const saldo = somaEntradas - somaSaidas;

  return (
    <Card className="border-neutral-200 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <BadgeDollarSign className="h-5 w-5 text-green-600" />
          Financeiro do Evento
        </CardTitle>
        <Button size="sm" onClick={handleOpenForm}>
          Nova transação
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-3 flex flex-row flex-wrap justify-between gap-3">
          <div><span className="font-semibold">Entradas:</span> <span className="text-green-600">R$ {somaEntradas.toFixed(2)}</span></div>
          <div><span className="font-semibold">Saídas:</span> <span className="text-yellow-800">R$ {somaSaidas.toFixed(2)}</span></div>
          <div><span className="font-semibold">Saldo:</span> <span className={`font-bold ${saldo >= 0 ? "text-green-600" : "text-red-600"}`}>R$ {saldo.toFixed(2)}</span></div>
        </div>
        {isFormOpen && (
          <form className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-3 items-end" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs mb-1 font-semibold">Tipo</label>
              <select
                className="input w-full border rounded px-3 py-2"
                value={form.type}
                onChange={e => setForm((f: any) => ({ ...f, type: e.target.value }))}
              >
                <option value="entrada">Entrada</option>
                <option value="saida">Saída</option>
              </select>
            </div>
            <div>
              <label className="block text-xs mb-1 font-semibold">Valor (R$)</label>
              <Input
                type="number"
                min={0}
                step="0.01"
                value={form.amount}
                onChange={e => setForm((f: any) => ({ ...f, amount: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block text-xs mb-1 font-semibold">Data</label>
              <Input
                type="date"
                value={form.transaction_date}
                onChange={e => setForm((f: any) => ({ ...f, transaction_date: e.target.value }))}
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs mb-1 font-semibold">Descrição</label>
              <Input
                type="text"
                value={form.description}
                onChange={e => setForm((f: any) => ({ ...f, description: e.target.value }))}
                placeholder="Ex: Entrada via pix/fornecedor"
              />
            </div>
            <div>
              <label className="block text-xs mb-1 font-semibold">Categoria</label>
              <select
                className="input w-full border rounded px-3 py-2"
                value={form.category}
                onChange={e => setForm((f: any) => ({ ...f, category: e.target.value }))}
              >
                {categorias.map(cat => (
                  <option value={cat.value} key={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs mb-1 font-semibold">Forma de pagamento</label>
              <Input
                type="text"
                value={form.payment_method}
                onChange={e => setForm((f: any) => ({ ...f, payment_method: e.target.value }))}
                placeholder="Pix, cartão, dinheiro, etc"
              />
            </div>
            <div className="md:col-span-3 text-right">
              <Button variant="outline" size="sm" type="button" onClick={() => setIsFormOpen(false)}>
                Cancelar
              </Button>
              <Button size="sm" type="submit" className="ml-2">
                Salvar
              </Button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="space-y-2">
            {[...Array(2)].map((_, i) => (
              <Skeleton key={i} className="h-8 w-full rounded" />
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-gray-400 text-center py-4">
            Nenhuma transação cadastrada para este evento.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Forma</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map(tx => (
                <TableRow key={tx.id}>
                  <TableCell>{tipoBadge(tx.type)} {tx.type}</TableCell>
                  <TableCell className={tx.type === "entrada" ? "text-green-600 font-semibold" : "text-yellow-700 font-semibold"}>
                    R$ {tx.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>{tx.transaction_date && new Date(tx.transaction_date).toLocaleDateString(undefined, { timeZone: "UTC" })}</TableCell>
                  <TableCell>{tx.description}</TableCell>
                  <TableCell>{tx.category}</TableCell>
                  <TableCell>{tx.payment_method}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
