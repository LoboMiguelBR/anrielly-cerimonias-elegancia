
import React, { useState } from "react";
import { Bell, Zap, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Estrutura demo para follow ups automáticos
const demoFollowUps = [
  {
    id: 1,
    title: "Lead aguardando retorno",
    status: "pendente",
    contact: "Maria Silva",
    tipo: "WhatsApp",
    lastAction: "há 2 dias",
  },
  {
    id: 2,
    title: "Proposta enviada há 3 dias",
    status: "atrasado",
    contact: "João Carlos",
    tipo: "E-mail",
    lastAction: "há 3 dias",
  },
];

const FollowUpAutomations = () => {
  const [items, setItems] = useState(demoFollowUps);

  const handleFollowUp = (id: number) => {
    setItems(items =>
      items.map(item =>
        item.id === id ? { ...item, status: "feito" } : item
      )
    );
    toast.success("Follow-up marcado como feito!");
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>
          <Zap className="inline-block mr-2 text-yellow-500" /> Follow-ups Automáticos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="divide-y divide-gray-100">
          {items.length === 0 && <li className="py-6 text-gray-400">Nenhum follow-up pendente.</li>}
          {items.map(item => (
            <li key={item.id} className="py-4 flex items-center gap-4">
              <span>
                <Bell className={`inline w-5 h-5 ${item.status === "atrasado" ? "text-red-500" : "text-yellow-500"}`} />
              </span>
              <div className="flex-1">
                <span className="font-semibold">{item.title}</span>
                <span className="ml-2 text-xs text-gray-500">({item.contact} | {item.tipo})</span>
                <div className="mt-1 text-xs text-gray-400">Última ação: {item.lastAction}</div>
              </div>
              <div>
                {item.status === "feito" ? (
                  <span className="flex items-center text-green-600"><CheckCircle className="w-4 h-4 mr-1" /> Feito</span>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => handleFollowUp(item.id)}>
                    Marcar como feito
                  </Button>
                )}
              </div>
              {item.status === "atrasado" && (
                <span className="ml-2 text-red-500 flex items-center text-xs">
                  <XCircle className="w-4 h-4 mr-1" />Atrasado
                </span>
              )}
            </li>
          ))}
        </ul>
        <div className="text-xs text-gray-400 mt-4">
          Os lembretes de follow-up são sugeridos automaticamente com base nas ações registradas.
        </div>
      </CardContent>
    </Card>
  );
};

export default FollowUpAutomations;
