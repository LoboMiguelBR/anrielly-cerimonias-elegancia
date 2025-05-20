
import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import QuoteStatusBadge from './QuoteStatusBadge';

interface QuoteRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  event_type: string;
  event_date: string | null;
  event_location: string;
  status: string;
}

interface QuotesTableProps {
  quoteRequests: QuoteRequest[] | undefined;
  onViewDetails: (id: string) => void;
}

const QuotesTable: React.FC<QuotesTableProps> = ({ quoteRequests, onViewDetails }) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Telefone</TableHead>
            <TableHead>Tipo de Evento</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Local</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {quoteRequests && quoteRequests.length > 0 ? (
            quoteRequests.map(request => (
              <TableRow key={request.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">{request.name}</TableCell>
                <TableCell>{request.email}</TableCell>
                <TableCell>{request.phone}</TableCell>
                <TableCell>{request.event_type}</TableCell>
                <TableCell>
                  {request.event_date 
                    ? new Date(request.event_date).toLocaleDateString('pt-BR')
                    : '-'}
                </TableCell>
                <TableCell>{request.event_location}</TableCell>
                <TableCell>
                  <QuoteStatusBadge status={request.status} />
                </TableCell>
                <TableCell>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-xs"
                    onClick={() => onViewDetails(request.id)}
                  >
                    Ver Detalhes
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                Nenhuma solicitação de orçamento encontrada
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default QuotesTable;
