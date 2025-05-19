
import React from 'react';

interface QuoteRequest {
  id: number;
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

const QuoteRequestsTable = ({ quoteRequests }: QuoteRequestsTableProps) => {
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
          </tr>
        </thead>
        <tbody>
          {quoteRequests.map(request => (
            <tr key={request.id} className="border-t hover:bg-gray-50">
              <td className="p-3">{request.name}</td>
              <td className="p-3">{new Date(request.date).toLocaleDateString('pt-BR')}</td>
              <td className="p-3">{request.eventType}</td>
              <td className="p-3">{request.phone}</td>
              <td className="p-3">{request.eventLocation}</td>
              <td className="p-3">
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {request.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuoteRequestsTable;
