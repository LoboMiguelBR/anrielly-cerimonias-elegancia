
import React from 'react';
import { Button } from "@/components/ui/button";

interface QuoteRequest {
  id: number;
  name: string;
  date: string;
  eventType: string;
  phone: string;
  email: string;
  eventLocation: string;
}

interface QuotesTabProps {
  quoteRequests: QuoteRequest[];
}

const QuotesTab = ({ quoteRequests }: QuotesTabProps) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Gerenciar Solicitações de Orçamento</h2>
      <p className="text-gray-500 mb-8">Esta seção será implementada com o Supabase para gerenciamento das solicitações recebidas pelo formulário de contato.</p>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left">Nome</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Telefone</th>
              <th className="p-3 text-left">Tipo de Evento</th>
              <th className="p-3 text-left">Data</th>
              <th className="p-3 text-left">Local</th>
              <th className="p-3 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {quoteRequests.map(request => (
              <tr key={request.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{request.name}</td>
                <td className="p-3">cliente@exemplo.com</td>
                <td className="p-3">{request.phone}</td>
                <td className="p-3">{request.eventType}</td>
                <td className="p-3">{new Date(request.date).toLocaleDateString('pt-BR')}</td>
                <td className="p-3">Volta Redonda, RJ</td>
                <td className="p-3">
                  <Button size="sm" variant="outline" className="text-xs">
                    Criar Proposta
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QuotesTab;
