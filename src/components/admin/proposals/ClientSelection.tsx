
import React from 'react';
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ClientSelectionProps {
  quoteRequests: Array<{
    id: string;
    name: string;
    email?: string;
    phone?: string;
    event_type?: string;
    event_date?: string;
    event_location?: string;
  }>;
  selectedQuote: string;
  handleQuoteSelect: (quoteId: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

const ClientSelection: React.FC<ClientSelectionProps> = ({
  quoteRequests,
  selectedQuote,
  handleQuoteSelect,
  isLoading,
  disabled = false
}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="quote-select">Selecionar cliente de um orçamento</Label>
            <Select 
              value={selectedQuote} 
              onValueChange={handleQuoteSelect}
              disabled={isLoading || disabled}
            >
              <SelectTrigger id="quote-select" className="w-full mt-1">
                <SelectValue placeholder="Selecionar orçamento" />
              </SelectTrigger>
              <SelectContent>
                {quoteRequests.map((quote) => (
                  <SelectItem key={quote.id} value={quote.id}>
                    {quote.name} - {quote.event_type || "Evento"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedQuote && (
            <>
              {quoteRequests.filter(q => q.id === selectedQuote).map((quote) => (
                <div key={quote.id} className="space-y-2">
                  <div>
                    <Label htmlFor="client-name">Nome do cliente</Label>
                    <Input
                      id="client-name"
                      value={quote.name}
                      readOnly
                      className="mt-1 bg-gray-50"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="client-email">Email</Label>
                      <Input
                        id="client-email"
                        value={quote.email || ""}
                        readOnly
                        className="mt-1 bg-gray-50"
                      />
                    </div>
                    <div>
                      <Label htmlFor="client-phone">Telefone</Label>
                      <Input
                        id="client-phone"
                        value={quote.phone || ""}
                        readOnly
                        className="mt-1 bg-gray-50"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="event-type">Tipo de evento</Label>
                      <Input
                        id="event-type"
                        value={quote.event_type || ""}
                        readOnly
                        className="mt-1 bg-gray-50"
                      />
                    </div>
                    <div>
                      <Label htmlFor="event-date">Data do evento</Label>
                      <Input
                        id="event-date"
                        value={quote.event_date || ""}
                        readOnly
                        className="mt-1 bg-gray-50"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="event-location">Local do evento</Label>
                    <Input
                      id="event-location"
                      value={quote.event_location || ""}
                      readOnly
                      className="mt-1 bg-gray-50"
                    />
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientSelection;
