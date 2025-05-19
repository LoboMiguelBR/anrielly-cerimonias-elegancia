
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle, FileText } from 'lucide-react';

interface QuoteRequest {
  id: string;
  name: string;
  date: string;
  eventType: string;
  phone: string;
  status: string;
  email: string;
  eventLocation: string;
}

interface QuoteRequestsTableProps {
  quoteRequests: QuoteRequest[];
}

const statusColors = {
  aguardando: "bg-gray-100 text-gray-800",
  enviado: "bg-blue-100 text-blue-800",
  proposta: "bg-green-100 text-green-800"
};

const statusIcons = {
  aguardando: <Clock className="w-3 h-3 mr-1" />,
  enviado: <CheckCircle className="w-3 h-3 mr-1" />,
  proposta: <FileText className="w-3 h-3 mr-1" />
};

const QuoteRequestsTable = ({ quoteRequests }: QuoteRequestsTableProps) => {
  const navigate = useNavigate();

  const handleViewDetails = (id: string) => {
    navigate(`/admin/dashboard?tab=quotes&quoteId=${id}`);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 text-left">Nome</th>
            <th className="p-3 text-left">Data do Evento</th>
            <th className="p-3 text-left">Tipo</th>
            <th className="p-3 text-left">Contato</th>
            <th className="p-3 text-left">Local</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Ações</th>
          </tr>
        </thead>
        <tbody>
          {quoteRequests.length > 0 ? (
            quoteRequests.map(request => (
              <tr key={request.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{request.name}</td>
                <td className="p-3">{typeof request.date === 'string' ? new Date(request.date).toLocaleDateString('pt-BR') : '-'}</td>
                <td className="p-3">{request.eventType}</td>
                <td className="p-3">{request.phone}</td>
                <td className="p-3">{request.eventLocation}</td>
                <td className="p-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[request.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
                    {statusIcons[request.status as keyof typeof statusIcons]}
                    {request.status}
                  </span>
                </td>
                <td className="p-3">
                  <Button variant="outline" size="sm" className="text-xs" onClick={() => handleViewDetails(request.id)}>
                    Detalhes
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="p-4 text-center text-gray-500">Nenhuma solicitação encontrada</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default QuoteRequestsTable;
