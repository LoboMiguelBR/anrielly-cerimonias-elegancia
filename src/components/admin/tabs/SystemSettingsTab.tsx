
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Settings } from "lucide-react";
import { useSystemSettings, SystemSetting } from "@/hooks/useSystemSettings";
import { toast } from "sonner";

export default function SystemSettingsTab() {
  const { settings, loading, upsertSetting } = useSystemSettings();
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<{ [key: string]: any }>({});

  const handleEdit = (setting: SystemSetting) => {
    setEditing(setting.id);
    setForm({
      value: typeof setting.value === "string" ? setting.value : JSON.stringify(setting.value, null, 2),
      description: setting.description || ""
    });
  };

  const handleSave = async (setting: SystemSetting) => {
    try {
      let value = form.value;
      // Tentar parsear para JSON se for válido
      try {
        value = JSON.parse(value);
      } catch {
        // Mantém como string se não for JSON válido
      }
      await upsertSetting(setting.key, value, form.description);
      setEditing(null);
    } catch (e: any) {
      toast.error(e.message || "Erro ao salvar configuração");
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="w-7 h-7 text-blue-600" />
        <h2 className="font-playfair text-2xl font-bold">Configurações do Sistema</h2>
      </div>
      <div className="bg-white rounded-lg shadow p-4 max-w-3xl mx-auto">
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-1">
                <Skeleton className="h-4 w-[50%]" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        ) : settings.length === 0 ? (
          <div className="text-gray-400 text-center py-10">
            Nenhuma configuração encontrada.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-gray-600 text-left">
                <th className="p-2 font-semibold">Chave</th>
                <th className="p-2 font-semibold">Valor</th>
                <th className="p-2 font-semibold">Descrição</th>
                <th className="p-2"></th>
              </tr>
            </thead>
            <tbody>
              {settings.map(setting => (
                <tr key={setting.id} className="border-b hover:bg-blue-50 transition">
                  <td className="p-2 font-mono">{setting.key}</td>
                  <td className="p-2">
                    {editing === setting.id ? (
                      <Textarea
                        value={form.value}
                        onChange={e => setForm(f => ({ ...f, value: e.target.value }))}
                        rows={2}
                        className="font-mono text-xs"
                        required
                      />
                    ) : (
                      <pre className="text-xs bg-gray-100 rounded p-1 whitespace-pre-wrap">
                        {typeof setting.value === "string"
                          ? setting.value
                          : JSON.stringify(setting.value, null, 2)
                        }
                      </pre>
                    )}
                  </td>
                  <td className="p-2 w-48">
                    {editing === setting.id ? (
                      <Input
                        value={form.description}
                        onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                        placeholder="Descrição"
                      />
                    ) : (
                      <span className="truncate">{setting.description || "-"}</span>
                    )}
                  </td>
                  <td className="p-2 w-28">
                    {editing === setting.id ? (
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleSave(setting)}>
                          Salvar
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditing(null)}>
                          Cancelar
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(setting)}
                      >
                        Editar
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div className="text-xs text-muted-foreground pt-6 text-center">
        Configurações avançadas do sistema. Use com cuidado.
      </div>
    </div>
  );
}
