
import React from "react";

export interface FollowUpItemProps {
  id: number;
  title: string;
  status: "pendente" | "atrasado" | "feito";
  contact: string;
  tipo: "WhatsApp" | "E-mail";
  lastAction: string;
  onMarkDone: (id: number) => void;
}

export const FollowUpListItem = ({ 
  id, 
  title, 
  status, 
  contact, 
  tipo, 
  lastAction, 
  onMarkDone 
}: FollowUpItemProps) => {
  const getStatusColor = () => {
    switch (status) {
      case "pendente": return "text-yellow-600";
      case "atrasado": return "text-red-600";
      case "feito": return "text-green-600";
      default: return "text-gray-600";
    }
  };

  const getStatusBg = () => {
    switch (status) {
      case "pendente": return "bg-yellow-50";
      case "atrasado": return "bg-red-50";
      case "feito": return "bg-green-50";
      default: return "bg-gray-50";
    }
  };

  return (
    <li className={`py-4 px-4 rounded-lg ${getStatusBg()}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h4 className="font-medium text-gray-900">{title}</h4>
          <p className="text-sm text-gray-600">{contact} • {tipo}</p>
          <p className="text-xs text-gray-500">{lastAction}</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`text-xs font-medium ${getStatusColor()}`}>
            {status}
          </span>
          {status !== "feito" && (
            <button
              onClick={() => onMarkDone(id)}
              className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
            >
              Marcar como feito
            </button>
          )}
        </div>
      </div>
    </li>
  );
};
