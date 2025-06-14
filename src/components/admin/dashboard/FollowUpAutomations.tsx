
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap } from "lucide-react";
import { toast } from "sonner";
import { FollowUpListItem, FollowUpItemProps } from "./FollowUpListItem";

const demoFollowUps: FollowUpItemProps[] = [
  {
    id: 1,
    title: "Lead aguardando retorno",
    status: "pendente",
    contact: "Maria Silva",
    tipo: "WhatsApp",
    lastAction: "há 2 dias",
    onMarkDone: () => {},
  },
  {
    id: 2,
    title: "Proposta enviada há 3 dias",
    status: "atrasado",
    contact: "João Carlos",
    tipo: "E-mail",
    lastAction: "há 3 dias",
    onMarkDone: () => {},
  },
];

// Remover a função onMarkDone de cada item de demo, ela será adicionada nos props
const FollowUpAutomations = () => {
  const [items, setItems] = useState<Omit<FollowUpItemProps, "onMarkDone">[]>(demoFollowUps.map(({ onMarkDone, ...rest }) => rest));

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
            <FollowUpListItem key={item.id} {...item} onMarkDone={handleFollowUp} />
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
