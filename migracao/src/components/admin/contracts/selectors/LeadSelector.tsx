
import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { User, Plus } from 'lucide-react';
import { useQuoteRequests } from '@/hooks/useQuoteRequests';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  event_type: string;
  event_date: string | null;
  event_location: string;
  message: string | null;
  status: string;
}

interface LeadSelectorProps {
  onLeadSelect: (lead: Lead | null) => void;
  selectedLeadId?: string;
}

const LeadSelector = ({ onLeadSelect, selectedLeadId }: LeadSelectorProps) => {
  const { data: leads = [], isLoading } = useQuoteRequests();
  const [showNewClientOption, setShowNewClientOption] = useState(false);

  const handleLeadSelect = (leadId: string) => {
    if (leadId === 'new') {
      setShowNewClientOption(true);
      onLeadSelect(null);
      return;
    }

    const selectedLead = leads.find(lead => lead.id === leadId);
    if (selectedLead) {
      setShowNewClientOption(false);
      onLeadSelect(selectedLead);
    }
  };

  const handleNewClient = () => {
    setShowNewClientOption(true);
    onLeadSelect(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Label>Selecionar Cliente</Label>
        <div className="h-10 bg-gray-100 animate-pulse rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="lead-select">Selecionar Cliente</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleNewClient}
          className="text-sm"
        >
          <Plus className="h-3 w-3 mr-1" />
          Novo Cliente
        </Button>
      </div>

      {!showNewClientOption && (
        <Select 
          value={selectedLeadId || ""} 
          onValueChange={handleLeadSelect}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione um lead existente ou crie novo">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                {selectedLeadId ? 
                  leads.find(l => l.id === selectedLeadId)?.name || "Lead selecionado"
                  : "Selecione um lead existente"
                }
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="new">
              <div className="flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Novo Cliente
              </div>
            </SelectItem>
            {leads.map((lead) => (
              <SelectItem key={lead.id} value={lead.id}>
                <div className="flex flex-col">
                  <span className="font-medium">{lead.name}</span>
                  <span className="text-sm text-gray-500">
                    {lead.email} • {lead.event_type}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {showNewClientOption && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            Modo de criação de novo cliente ativado. Preencha os dados manualmente abaixo.
          </p>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowNewClientOption(false)}
            className="mt-2 text-blue-600 hover:text-blue-800"
          >
            Voltar à seleção de leads
          </Button>
        </div>
      )}
    </div>
  );
};

export default LeadSelector;
