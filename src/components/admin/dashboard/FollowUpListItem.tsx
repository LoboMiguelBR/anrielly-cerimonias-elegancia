
import React from "react";
import { Bell, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type FollowUpStatus = "pendente" | "atrasado" | "feito";
export interface FollowUpItemProps {
  id: number;
  title: string;
  status: FollowUpStatus;
  contact: string;
  tipo: string;
  lastAction: string;
  onMarkDone: (id: number) => void;
}

export const FollowUpListItem: React.FC<FollowUpItemProps> = ({
  id, title, status, contact, tipo, lastAction, onMarkDone
}) => (
  <li className="py-4 flex items-center gap-4">
    <span>
      <Bell className={`inline w-5 h-5 ${status === "atrasado" ? "text-red-500" : "text-yellow-500"}`} />
    </span>
    <div className="flex-1">
      <span className="font-semibold">{title}</span>
      <span className="ml-2 text-xs text-gray-500">({contact} | {tipo})</span>
      <div className="mt-1 text-xs text-gray-400">Última ação: {lastAction}</div>
    </div>
    <div>
      {status === "feito" ? (
        <span className="flex items-center text-green-600"><CheckCircle className="w-4 h-4 mr-1" /> Feito</span>
      ) : (
        <Button variant="outline" size="sm" onClick={() => onMarkDone(id)}>
          Marcar como feito
        </Button>
      )}
    </div>
    {status === "atrasado" && (
      <span className="ml-2 text-red-500 flex items-center text-xs">
        <XCircle className="w-4 h-4 mr-1" />Atrasado
      </span>
    )}
  </li>
);
