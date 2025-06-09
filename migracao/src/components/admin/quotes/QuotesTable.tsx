
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import QuoteStatusBadge from './QuoteStatusBadge';
import { useMobileLayout } from '@/hooks/useMobileLayout';
import { Phone, Mail, MapPin, Calendar, User, Trash2 } from 'lucide-react';
import { useQuoteActions } from '@/hooks/useQuoteActions';

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
  onRefresh: () => void;
}

const QuotesTable: React.FC<QuotesTableProps> = ({ quoteRequests, onViewDetails, onRefresh }) => {
  const { isMobile } = useMobileLayout();
  const { deleteQuote, loading } = useQuoteActions();

  const handleDelete = async (id: string) => {
    const success = await deleteQuote(id);
    if (success) {
      onRefresh();
    }
  };

  if (!quoteRequests || quoteRequests.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-gray-500">Nenhuma solicitação de orçamento encontrada</p>
        </CardContent>
      </Card>
    );
  }

  // Mobile Card Layout
  if (isMobile) {
    return (
      <div className="space-y-3">
        {quoteRequests.map(request => (
          <Card key={request.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {request.name}
                </CardTitle>
                <QuoteStatusBadge status={request.status} />
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-1 gap-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span className="truncate">{request.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span>{request.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span className="truncate">{request.event_location}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {request.event_date 
                      ? new Date(request.event_date).toLocaleDateString('pt-BR')
                      : 'Data não informada'}
                  </span>
                </div>
              </div>
              <div className="pt-3 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    {request.event_type}
                  </span>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-xs"
                      onClick={() => onViewDetails(request.id)}
                    >
                      Ver Detalhes
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir a solicitação de "{request.name}"? 
                            Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(request.id)}
                            disabled={loading}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            {loading ? 'Excluindo...' : 'Excluir'}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Desktop Table Layout
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
          {quoteRequests.map(request => (
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
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-xs"
                    onClick={() => onViewDetails(request.id)}
                  >
                    Ver Detalhes
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja excluir a solicitação de "{request.name}"? 
                          Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(request.id)}
                          disabled={loading}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          {loading ? 'Excluindo...' : 'Excluir'}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default QuotesTable;
